'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { 
  Search, 
  MapPin, 
  Star, 
  Briefcase, 
  Filter,
  Clock,
  CheckCircle,
  Heart,
  MessageCircle
} from 'lucide-react'

// Mock data untuk seniman
const mockSeniman = [
  {
    id: '1',
    name: 'Siti Nurhaliza',
    avatar: '/avatars/siti.jpg',
    bio: 'Seniman batik berpengalaman 10 tahun, spesialis batik tulis dan batik cap.',
    lokasi: 'Yogyakarta',
    kategori: ['Batik', 'Fashion'],
    rating: 4.8,
    total_reviews: 45,
    total_projects: 67,
    rate_per_hour: 150000,
    verification_status: 'verified',
    is_featured: true
  },
  {
    id: '2',
    name: 'Budi Santoso',
    avatar: '/avatars/budi.jpg',
    bio: 'Desainer grafis profesional dengan fokus pada branding dan UI/UX design.',
    lokasi: 'Jakarta',
    kategori: ['Desain', 'Coding'],
    rating: 4.9,
    total_reviews: 32,
    total_projects: 48,
    rate_per_hour: 200000,
    verification_status: 'verified',
    is_featured: false
  },
  {
    id: '3',
    name: 'Maya Putri',
    avatar: '/avatars/maya.jpg',
    bio: 'Fotografer profesional dengan spesialisasi wedding dan produk photography.',
    lokasi: 'Bali',
    kategori: ['Fotografi'],
    rating: 4.7,
    total_reviews: 28,
    total_projects: 35,
    rate_per_hour: 175000,
    verification_status: 'verified',
    is_featured: true
  },
  {
    id: '4',
    name: 'Ahmad Fadli',
    avatar: '/avatars/ahmad.jpg',
    bio: 'Pengrajin keramik dengan gaya modern dan kontemporer.',
    lokasi: 'Bandung',
    kategori: ['Keramik', 'Kerajinan'],
    rating: 4.6,
    total_reviews: 19,
    total_projects: 24,
    rate_per_hour: 120000,
    verification_status: 'pending',
    is_featured: false
  },
  {
    id: '5',
    name: 'Rina Wijaya',
    avatar: '/avatars/rina.jpg',
    bio: 'Musisi dan komposer dengan pengalaman 8 tahun di industri musik.',
    lokasi: 'Surabaya',
    kategori: ['Musik'],
    rating: 4.9,
    total_reviews: 52,
    total_projects: 78,
    rate_per_hour: 180000,
    verification_status: 'verified',
    is_featured: true
  },
  {
    id: '6',
    name: 'Doni Prasetyo',
    avatar: '/avatars/doni.jpg',
    bio: 'Full-stack developer dengan expertise di React, Node.js, dan cloud technologies.',
    lokasi: 'Jakarta',
    kategori: ['Coding', 'Desain'],
    rating: 4.8,
    total_reviews: 38,
    total_projects: 56,
    rate_per_hour: 250000,
    verification_status: 'verified',
    is_featured: false
  }
]

const categories = [
  'Semua',
  'Batik',
  'Keramik',
  'Fashion',
  'Desain',
  'Fotografi',
  'Musik',
  'Coding',
  'Kerajinan'
]

const locations = [
  'Semua Lokasi',
  'Jakarta',
  'Yogyakarta',
  'Bandung',
  'Surabaya',
  'Bali',
  'Medan',
  'Semarang'
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi')
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  const filteredSeniman = mockSeniman.filter(seniman => {
    const matchesSearch = seniman.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seniman.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Semua' || seniman.kategori.includes(selectedCategory)
    const matchesLocation = selectedLocation === 'Semua Lokasi' || seniman.lokasi === selectedLocation
    const matchesPrice = seniman.rate_per_hour >= priceRange[0] && seniman.rate_per_hour <= priceRange[1]

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
  })

  const sortedSeniman = [...filteredSeniman].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'projects':
        return b.total_projects - a.total_projects
      case 'price_low':
        return a.rate_per_hour - b.rate_per_hour
      case 'price_high':
        return b.rate_per_hour - a.rate_per_hour
      default:
        return 0
    }
  })

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
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Temukan Seniman Berbakat</h1>
            <p className="text-xl text-white/90 mb-8">
              Jelajahi ribuan seniman profesional untuk proyek kreatif Anda
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Cari seniman berdasarkan nama, keahlian, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
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

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lokasi" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
                <SelectItem value="projects">Proyek Terbanyak</SelectItem>
                <SelectItem value="price_low">Harga Terendah</SelectItem>
                <SelectItem value="price_high">Harga Tertinggi</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-gray-600">
              {sortedSeniman.length} seniman ditemukan
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rentang Harga per Jam
                  </label>
                  <div className="px-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500000}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Rp {priceRange[0].toLocaleString('id-ID')}</span>
                      <span>Rp {priceRange[1].toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSeniman.map((seniman) => (
              <Card key={seniman.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={seniman.avatar} alt={seniman.name} />
                        <AvatarFallback>{seniman.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{seniman.name}</CardTitle>
                          {seniman.verification_status === 'verified' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {seniman.is_featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {seniman.lokasi}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {seniman.bio}
                  </CardDescription>

                  <div className="flex flex-wrap gap-1">
                    {seniman.kategori.map((kat) => (
                      <Badge key={kat} variant="outline" className="text-xs">
                        {kat}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{seniman.rating}</span>
                        <span className="text-gray-600 ml-1">({seniman.total_reviews})</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {seniman.total_projects} proyek
                      </div>
                    </div>
                  </div>

                  <div className="text-lg font-semibold text-purple-600">
                    Rp {seniman.rate_per_hour.toLocaleString('id-ID')}/jam
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/seniman/${seniman.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Lihat Profil
                      </Button>
                    </Link>
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedSeniman.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Tidak ada seniman yang ditemukan</div>
              <p className="text-gray-400 mt-2">Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}