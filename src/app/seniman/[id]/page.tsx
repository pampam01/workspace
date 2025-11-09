'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Star, 
  Briefcase, 
  Clock,
  CheckCircle,
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  Award,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  Camera,
  Video,
  Image as ImageIcon
} from 'lucide-react'

// Mock data untuk profil seniman
const mockSenimanData = {
  id: '1',
  name: 'Siti Nurhaliza',
  avatar: '/avatars/siti.jpg',
  bio: 'Seniman batik berpengalaman 10 tahun, spesialis batik tulis dan batik cap. Lulusan dari ISI Yogyakarta dengan fokus pada seni tradisional Indonesia. Telah berpartisipasi dalam berbagai pameran lokal dan internasional.',
  lokasi: 'Yogyakarta, Indonesia',
  kategori: ['Batik', 'Fashion', 'Kerajinan'],
  rating: 4.8,
  total_reviews: 45,
  total_projects: 67,
  rate_per_hour: 150000,
  rate_per_project: 1000000,
  response_time_hours: 2,
  years_experience: 10,
  availability_status: 'AVAILABLE',
  verification_status: 'VERIFIED',
  is_featured: true,
  portfolio_count: 24,
  created_at: '2020-01-15',
  email: 'siti@artisanhub.com',
  phone: '+62 812-3456-7890',
  website: 'https://sitinurhaliza.com',
  portfolio_items: [
    {
      id: '1',
      title: 'Batik Parang Rusak Modern',
      description: 'Interpretasi modern dari motif batik klasik Parang Rusak dengan sentuhan warna kontemporer.',
      category: 'Batik',
      image_urls: ['/portfolio/batik1.jpg', '/portfolio/batik1-2.jpg'],
      project_date: '2024-01-15',
      client_name: 'PT Fashion Indonesia',
      tools_used: ['Canting', 'Wax', 'Natural Dyes'],
      is_featured: true
    },
    {
      id: '2',
      title: 'Koleksi Batik Cap Ramah Lingkungan',
      description: 'Koleksi busana dengan motif batik cap menggunakan pewarna alami.',
      category: 'Fashion',
      image_urls: ['/portfolio/fashion1.jpg', '/portfolio/fashion1-2.jpg', '/portfolio/fashion1-3.jpg'],
      project_date: '2023-12-20',
      client_name: 'Eco Fashion Studio',
      tools_used: ['Cap Batik', 'Natural Dyes', 'Organic Cotton'],
      is_featured: false
    },
    {
      id: '3',
      title: 'Instalasi Seni Batik 3D',
      description: 'Karya instalasi seni kontemporer yang menggabungkan teknik batik tradisional dengan elemen 3D.',
      category: 'Kerajinan',
      image_urls: ['/portfolio/art1.jpg', '/portfolio/art1-2.jpg'],
      project_date: '2023-11-10',
      client_name: 'Museum Seni Modern',
      tools_used: ['Mixed Media', 'Batik Technique', 'Wood Frame'],
      is_featured: true
    }
  ],
  reviews: [
    {
      id: '1',
      reviewer_name: 'PT Fashion Indonesia',
      reviewer_avatar: '/avatars/company1.jpg',
      rating: 5,
      comment: 'Sangat profesional dan hasil kerja luar biasa. Detail batiknya sangat halus dan sesuai dengan ekspektasi kami.',
      professionalism: 5,
      quality_of_work: 5,
      communication: 5,
      timeliness: 5,
      would_hire_again: true,
      created_at: '2024-01-20'
    },
    {
      id: '2',
      reviewer_name: 'Eco Fashion Studio',
      reviewer_avatar: '/avatars/company2.jpg',
      rating: 4,
      comment: 'Kerja bagus, namun ada sedikit keterlambatan dalam pengiriman. Hasil akhir sangat memuaskan.',
      professionalism: 5,
      quality_of_work: 4,
      communication: 4,
      timeliness: 3,
      would_hire_again: true,
      created_at: '2023-12-25'
    }
  ]
}

