"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  Calendar,
  Tag,
  ExternalLink,
  ImageIcon,
  User,
  ArrowLeft,
  Save,
  LogOut,
  Briefcase,
} from "lucide-react";

const categories = [
  "Semua",
  "Batik",
  "Keramik",
  "Fashion",
  "Desain",
  "Fotografi",
  "Musik",
  "Coding",
  "Kerajinan",
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [portfolioItem, setPortfolioItem] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data dari API Next.js
  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const res = await fetch("/api/browse");
        const data = await res.json();
        if (res.ok) {
          setPortfolioItem(data.data || []);
        } else {
          console.error("Gagal ambil data:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItem();
  }, []);

  // 🔹 Filter hasil pencarian
  const filteredItems = portfolioItem.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // 🔹 Sorting hasil
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Hero */}
      <section className="bg-linear-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Temukan Karya Kreatif</h1>
          <p className="text-xl text-white/90 mb-8">
            Jelajahi portofolio para seniman dan kreator terbaik
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
            <Input
              type="text"
              placeholder="Cari karya atau seniman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </section>

      {/* 🟣 Filter Section */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" /> Filter
          </Button>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-gray-600">
            {loading
              ? "Memuat..."
              : `${sortedItems.length} portofolio ditemukan`}
          </div>
        </div>
      </section>

      {/* 🟣 Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-500">Memuat data...</div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Tidak ada portofolio ditemukan 😢
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow group"
                >
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="text-gray-500">
                      {item.seniman_name || "Siapa Hayoooo Tebakkk"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {item.image_urls ? (
                      <img
                        src={item.image_urls}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    <p className="text-gray-700 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 gap-2">
                      <Calendar className="h-4 w-4" />
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("id-ID")
                        : "Tanggal tidak diketahui"}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.category && (
                        <Badge variant="outline">{item.category}</Badge>
                      )}
                      {item.tools_used && (
                        <Badge variant="secondary">{item.tools_used}</Badge>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Link href={`/browse/${item.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Lihat Detail
                        </Button>
                      </Link>
                      {item.video_url && (
                        <Button asChild size="sm" variant="ghost">
                          <a href={item.video_url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
