'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Eye, EyeOff, AlertCircle, Mail, Lock, User, Building, MapPin, Palette, Briefcase } from 'lucide-react'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [userType, setUserType] = useState<'SENIMAN' | 'KLIEN'>('SENIMAN')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'klien') {
      setUserType('KLIEN')
    }
  }, [searchParams])

  const [formData, setFormData] = useState({
    // Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Seniman Profile
    bio: '',
    lokasi: '',
    kategori: '',
    ratePerHour: '',
    ratePerProject: '',
    yearsExperience: '',
    
    // Klien Profile
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
    companySize: '',
    industry: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter')
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        userType,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        ...(userType === 'SENIMAN' ? {
          bio: formData.bio,
          lokasi: formData.lokasi,
          kategori: formData.kategori,
          ratePerHour: formData.ratePerHour ? parseFloat(formData.ratePerHour) : null,
          ratePerProject: formData.ratePerProject ? parseFloat(formData.ratePerProject) : null,
          yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null
        } : {
          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          companyWebsite: formData.companyWebsite,
          companySize: formData.companySize,
          industry: formData.industry
        })
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/auth/login?message=registration-success')
      } else {
        setError(data.error || 'Registrasi gagal. Silakan coba lagi.')
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-gray-900">ArtisanHub</span>
          </Link>
          <p className="text-gray-600 mt-2">Bergabung dengan marketplace seniman terpercaya</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
            <CardDescription>
              Mulai perjalanan kreatif Anda bersama kami
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as 'SENIMAN' | 'KLIEN')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="SENIMAN" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Seniman
                </TabsTrigger>
                <TabsTrigger value="KLIEN" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Klien
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

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
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+62 812-3456-7890"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimal 8 karakter"
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
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Konfirmasi password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seniman Specific Fields */}
                {userType === 'SENIMAN' && (
                  <TabsContent value="SENIMAN" className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">Profil Seniman</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Ceritakan tentang diri Anda dan keahlian Anda..."
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lokasi">Lokasi</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="lokasi"
                          name="lokasi"
                          type="text"
                          placeholder="Jakarta, Indonesia"
                          value={formData.lokasi}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kategori">Kategori Keahlian</Label>
                      <Select value={formData.kategori} onValueChange={(value) => setFormData({...formData, kategori: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="batik">Batik</SelectItem>
                          <SelectItem value="keramik">Keramik</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="desain">Desain</SelectItem>
                          <SelectItem value="fotografi">Fotografi</SelectItem>
                          <SelectItem value="musik">Musik</SelectItem>
                          <SelectItem value="coding">Coding</SelectItem>
                          <SelectItem value="kerajinan">Kerajinan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ratePerHour">Tarif per Jam (Rp)</Label>
                        <Input
                          id="ratePerHour"
                          name="ratePerHour"
                          type="number"
                          placeholder="150000"
                          value={formData.ratePerHour}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ratePerProject">Tarif per Proyek (Rp)</Label>
                        <Input
                          id="ratePerProject"
                          name="ratePerProject"
                          type="number"
                          placeholder="1000000"
                          value={formData.ratePerProject}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearsExperience">Pengalaman (Tahun)</Label>
                        <Input
                          id="yearsExperience"
                          name="yearsExperience"
                          type="number"
                          placeholder="5"
                          value={formData.yearsExperience}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* Klien Specific Fields */}
                {userType === 'KLIEN' && (
                  <TabsContent value="KLIEN" className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">Profil Klien</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nama Perusahaan</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="PT Creative Studio"
                        value={formData.companyName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDescription">Deskripsi Perusahaan</Label>
                      <Textarea
                        id="companyDescription"
                        name="companyDescription"
                        placeholder="Deskripsikan perusahaan Anda..."
                        value={formData.companyDescription}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyWebsite">Website Perusahaan</Label>
                        <Input
                          id="companyWebsite"
                          name="companyWebsite"
                          type="url"
                          placeholder="https://example.com"
                          value={formData.companyWebsite}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companySize">Ukuran Perusahaan</Label>
                        <Select value={formData.companySize} onValueChange={(value) => setFormData({...formData, companySize: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih ukuran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERSONAL">Personal</SelectItem>
                            <SelectItem value="STARTUP">Startup</SelectItem>
                            <SelectItem value="SMALL">Small (1-50)</SelectItem>
                            <SelectItem value="MEDIUM">Medium (51-200)</SelectItem>
                            <SelectItem value="LARGE">Large (200+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industri</Label>
                      <Input
                        id="industry"
                        name="industry"
                        type="text"
                        placeholder="Teknologi, Fashion, dll"
                        value={formData.industry}
                        onChange={handleInputChange}
                      />
                    </div>
                  </TabsContent>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Masuk
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}