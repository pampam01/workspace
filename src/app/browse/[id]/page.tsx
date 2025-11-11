"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioItem } from "@prisma/client";

export default function SenimanProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [portofolioItem, setPortofolioItem] = useState<PortfolioItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const response = await fetch(`/api/browse`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch seniman profile");

        const data = await response.json();

        // Filter berdasarkan ID dari URL
        const filtered = data.data.find(
          (item: PortfolioItem) => item.id == params.id
        );
        setPortofolioItem(filtered || null);
        console.log("Filtered item:", filtered);
      } catch (error) {
        console.error("Error fetching seniman profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">
                ArtisanHub
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Item Detail */}
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-3">
          Detail Item
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src={portofolioItem?.image_urls as string}
              alt={portofolioItem?.title as string}
              className="rounded-xl shadow-lg w-full max-w-sm h-80 object-cover"
            />
          </div>

          {/* Detail Section */}
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">
              {portofolioItem?.title}
            </h2>

            <p className="text-base leading-relaxed">
              {portofolioItem?.description}
            </p>

            <div className="pt-3 border-t space-y-2">
              <p>
                <span className="font-semibold text-gray-900">Kategori:</span>{" "}
                {portofolioItem?.category}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Klien:</span>{" "}
                {portofolioItem?.client_name}
              </p>
              <p>
                <span className="font-semibold text-gray-900">
                  Tanggal Dibuat:
                </span>{" "}
                {new Date(
                  portofolioItem?.created_at as Date
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="pt-5 flex gap-2">
              {/* Tombol Kembali */}
              <button
                onClick={() => window.history.back()}
                className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Kembali
              </button>

              {/* Tombol Lihat Project */}
              <button
                onClick={() => router.push(`/projects/${params.id}`)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500  transition"
              >
                Lihat Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold">ArtisanHub</span>
              </div>
              <p className="text-gray-400">
                Platform terpercaya untuk menghubungkan seniman berbakat dengan
                klien yang membutuhkan jasa kreatif.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse" className="hover:text-white transition">
                    Jelajahi Seniman
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="hover:text-white transition"
                  >
                    Proyek
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white transition"
                  >
                    Kategori
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition"
                  >
                    Cara Kerja
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Seniman</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/dashboard/seniman"
                    className="hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seniman/portfolio"
                    className="hover:text-white transition"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seniman/earnings"
                    className="hover:text-white transition"
                  >
                    Pendapatan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seniman/analytics"
                    className="hover:text-white transition"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Klien</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/dashboard/klien"
                    className="hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/klien/projects"
                    className="hover:text-white transition"
                  >
                    Proyek Saya
                  </Link>
                </li>
                <li>
                  <Link
                    href="/klien/transactions"
                    className="hover:text-white transition"
                  >
                    Transaksi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/klien/support"
                    className="hover:text-white transition"
                  >
                    Bantuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ArtisanHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
