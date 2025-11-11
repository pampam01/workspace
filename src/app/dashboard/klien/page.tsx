"use client";

import { useState, useEffect } from "react";
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
import {
  Briefcase,
  Star,
  TrendingUp,
  Clock,
  Calendar,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Users,
  Eye,
  Heart,
  Plus,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Building,
} from "lucide-react";

// Mock data untuk dashboard klien
const mockDashboardData = {
  user: {
    id: "1",
    name: "PT Creative Studio",
    avatar: "/avatars/company1.jpg",
    email: "info@creativestudio.com",
    company_size: "MEDIUM",
    industry: "Fashion & Retail",
  },
  stats: {
    total_projects: 24,
    active_projects: 3,
    completed_projects: 21,
    total_spent: 85000000,
    monthly_spent: 12000000,
    average_rating: 4.7,
    total_reviews: 18,
    saved_artisans: 12,
    pending_proposals: 5,
  },
  recentProjects: [
    {
      id: "1",
      title: "Desain Koleksi Fashion Spring/Summer",
      category: "Fashion",
      status: "POSTED",
      budget: 5000000,
      budget_type: "FIXED",
      deadline: "2024-03-15",
      proposals_count: 8,
      created_at: "2024-01-20",
    },
    {
      id: "2",
      title: "Branding untuk Produk Baru",
      category: "Desain",
      status: "IN_PROGRESS",
      budget: 3500000,
      budget_type: "FIXED",
      deadline: "2024-02-28",
      proposals_count: 12,
      created_at: "2024-01-10",
      hired_seniman: {
        name: "Budi Santoso",
        avatar: "/avatars/budi.jpg",
        rating: 4.9,
      },
    },
    {
      id: "3",
      title: "Fotografi Produk Lookbook",
      category: "Fotografi",
      status: "NEGOTIATING",
      budget: 2000000,
      budget_type: "HOURLY",
      deadline: "2024-02-15",
      proposals_count: 5,
      created_at: "2024-01-18",
      negotiating_seniman: {
        name: "Maya Putri",
        avatar: "/avatars/maya.jpg",
        rating: 4.7,
      },
    },
  ],
  notifications: [
    {
      id: "1",
      type: "proposal_received",
      title: "Proposal Baru Diterima",
      description:
        'Siti Nurhaliza mengirim proposal untuk proyek "Desain Koleksi Fashion"',
      time: "1 jam yang lalu",
      is_read: false,
    },
    {
      id: "2",
      type: "project_update",
      title: "Update Proyek",
      description:
        'Budi Santoso mengupdate progress proyek "Branding untuk Produk Baru"',
      time: "3 jam yang lalu",
      is_read: false,
    },
    {
      id: "3",
      type: "message_received",
      title: "Pesan Baru",
      description: "Anda menerima pesan dari Maya Putri",
      time: "5 jam yang lalu",
      is_read: true,
    },
  ],
  savedArtisans: [
    {
      id: "1",
      name: "Siti Nurhaliza",
      avatar: "/avatars/siti.jpg",
      category: "Batik, Fashion",
      rating: 4.8,
      rate_per_hour: 150000,
      total_projects: 67,
    },
    {
      id: "2",
      name: "Budi Santoso",
      avatar: "/avatars/budi.jpg",
      category: "Desain, Coding",
      rating: 4.9,
      rate_per_hour: 200000,
      total_projects: 48,
    },
    {
      id: "3",
      name: "Maya Putri",
      avatar: "/avatars/maya.jpg",
      category: "Fotografi",
      rating: 4.7,
      rate_per_hour: 175000,
      total_projects: 35,
    },
  ],
  recentTransactions: [
    {
      id: "1",
      project_title: "Website Redesign",
      seniman_name: "Doni Prasetyo",
      amount: 5000000,
      status: "COMPLETED",
      date: "2024-01-15",
    },
    {
      id: "2",
      project_title: "Logo Design",
      seniman_name: "Ahmad Fadli",
      amount: 1500000,
      status: "PROCESSING",
      date: "2024-01-18",
    },
  ],
};

