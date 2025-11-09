'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  TrendingUp, 
  Briefcase, 
  Calendar,
  User,
  Award,
  MessageCircle,
  Reply,
  Filter,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'

// Mock data untuk reviews seniman
const mockReviewsData = {
  stats: {
    total_reviews: 45,
    average_rating: 4.8,
    rating_distribution: {
      5: 30,
      4: 10,
      3: 3,
      2: 1,
      1: 1
    },
    average_scores: {
      professionalism: 4.9,
      quality_of_work: 4.8,
      communication: 4.7,
      timeliness: 4.8
    },
    would_hire_again_rate: 95,
    total_projects: 67,
    response_time: 2
  },
  
  reviews: [
    {
      id: '1',
      project_id: '1',
      project_title: 'Desain Koleksi Fashion Spring/Summer',
      reviewer_id: '1',
      reviewer_name: 'PT Creative Studio',
      reviewer_avatar: '/avatars/company1.jpg',
      reviewer_type: 'klien',
      rating: 5,
      comment: 'Sangat profesional dan hasil kerja luar biasa! Siti sangat memahami brief kami dan memberikan hasil yang melebihi ekspektasi. Komunikasi lancar dan selalu on time. Highly recommended!',
      professionalism: 5,
      quality_of_work: 5,
      communication: 5,
      timeliness: 5,
      would_hire_again: true,
      created_at: '2024-01-20T10:30:00Z',
      project_category: 'Fashion',
      project_budget: 5000000
    },
    {
      id: '2',
      project_id: '2',
      project_title: 'Branding untuk Startup Teknologi',
      reviewer_id: '2',
      reviewer_name: 'TechVentures Inc.',
      reviewer_avatar: '/avatars/company2.jpg',
      reviewer_type: 'klien',
      rating: 4,
      comment: 'Kerja bagus, hasil sesuai dengan yang diharapkan. Sedikit terlambat di awal tapi bisa dikompensasi dengan komunikasi yang baik. Hasil akhir memuaskan.',
      professionalism: 5,
      quality_of_work: 4,
      communication: 4,
      timeliness: 3,
      would_hire_again: true,
      created_at: '2024-01-15T14:20:00Z',
      project_category: 'Desain',
      project_budget: 3500000
    },
    {
      id: '3',
      project_id: '3',
      project_title: 'Koleksi Batik Ramah Lingkungan',
      reviewer_id: '3',
      reviewer_name: 'Eco Fashion Studio',
      reviewer_avatar: '/avatars/company3.jpg',
      reviewer_type: 'klien',
      rating: 5,
      comment: 'Perfect! Siti tidak hanya memberikan desain yang bagus, tapi juga memberikan insight tentang sustainable materials yang sangat membantu proyek kami. Sangat puas!',
      professionalism: 5,
      quality_of_work: 5,
      communication: 5,
      timeliness: 5,
      would_hire_again: true,
      created_at: '2024-01-10T09:15:00Z',
      project_category: 'Batik',
      project_budget: 4000000
    },
    {
      id: '4',
      project_id: '4',
      project_title: 'Logo Redesign untuk Perusahaan',
      reviewer_id: '4',
      reviewer_name: 'PT Maju Jaya',
      reviewer_avatar: '/avatars/company4.jpg',
      reviewer_type: 'klien',
      rating: 4,
      comment: 'Hasil kerja memuaskan, variasi desain yang diberikan cukup banyak. Hanya saja perlu sedikit revisi untuk warna. Overall good job!',
      professionalism: 4,
      quality_of_work: 4,
      communication: 4,
      timeliness: 4,
      would_hire_again: true,
      created_at: '2024-01-05T16:45:00Z',
      project_category: 'Desain',
      project_budget: 2500000
    },
    {
      id: '5',
      project_id: '5',
      project_title: 'Instalasi Seni untuk Gallery',
      reviewer_id: '5',
      reviewer_name: 'Museum Seni Modern',
      reviewer_avatar: '/avatars/company5.jpg',
      reviewer_type: 'klien',
      rating: 5,
      comment: 'Karya seni yang luar biasa! Siti berhasil menggabungkan teknik batik tradisional dengan instalasi modern. Visitor sangat terkesan. Akan pasti hire lagi!',
      professionalism: 5,
      quality_of_work: 5,
      communication: 5,
      timeliness: 5,
      would_hire_again: true,
      created_at: '2023-12-28T11:30:00Z',
      project_category: 'Kerajinan',
      project_budget: 8000000
    }
  ]
}