export default function SenimanProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [seniman, setSeniman] = useState(mockSenimanData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleHireNow = () => {
    router.push(`/projects/new?seniman=${params.id}`)
  }

  const handleSendMessage = () => {
    router.push(`/messages/${params.id}`)
  }

  const handleSaveProfile = () => {
    setIsSaved(!isSaved)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${seniman.name} - ArtisanHub`,
        text: `Lihat profil ${seniman.name}, seniman ${seniman.kategori.join(', ')} berbakat`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat profil seniman...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">ArtisanHub</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/browse">
                <Button variant="ghost">Kembali</Button>
              </Link>
              <Link href="/auth/login">
                <Button>Masuk</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={seniman.avatar} alt={seniman.name} />
              <AvatarFallback className="text-3xl">{seniman.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{seniman.name}</h1>
                {seniman.verification_status === 'VERIFIED' && (
                  <CheckCircle className="h-6 w-6 text-green-300" />
                )}
                {seniman.is_featured && (
                  <Badge className="bg-yellow-400 text-yellow-900">Featured</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{seniman.lokasi}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <span>{seniman.rating}</span>
                  <span>({seniman.total_reviews} ulasan)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{seniman.total_projects} proyek</span>
                </div>
              </div>

              <p className="text-white/80 mb-6 max-w-3xl">{seniman.bio}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {seniman.kategori.map((kat) => (
                  <Badge key={kat} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {kat}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleHireNow} size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Sewa Sekarang
                </Button>
                <Button onClick={handleSendMessage} variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Kirim Pesan
                </Button>
                <Button onClick={handleSaveProfile} variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Tersimpan' : 'Simpan'}
                </Button>
                <Button onClick={handleShare} variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 min-w-[200px]">
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">Rp {seniman.rate_per_hour.toLocaleString('id-ID')}</div>
                  <div className="text-sm text-white/70">per jam</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Rp {seniman.rate_per_project.toLocaleString('id-ID')}</div>
                  <div className="text-sm text-white/70">per proyek</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{seniman.response_time_hours}j</div>
                  <div className="text-sm text-white/70">waktu respons</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{seniman.years_experience}th</div>
                  <div className="text-sm text-white/70">pengalaman</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{seniman.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{seniman.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <a href={seniman.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                {seniman.website}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Bergabung sejak {new Date(seniman.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="portfolio">Portfolio ({seniman.portfolio_count})</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan ({seniman.total_reviews})</TabsTrigger>
              <TabsTrigger value="about">Tentang</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seniman.portfolio_items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <img 
                        src={item.image_urls[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-2">
                            {item.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(item.project_date).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        {item.client_name && (
                          <div className="text-sm text-gray-600">
                            Klien: {item.client_name}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {item.tools_used.map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                        {item.image_urls.length > 1 && (
                          <div className="flex items-center text-sm text-purple-600">
                            <ImageIcon className="h-4 w-4 mr-1" />
                            {item.image_urls.length} gambar
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Rating & Ulasan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900">{seniman.rating}</div>
                        <div className="flex justify-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(seniman.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <div className="text-gray-600 mt-2">{seniman.total_reviews} ulasan</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { rating: 5, count: 30 },
                          { rating: 4, count: 10 },
                          { rating: 3, count: 3 },
                          { rating: 2, count: 1 },
                          { rating: 1, count: 1 }
                        ].map((item) => (
                          <div key={item.rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-12">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{item.rating}</span>
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${(item.count / seniman.total_reviews) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {seniman.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name} />
                              <AvatarFallback>{review.reviewer_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.reviewer_name}</div>
                              <div className="flex items-center gap-1 text-sm">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                                <span className="ml-1 text-gray-600">{review.rating}.0</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('id-ID', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{review.professionalism}</div>
                            <div className="text-gray-600">Profesionalisme</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{review.quality_of_work}</div>
                            <div className="text-gray-600">Kualitas</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{review.communication}</div>
                            <div className="text-gray-600">Komunikasi</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{review.timeliness}</div>
                            <div className="text-gray-600">Ketepatan Waktu</div>
                          </div>
                        </div>

                        {review.would_hire_again && (
                          <div className="mt-4 flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Akan menyewa lagi</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tentang Saya</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{seniman.bio}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Keahlian</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {seniman.kategori.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pengalaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium">{seniman.years_experience} Tahun Pengalaman</div>
                            <div className="text-sm text-gray-600">Berdedikasi dalam seni {seniman.kategori.join(', ')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium">{seniman.total_projects} Proyek Selesai</div>
                            <div className="text-sm text-gray-600">Berhasil mengerjakan berbagai jenis proyek</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium">{seniman.rating} Rating Rata-rata</div>
                            <div className="text-sm text-gray-600">Dari {seniman.total_reviews} ulasan klien</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi Kontak</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{seniman.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{seniman.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{seniman.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a href={seniman.website} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700">
                          {seniman.website}
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistik</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Portfolio</span>
                        <span className="text-sm font-medium">{seniman.portfolio_count} karya</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Waktu Respons</span>
                        <span className="text-sm font-medium">{seniman.response_time_hours} jam</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status Verifikasi</span>
                        <Badge variant="secondary" className="text-xs">
                          {seniman.verification_status === 'VERIFIED' ? 'Terverifikasi' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status Ketersediaan</span>
                        <Badge variant="secondary" className="text-xs">
                          {seniman.availability_status === 'AVAILABLE' ? 'Tersedia' : 'Sibuk'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}