export default function KlienDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(mockDashboardData);

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "POSTED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800";
      case "NEGOTIATING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "POSTED":
        return "Diposting";
      case "IN_PROGRESS":
        return "Sedang Berjalan";
      case "NEGOTIATING":
        return "Negosiasi";
      case "COMPLETED":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">
                ArtisanHub
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                  {data.notifications.filter((n) => !n.is_read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback>
                    {data.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{data.user.name}</div>
                  <div className="text-xs text-gray-500">Klien</div>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat datang kembali, {data.user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Kelola proyek dan temukan seniman berbakat untuk kebutuhan bisnis
            Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Proyek
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.total_projects}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats.active_projects} sedang berjalan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pengeluaran
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {data.stats.total_spent.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                +Rp {data.stats.monthly_spent.toLocaleString("id-ID")} bulan ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rating Rata-rata
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.average_rating}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats.total_reviews} ulasan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Seniman Disimpan
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.saved_artisans}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats.pending_proposals} proposal pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="projects">Proyek</TabsTrigger>
            <TabsTrigger value="artisans">Seniman</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Proyek Terbaru</CardTitle>
                      <Link href="/dashboard/klien/projects">
                        <Button variant="outline" size="sm">
                          Lihat Semua
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.recentProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-gray-600">
                              {project.category}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(project.status)}>
                                {getStatusText(project.status)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Deadline:{" "}
                                {new Date(project.deadline).toLocaleDateString(
                                  "id-ID"
                                )}
                              </span>
                              <span className="text-xs text-gray-500">
                                {project.proposals_count} proposal
                              </span>
                            </div>
                            {project.hired_seniman && (
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={project.hired_seniman.avatar}
                                    alt={project.hired_seniman.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {project.hired_seniman.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {project.hired_seniman.name}
                                </span>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs text-gray-600 ml-1">
                                    {project.hired_seniman.rating}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              Rp {project.budget.toLocaleString("id-ID")}
                            </div>
                            <div className="text-xs text-gray-500">
                              {project.budget_type === "FIXED"
                                ? "Fix Price"
                                : "Per Jam"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notifications */}
              <div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Notifikasi</CardTitle>
                      <Badge variant="secondary">
                        {data.notifications.filter((n) => !n.is_read).length}{" "}
                        baru
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.notifications.slice(0, 4).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${
                            !notification.is_read
                              ? "bg-purple-50 border-purple-200"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.is_read && (
                              <div className="h-2 w-2 bg-purple-600 rounded-full mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/dashboard/klien/projects/new">
                    <Button className="w-full h-20 flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      Posting Proyek Baru
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Search className="h-6 w-6 mb-2" />
                      Cari Seniman
                    </Button>
                  </Link>
                  <Link href="/dashboard/klien/saved">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Heart className="h-6 w-6 mb-2" />
                      Seniman Disimpan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manajemen Proyek</h2>
              <Link href="/dashboard/klien/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Posting Proyek Baru
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Diposting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentProjects
                      .filter((p) => p.status === "POSTED")
                      .map((project) => (
                        <div key={project.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">
                            {project.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {project.category}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Rp {project.budget.toLocaleString("id-ID")}
                            </span>
                            <Badge variant="secondary">
                              {project.proposals_count} proposal
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sedang Berjalan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentProjects
                      .filter((p) => p.status === "IN_PROGRESS")
                      .map((project) => (
                        <div key={project.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">
                            {project.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {project.category}
                          </p>
                          {project.hired_seniman && (
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={project.hired_seniman.avatar}
                                  alt={project.hired_seniman.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {project.hired_seniman.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">
                                {project.hired_seniman.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Negosiasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentProjects
                      .filter((p) => p.status === "NEGOTIATING")
                      .map((project) => (
                        <div key={project.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">
                            {project.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {project.category}
                          </p>
                          {project.negotiating_seniman && (
                            <div className="flex items-center gap-2 mt-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={project.negotiating_seniman.avatar}
                                  alt={project.negotiating_seniman.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {project.negotiating_seniman.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">
                                {project.negotiating_seniman.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="artisans" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Seniman Disimpan</h2>
              <Link href="/browse">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Cari Seniman Baru
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.savedArtisans.map((artisan) => (
                <Card key={artisan.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={artisan.avatar} alt={artisan.name} />
                        <AvatarFallback>
                          {artisan.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {artisan.name}
                        </CardTitle>
                        <CardDescription>{artisan.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1">{artisan.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {artisan.total_projects} proyek
                        </span>
                      </div>
                      <div className="text-sm font-medium text-purple-600">
                        Rp {artisan.rate_per_hour.toLocaleString("id-ID")}/jam
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/seniman/${artisan.id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Lihat Profil
                          </Button>
                        </Link>
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Riwayat Transaksi</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Laporan
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaksi Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">
                          {transaction.project_title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {transaction.seniman_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.date).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          Rp {transaction.amount.toLocaleString("id-ID")}
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengeluaran 6 Bulan Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart akan ditampilkan di sini
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Proyek</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fashion</span>
                      <span className="text-sm font-medium">8 proyek</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Desain</span>
                      <span className="text-sm font-medium">6 proyek</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fotografi</span>
                      <span className="text-sm font-medium">4 proyek</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Lainnya</span>
                      <span className="text-sm font-medium">6 proyek</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
