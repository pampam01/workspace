import { NextRequest, NextResponse } from "next/server";
import {
  PaymentGateway,
  PaymentMethod,
  Prisma,
  TransactionStatus,
} from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSnapTransaction } from "@/lib/midtrans";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      projectId,
      amount,
      paymentMethod = PaymentMethod.BANK_TRANSFER,
      description,
    } = body;

    const amountNumber = Number(amount);

    if (!projectId || Number.isNaN(amountNumber) || amountNumber <= 0) {
      return NextResponse.json(
        { error: "projectId dan amount wajib diisi" },
        { status: 400 }
      );
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        klien: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                phone: true,
              },
            },
          },
        },
        seniman: {
          select: {
            id: true,
            user: { select: { email: true, first_name: true, last_name: true, phone: true } },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    if (project.klien.user.id !== session.user.id) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses ke proyek ini" },
        { status: 403 }
      );
    }

    if (!project.seniman) {
      return NextResponse.json(
        { error: "Proyek belum memiliki seniman terpilih" },
        { status: 400 }
      );
    }

    const allowedMethods = Object.values(PaymentMethod);
    const normalizedPaymentMethod = allowedMethods.includes(paymentMethod)
      ? paymentMethod
      : PaymentMethod.BANK_TRANSFER;

    const feePercentage = new Prisma.Decimal(10);
    const amountDecimal = new Prisma.Decimal(amountNumber);
    const platformFee = amountDecimal.mul(feePercentage).div(100);
    const netAmount = amountDecimal.sub(platformFee);

    const orderId = `ARTISAN-${projectId}-${Date.now()}`;

    const transactionRecord = await db.transaction.create({
      data: {
        project_id: project.id,
        klien_id: project.klien_id,
        seniman_id: project.seniman.id,
        amount: amountDecimal,
        payment_method: normalizedPaymentMethod,
        payment_gateway: PaymentGateway.MIDTRANS,
        gateway_transaction_id: orderId,
        platform_fee: platformFee,
        net_amount: netAmount,
        fee_percentage: feePercentage,
        status: TransactionStatus.PENDING,
      },
    });

    const snapResponse = await createSnapTransaction({
      order_id: orderId,
      gross_amount: amountNumber,
      description: description || project.title,
      customer_details: {
        first_name: project.klien.user.first_name,
        last_name: project.klien.user.last_name,
        email: project.klien.user.email,
        phone: project.klien.user.phone,
      },
      item_details: [
        {
          id: project.id,
          price: Number(amount),
          quantity: 1,
          name: project.title,
          category: project.category,
          merchant_name: project.klien.user.first_name || "ArtisanHub",
        },
      ],
    });

    return NextResponse.json({
      token: snapResponse.token,
      redirect_url: snapResponse.redirect_url,
      transaction_id: transactionRecord.id,
    });
  } catch (error) {
    console.error("Midtrans payment error", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat memproses pembayaran";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
