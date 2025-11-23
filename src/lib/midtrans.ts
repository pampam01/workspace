const MIDTRANS_SANDBOX = "https://app.sandbox.midtrans.com/snap/v1";
const MIDTRANS_PRODUCTION = "https://app.midtrans.com/snap/v1";

interface SnapCustomerDetails {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
}

interface SnapItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
  category?: string;
  merchant_name?: string;
}

export interface SnapTransactionParams {
  order_id: string;
  gross_amount: number;
  customer_details?: SnapCustomerDetails;
  item_details?: SnapItemDetail[];
  description?: string;
}

function getConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.MIDTRANS_PRODUCTION === "true";

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi");
  }

  return {
    serverKey,
    clientKey,
    baseUrl: isProduction ? MIDTRANS_PRODUCTION : MIDTRANS_SANDBOX,
    isProduction,
  };
}

export async function createSnapTransaction(params: SnapTransactionParams) {
  const { serverKey, baseUrl } = getConfig();
  const authHeader = Buffer.from(`${serverKey}:`).toString("base64");

  const payload = {
    transaction_details: {
      order_id: params.order_id,
      gross_amount: params.gross_amount,
    },
    customer_details: params.customer_details,
    item_details: params.item_details,
    metadata: params.description ? { description: params.description } : undefined,
    credit_card: {
      secure: true,
    },
  };

  const response = await fetch(`${baseUrl}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Gagal membuat transaksi Midtrans: ${response.status} ${response.statusText} ${errorText}`.trim()
    );
  }

  return response.json() as Promise<{
    token: string;
    redirect_url: string;
  }>;
}