export default function SenimanReviewsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [reviews, setReviews] = useState(mockReviewsData.reviews)
  const [stats, setStats] = useState(mockReviewsData.stats)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')
  const [expandedReview, setExpandedReview] = useState<string | null>(null)

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating
    
    return matchesSearch && matchesRating
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReview(prev => prev === reviewId ? null : reviewId)
  }

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}.0</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/seniman" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">ArtisanHub</span>
              </Link>
              <Link href="/dashboard/seniman" className="flex items-center text-gray-600 hover:text-gray-900">
                <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review & Rating</h1>
          <p className="text-gray-600">
            Kelola dan pantau performa Anda melalui review dari klien
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="reviews">Semua Review</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Review</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_reviews}</div>
                  <p className="text-xs text-muted-foreground">
                    Dari {stats.total_projects} proyek
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.average_rating}</div>
                  <p className="text-xs text-muted-foreground">
                    Top 10% di platform
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Akan Disewa Lagi</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.would_hire_again_rate}%</div>
                  <p className="text-xs text-muted-foreground">
                Klien puas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waktu Respons</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.response_time}j</div>
                  <p className="text-xs text-muted-foreground">
                    Rata-rata respons
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Rating Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm">{rating}</span>
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${(stats.rating_distribution[rating as keyof typeof stats.rating_distribution] / stats.total_reviews) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">
                          {stats.rating_distribution[rating as keyof typeof stats.rating_distribution]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rating Detail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profesionalisme</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(stats.average_scores.professionalism / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.average_scores.professionalism}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kualitas Kerja</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(stats.average_scores.quality_of_work / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.average_scores.quality_of_work}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Komunikasi</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${(stats.average_scores.communication / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.average_scores.communication}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ketepatan Waktu</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(stats.average_scores.timeliness / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.average_scores.timeliness}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Cari review..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  />
                </div>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">Semua Rating</option>
                  <option value="5">5 Bintang</option>
                  <option value="4">4 Bintang</option>
                  <option value="3">3 Bintang</option>
                  <option value="2">2 Bintang</option>
                  <option value="1">1 Bintang</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="highest">Rating Tertinggi</option>
                  <option value="lowest">Rating Terendah</option>
                </select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.reviewer_avatar} alt={review.reviewer_name} />
                          <AvatarFallback>{review.reviewer_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{review.reviewer_name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Badge variant="secondary" className="text-xs">
                              {review.reviewer_type === 'klien' ? 'Klien' : 'Seniman'}
                            </Badge>
                            <span>•</span>
                            <span>{formatDate(review.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">{review.project_title}</h4>
                        <p className={`text-gray-700 ${!expandedReview && expandedReview !== review.id ? 'line-clamp-3' : ''}`}>
                          {review.comment}
                        </p>
                        {review.comment.length > 200 && (
                          <button
                            type="button"
                            onClick={() => toggleReviewExpansion(review.id)}
                            className="text-purple-600 hover:text-purple-700 text-sm mt-2"
                          >
                            {expandedReview === review.id ? (
                              <span className="flex items-center gap-1">
                                <ChevronUp className="h-3 w-3" />
                                Sembunyikan
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ChevronDown className="h-3 w-3" />
                                Baca Selengkapnya
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="font-medium">{review.professionalism}</div>
                          <div className="text-xs text-gray-600">Profesionalisme</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{review.quality_of_work}</div>
                          <div className="text-xs text-gray-600">Kualitas</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{review.communication}</div>
                          <div className="text-xs text-gray-600">Komunikasi</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{review.timeliness}</div>
                          <div className="text-xs text-gray-600">Waktu</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {review.project_category}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Rp {review.project_budget.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {review.would_hire_again && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <Star className="h-3 w-3 fill-current" />
                              <span>Akan disewa lagi</span>
                            </div>
                          )}
                          <Button variant="outline" size="sm">
                            <Reply className="h-3 w-3 mr-1" />
                            Balas
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Review</h3>
                  <p className="text-gray-600">
                    {searchQuery || filterRating !== 'all' 
                      ? 'Tidak ada review yang cocok dengan filter Anda'
                      : 'Belum ada review untuk proyek Anda'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trend Rating 6 Bulan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart rating trend akan ditampilkan di sini
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Review per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fashion</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Batik</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Desain</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <span className="text-sm font-medium">4.6</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}