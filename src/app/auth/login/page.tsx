"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Lock,
  User,
  Building,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use NextAuth signIn to create session
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        toast.error("Login gagal. Email atau password salah.");
        return;
      }

      if (result?.ok) {
        toast.success("Login berhasil!");

        // Wait for session to be fully set (increased delay)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Try to get user type from session first
        try {
          const sessionResponse = await fetch("/api/auth/session", {
            credentials: "include",
            cache: "no-store",
          });

          if (sessionResponse.ok) {
            const session = await sessionResponse.json();
            const userType = session?.user?.userType;

            if (userType) {
              // Redirect based on user type from session
              if (userType === "SENIMAN") {
                router.push("/dashboard/seniman");
              } else if (userType === "KLIEN") {
                router.push("/dashboard/klien");
              } else if (userType === "ADMIN") {
                router.push("/dashboard/admin");
              }
              router.refresh();
              return;
            }
          }
        } catch (sessionError) {
          console.error("Error getting session:", sessionError);
        }

        // Fallback: Get user info from login API
        const userResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (userResponse.ok) {
          const data = await userResponse.json();
          // Redirect based on user type
          if (data.user.userType === "SENIMAN") {
            router.push("/dashboard/seniman");
          } else if (data.user.userType === "KLIEN") {
            router.push("/dashboard/klien");
          } else if (data.user.userType === "ADMIN") {
            router.push("/dashboard/admin");
          }
          router.refresh();
        } else {
          setError("Gagal mendapatkan informasi user");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-gray-900">ArtisanHub</span>
          </Link>
          <p className="text-gray-600 mt-2">
            Platform marketplace seniman terpercaya
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Masuk ke Akun Anda
            </CardTitle>
            <CardDescription>
              Selamat datang kembali! Silakan masuk untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Lupa password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/auth/register"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Masuk sebagai:</p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register?role=seniman">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Seniman
              </Button>
            </Link>
            <Link href="/auth/register?role=klien">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                Klien
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
