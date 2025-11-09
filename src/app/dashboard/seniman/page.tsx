"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  X,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  user: {
    id: string;
    name: string;
    avatar: string | null;
    email: string;
    verification_status: string;
    is_featured: boolean;
  };
  stats: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_earnings: number;
    monthly_earnings: number;
    average_rating: number;
    total_reviews: number;
    profile_views: number;
    response_rate: number;
    response_time: number;
  };
  recentProjects: any[];
  notifications: any[];
  portfolio: any[];
}

export default function SenimanDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
    category: "",
    image_urls: [] as string[],
    video_url: "",
    client_name: "",
    is_featured: false,
  });

  const fetchDashboardData = useCallback(
    async (retryCount = 0) => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard/seniman", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
          console.error("API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            error: responseData.error,
            details: responseData.details,
          });

          // Handle specific error cases
          if (
            response.status === 404 &&
            responseData.error?.includes("profile")
          ) {
            toast.error(
              "Profil seniman tidak ditemukan. Silakan lengkapi profil Anda terlebih dahulu."
            );
          } else if (response.status === 401) {
            // Retry once if 401 (session might not be ready yet after login)
            if (retryCount < 1) {
              console.log("Session not ready, retrying in 500ms...");
              await new Promise((resolve) => setTimeout(resolve, 500));
              return fetchDashboardData(retryCount + 1);
            }
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/auth/login");
            return;
          } else if (response.status === 403) {
            toast.error("Akses ditolak. Halaman ini hanya untuk seniman.");
            router.push("/");
            return;
          } else {
            throw new Error(
              responseData.error ||
                responseData.details ||
                `Failed to fetch dashboard data: ${response.status} ${response.statusText}`
            );
          }
        }

        // Validate response data structure
        if (!responseData.user || !responseData.stats) {
          console.error("Invalid response structure:", responseData);
          throw new Error("Data dashboard tidak valid");
        }

        setData(responseData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Gagal memuat data dashboard";

        // Only show toast if not a retry
        if (retryCount === 0) {
          toast.error(errorMessage);
        }

        // Set empty data structure to prevent crash
        setData({
          user: {
            id: "",
            name: "Error",
            avatar: null,
            email: "",
            verification_status: "UNVERIFIED",
            is_featured: false,
          },
          stats: {
            total_projects: 0,
            active_projects: 0,
            completed_projects: 0,
            total_earnings: 0,
            monthly_earnings: 0,
            average_rating: 0,
            total_reviews: 0,
            profile_views: 0,
            response_rate: 0,
            response_time: 0,
          },
          recentProjects: [],
          notifications: [],
          portfolio: [],
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    // Wait for session to be loaded before fetching data
    if (status === "loading") {
      return; // Still loading session
    }

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && session?.user) {
      // Small delay to ensure session is fully ready
      const timer = setTimeout(() => {
        fetchDashboardData();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [status, session, router, fetchDashboardData]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio");
      }
      const { portfolio } = await response.json();
      if (data) {
        setData({ ...data, portfolio });
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast.error("Gagal memuat portfolio");
    }
  };

  const handleAddPortfolio = () => {
    setEditingPortfolio(null);
    setPortfolioForm({
      title: "",
      description: "",
      category: "",
      image_urls: [],
      video_url: "",
      client_name: "",
      is_featured: false,
    });
    setIsPortfolioDialogOpen(true);
  };

  const handleEditPortfolio = (portfolio: any) => {
    setEditingPortfolio(portfolio);
    setPortfolioForm({
      title: portfolio.title || "",
      description: portfolio.description || "",
      category: portfolio.category || "",
      image_urls: portfolio.image_urls || [],
      video_url: portfolio.video_url || "",
      client_name: portfolio.client_name || "",
      is_featured: portfolio.is_featured || false,
    });
    setIsPortfolioDialogOpen(true);
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus portfolio ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolio?id=${portfolioId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio");
      }

      toast.success("Portfolio berhasil dihapus");
      fetchPortfolio();
      if (activeTab === "portfolio") {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      toast.error("Gagal menghapus portfolio");
    }
  };

  const handleSavePortfolio = async () => {
    if (!portfolioForm.title) {
      toast.error("Judul portfolio wajib diisi");
      return;
    }

    try {
      const url = "/api/portfolio";
      const method = editingPortfolio ? "PUT" : "POST";
      const body = editingPortfolio
        ? { id: editingPortfolio.id, ...portfolioForm }
        : portfolioForm;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save portfolio");
      }

      toast.success(
        editingPortfolio
          ? "Portfolio berhasil diperbarui"
          : "Portfolio berhasil ditambahkan"
      );
      setIsPortfolioDialogOpen(false);
      fetchPortfolio();
      fetchDashboardData();
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast.error("Gagal menyimpan portfolio");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "NEGOTIATING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
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

  // Show loading if session is still loading or data is being fetched
  if (status === "loading" || isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {status === "loading" ? "Memuat sesi..." : "Memuat dashboard..."}
          </p>
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">
                ArtisanHub
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/notifications">
                <div className="relative">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                    {data.notifications.filter((n) => !n.is_read).length >
                      0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </div>
              </Link>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={data.user.avatar || ""}
                    alt={data.user.name}
                  />
                  <AvatarFallback>
                    {data.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{data.user.name}</div>
                  <div className="text-xs text-gray-500">Seniman</div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/seniman/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
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
            Kelola proyek dan portfolio Anda dari dashboard seniman
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
                Total Pendapatan
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {data.stats.total_earnings.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                +Rp {data.stats.monthly_earnings.toLocaleString("id-ID")} bulan
                ini
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
                Profile Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.profile_views}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats.response_rate}% respons rate
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="projects">Proyek</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
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
                      <Link href="/dashboard/seniman/projects">
                        <Button variant="outline" size="sm">
                          Lihat Semua
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.recentProjects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>Belum ada proyek</p>
                        </div>
                      ) : (
                        data.recentProjects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                          >
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={project.client_avatar || ""}
                                    alt={project.client}
                                  />
                                  <AvatarFallback>
                                    {project.client
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">
                                    {project.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {project.client}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      className={getStatusColor(project.status)}
                                    >
                                      {getStatusText(project.status)}
                                    </Badge>
                                    {project.deadline && (
                                      <span className="text-xs text-gray-500">
                                        Deadline:{" "}
                                        {new Date(
                                          project.deadline
                                        ).toLocaleDateString("id-ID")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  Rp {project.budget.toLocaleString("id-ID")}
                                </div>
                                {project.progress > 0 && (
                                  <div className="mt-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-purple-600 h-2 rounded-full"
                                        style={{
                                          width: `${project.progress}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {project.progress}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
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
                      {data.notifications.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          <p>Tidak ada notifikasi</p>
                        </div>
                      ) : (
                        data.notifications.slice(0, 4).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                              !notification.is_read
                                ? "bg-purple-50 border-purple-200"
                                : ""
                            }`}
                            onClick={() =>
                              handleMarkNotificationRead(notification.id)
                            }
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
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manajemen Proyek</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sedang Berjalan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentProjects.filter(
                      (p) => p.status === "IN_PROGRESS"
                    ).length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>Tidak ada proyek sedang berjalan</p>
                      </div>
                    ) : (
                      data.recentProjects
                        .filter((p) => p.status === "IN_PROGRESS")
                        .map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                          >
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <h4 className="font-medium text-sm">
                                {project.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {project.client}
                              </p>
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {project.progress}% selesai
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Negosiasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentProjects.filter(
                      (p) => p.status === "NEGOTIATING"
                    ).length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>Tidak ada proyek dalam negosiasi</p>
                      </div>
                    ) : (
                      data.recentProjects
                        .filter((p) => p.status === "NEGOTIATING")
                        .map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                          >
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <h4 className="font-medium text-sm">
                                {project.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {project.client}
                              </p>
                              <div className="mt-2 text-sm font-medium">
                                Rp {project.budget.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </Link>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selesai</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentProjects.filter((p) => p.status === "COMPLETED")
                      .length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>Tidak ada proyek selesai</p>
                      </div>
                    ) : (
                      data.recentProjects
                        .filter((p) => p.status === "COMPLETED")
                        .map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                          >
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <h4 className="font-medium text-sm">
                                {project.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {project.client}
                              </p>
                              <div className="mt-2 text-sm font-medium">
                                Rp {project.budget.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </Link>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Portfolio Saya</h2>
              <Button onClick={handleAddPortfolio}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Portfolio
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.portfolio.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    Belum ada portfolio. Tambahkan portfolio pertama Anda!
                  </p>
                </div>
              ) : (
                data.portfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={item.image_url || "/placeholder.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.jpg";
                        }}
                      />
                      {item.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                        <Eye className="h-3 w-3" />
                        <span>{item.views || 0}</span>
                        <Heart className="h-3 w-3 ml-2" />
                        <span>{item.likes || 0}</span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>
                        {item.category || "Tidak ada kategori"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPortfolio(item)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePortfolio(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pendapatan 6 Bulan Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart akan ditampilkan di sini
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistik Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Views</span>
                      <span className="text-sm font-medium">
                        {data.stats.profile_views}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Response Rate
                      </span>
                      <span className="text-sm font-medium">
                        {data.stats.response_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Response Time
                      </span>
                      <span className="text-sm font-medium">
                        {data.stats.response_time} jam
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Conversion Rate
                      </span>
                      <span className="text-sm font-medium">12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Portfolio Dialog */}
      <Dialog
        open={isPortfolioDialogOpen}
        onOpenChange={setIsPortfolioDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPortfolio ? "Edit Portfolio" : "Tambah Portfolio Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingPortfolio
                ? "Perbarui informasi portfolio Anda"
                : "Tambahkan karya terbaru Anda ke portfolio"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Portfolio *</Label>
              <Input
                id="title"
                value={portfolioForm.title}
                onChange={(e) =>
                  setPortfolioForm({ ...portfolioForm, title: e.target.value })
                }
                placeholder="Contoh: Desain Batik Modern"
              />
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={portfolioForm.description}
                onChange={(e) =>
                  setPortfolioForm({
                    ...portfolioForm,
                    description: e.target.value,
                  })
                }
                placeholder="Jelaskan tentang karya ini..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={portfolioForm.category}
                onValueChange={(value) =>
                  setPortfolioForm({ ...portfolioForm, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batik">Batik</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Desain">Desain</SelectItem>
                  <SelectItem value="Fotografi">Fotografi</SelectItem>
                  <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                  <SelectItem value="Lukis">Lukis</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image_urls">
                URL Gambar (pisahkan dengan koma)
              </Label>
              <Input
                id="image_urls"
                value={portfolioForm.image_urls.join(", ")}
                onChange={(e) => {
                  const urls = e.target.value
                    .split(",")
                    .map((url) => url.trim())
                    .filter((url) => url);
                  setPortfolioForm({ ...portfolioForm, image_urls: urls });
                }}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan URL gambar, dipisahkan dengan koma
              </p>
            </div>

            <div>
              <Label htmlFor="video_url">URL Video (opsional)</Label>
              <Input
                id="video_url"
                value={portfolioForm.video_url}
                onChange={(e) =>
                  setPortfolioForm({
                    ...portfolioForm,
                    video_url: e.target.value,
                  })
                }
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <Label htmlFor="client_name">Nama Klien (opsional)</Label>
              <Input
                id="client_name"
                value={portfolioForm.client_name}
                onChange={(e) =>
                  setPortfolioForm({
                    ...portfolioForm,
                    client_name: e.target.value,
                  })
                }
                placeholder="Contoh: PT Fashion Indonesia"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={portfolioForm.is_featured}
                onChange={(e) =>
                  setPortfolioForm({
                    ...portfolioForm,
                    is_featured: e.target.checked,
                  })
                }
                className="rounded"
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Tandai sebagai portfolio unggulan
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPortfolioDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleSavePortfolio}>
              {editingPortfolio ? "Simpan Perubahan" : "Tambah Portfolio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
