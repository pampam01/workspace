"use client";

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
import {
  Search,
  Users,
  Briefcase,
  Star,
  Palette,
  Scissors,
  Camera,
  Music,
  Brush,
  Hammer,
  Code,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
} from "lucide-react";

const categories = [
  { name: "Batik", icon: Palette, count: 156 },
  { name: "Keramik", icon: Hammer, count: 89 },
  { name: "Fashion", icon: Scissors, count: 234 },
  { name: "Desain", icon: Brush, count: 312 },
  { name: "Fotografi", icon: Camera, count: 178 },
  { name: "Musik", icon: Music, count: 145 },
  { name: "Coding", icon: Code, count: 267 },
  { name: "Kerajinan", icon: ShoppingBag, count: 198 },
];

const features = [
  {
    title: "Seniman Terverifikasi",
    description:
      "Semua seniman melalui proses verifikasi untuk memastikan kualitas dan profesionalisme.",
    icon: CheckCircle,
  },
  {
    title: "Sistem Escrow Aman",
    description:
      "Pembayaran Anda aman dengan sistem escrow, uang dilepas setelah pekerjaan selesai.",
    icon: Shield,
  },
  {
    title: "Rating & Review Transparan",
    description:
      "Lihat rating dan review dari klien lain sebelum memutuskan untuk bekerja sama.",
    icon: Star,
  },
  {
    title: "Proyek Beragam",
    description:
      "Dari proyek kecil hingga besar, temukan seniman yang tepat untuk kebutuhan Anda.",
    icon: Briefcase,
  },
];

const stats = [
  { label: "Seniman Aktif", value: "1,200+" },
  { label: "Proyek Selesai", value: "3,500+" },
  { label: "Klien Puas", value: "98%" },
  { label: "Total Transaksi", value: "Rp 2.5M+" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">
                ArtisanHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Fitur
              </Link>
              <Link
                href="#categories"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Kategori
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Cara Kerja
              </Link>
              <Link
                href="/browse"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Jelajahi
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Daftar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Temukan Seniman Talenta
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                {" "}
                Indonesia
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Hubungkan dengan seniman berbakat untuk proyek kreatif Anda. Dari
              batik tradisional hingga desain modern, temukan talenta yang tepat
              di sini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Bergabung sebagai Seniman
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3"
                >
                  Cari Seniman
                  <Search className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih ArtisanHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform terpercaya untuk menghubungkan seniman berbakat dengan
              klien yang membutuhkan jasa kreatif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Jelajahi Kategori Seni
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan seniman sesuai dengan kebutuhan proyek Anda dari berbagai
              kategori seni dan kerajinan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/kategori/${category.name.toLowerCase()}`}
              >
                <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-linear-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition">
                        <category.icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.count} seniman tersedia
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja ArtisanHub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tiga langkah mudah untuk mulai berkolaborasi dengan seniman
              berbakat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Daftar & Verifikasi
              </h3>
              <p className="text-gray-600">
                Buat akun Anda, lengkapi profil, dan melalui proses verifikasi
                untuk memastikan kualitas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Posting & Cari
              </h3>
              <p className="text-gray-600">
                Posting proyek Anda atau cari seniman yang sesuai dengan
                kebutuhan dan budget Anda.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Kolaborasi & Bayar
              </h3>
              <p className="text-gray-600">
                Mulai kolaborasi, pantau progress, dan bayar dengan aman melalui
                sistem escrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Siap Memulai Proyek Kreatif Anda?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bergabunglah dengan ribuan seniman dan klien yang sudah mempercayai
            ArtisanHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600"
              >
                Jelajahi Seniman
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
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
