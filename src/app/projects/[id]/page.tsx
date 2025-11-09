'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Clock, 
  MapPin, 
  Users,
  Briefcase,
  Star,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  FileText,
  Heart,
  Share2,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react'

// Mock data untuk detail proyek
const mockProjectData = {
  id: '1',
  title: 'Desain Koleksi Fashion Spring/Summer 2024',
  description: 'Kami mencari desainer fashion berbakat untuk membuat koleksi Spring/Summer 2024. Koleksi ini terdiri dari 15 outfit dengan tema "Urban Garden". Desainer harus memiliki pengalaman dalam membuat pattern, memilih bahan, dan mengerti trend fashion terkini. Portfolio yang menunjukkan pengalaman dalam sustainable fashion akan menjadi nilai tambah.',
  category: 'Fashion',
  status: 'POSTED',
  budget_type: 'FIXED',
  budget: 5000000,
  budget_min: 4000000,
  budget_max: 6000000,
  deadline: '2024-03-15',
  start_date: '2024-02-01',
  estimated_duration_days: 45,
  required_skills: ['Fashion Design', 'Pattern Making', 'Sustainable Fashion', 'Trend Analysis'],
  attachments: [
    { name: 'Brief_Design_Fashion.pdf', size: '2.5 MB', url: '#' },
    { name: 'Brand_Guidelines.pdf', size: '1.8 MB', url: '#' },
    { name: 'Inspiration_Images.zip', size: '15.2 MB', url: '#' }
  ],
  klien_notes: 'Kami mencari desainer yang bisa bekerja sama dengan tim produksi internal. Harus available untuk meeting mingguan.',
  created_at: '2024-01-20',
  updated_at: '2024-01-22',
  
  klien: {
    id: '1',
    name: 'PT Creative Studio',
    avatar: '/avatars/company1.jpg',
    company_size: 'MEDIUM',
    industry: 'Fashion & Retail',
    rating_as_buyer: 4.7,
    total_projects_posted: 24,
    total_spent: 85000000
  },
  
  proposals: [
    {
      id: '1',
      seniman_id: '1',
      seniman_name: 'Siti Nurhaliza',
      seniman_avatar: '/avatars/siti.jpg',
      seniman_rating: 4.8,
      seniman_total_projects: 67,
      proposed_budget: 4800000,
      proposed_timeline_days: 40,
      cover_letter: 'Saya sangat tertarik dengan proyek ini. Dengan pengalaman 10 tahun dalam fashion design dan keahlian dalam sustainable fashion, saya yakin bisa memberikan hasil terbaik. Saya sudah mengerjakan 5 koleksi fashion sebelumnya dengan tema serupa. Portfolio saya bisa dilihat di profil saya.',
      status: 'PENDING',
      created_at: '2024-01-21',
      seniman_categories: ['Fashion', 'Batik'],
      seniman_rate_per_hour: 150000,
      seniman_location: 'Yogyakarta'
    },
    {
      id: '2',
      seniman_id: '2',
      seniman_name: 'Budi Santoso',
      seniman_avatar: '/avatars/budi.jpg',
      seniman_rating: 4.9,
      seniman_total_projects: 48,
      proposed_budget: 5200000,
      proposed_timeline_days: 45,
      cover_letter: 'Sebagai desainer dengan fokus pada urban fashion, saya sangat antusias dengan proyek "Urban Garden". Saya memiliki pengalaman dalam membuat pattern yang unik dan memahami trend fashion terkini. Timeline 45 hari sangat realistis untuk menghasilkan 15 outfit berkualitas tinggi.',
      status: 'PENDING',
      created_at: '2024-01-22',
      seniman_categories: ['Desain', 'Fashion'],
      seniman_rate_per_hour: 200000,
      seniman_location: 'Jakarta'
    }
  ],
  
  stats: {
    views: 156,
    proposals_count: 2,
    saved_count: 12,
    days_left: 23
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState(mockProjectData)
  const [isSaved, setIsSaved] = useState(false)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [proposalData, setProposalData] = useState({
    budget: '',
    timeline: '',
    cover_letter: ''
  })
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false)

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800'
      case 'NEGOTIATING':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'POSTED':
        return 'Diposting'
      case 'IN_PROGRESS':
        return 'Sedang Berjalan'
      case 'NEGOTIATING':
        return 'Negosiasi'
      case 'COMPLETED':
        return 'Selesai'
      case 'CANCELLED':
        return 'Dibatalkan'
      default:
        return status
    }
  }

  const handleSaveProject = () => {
    setIsSaved(!isSaved)
  }

  const handleShareProject = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `Lihat proyek menarik: ${project.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingProposal(true)

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Proposal berhasil dikirim!')
      setShowProposalForm(false)
      setProposalData({ budget: '', timeline: '', cover_letter: '' })
      
      // Refresh data
      setProject(prev => ({
        ...prev,
        proposals: [...prev.proposals, {
          id: '3',
          seniman_id: 'current_user',
          seniman_name: 'Current User',
          seniman_avatar: '/avatars/current.jpg',
          seniman_rating: 4.5,
          seniman_total_projects: 12,
          proposed_budget: parseInt(proposalData.budget),
          proposed_timeline_days: parseInt(proposalData.timeline),
          cover_letter: proposalData.cover_letter,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          seniman_categories: ['Fashion'],
          seniman_rate_per_hour: 120000,
          seniman_location: 'Jakarta'
        }]
      }))
    } catch (error) {
      alert('Gagal mengirim proposal. Silakan coba lagi.')
    } finally {
      setIsSubmittingProposal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail proyek...</p>
        </div>
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
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">ArtisanHub</span>
              </Link>
              <Link href="/browse" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Browse
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleSaveProject}>
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                {isSaved ? 'Tersimpan' : 'Simpan'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShareProject}>
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
              <Link href="/auth/login">
                <Button>Masuk untuk Melamar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className={getStatusColor(project.status)} mb-3>
                {getStatusText(project.status)}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {project.category}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Deadline: {new Date(project.deadline).toLocaleDateString('id-ID')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {project.stats.days_left} hari tersisa
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                Rp {project.budget.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-600">
                {project.budget_type === 'FIXED' ? 'Harga Fix' : 'Per Jam'}
              </div>
              {project.budget_min && project.budget_max && (
                <div className="text-xs text-gray-500">
                  Rp {project.budget_min.toLocaleString('id-ID')} - Rp {project.budget_max.toLocaleString('id-ID')}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {project.stats.proposals_count} proposal
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {project.stats.views} views
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {project.stats.saved_count} disimpan
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                <TabsTrigger value="proposals">Proposal ({project.proposals.length})</TabsTrigger>
                <TabsTrigger value="client">Klien</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Deskripsi Proyek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Persyaratan & Keahlian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Keahlian yang Dibutuhkan:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.required_skills.map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Timeline:</h4>
                        <div className="text-sm text-gray-600">
                          <div>Estimasi Durasi: {project.estimated_duration_days} hari</div>
                          {project.start_date && (
                            <div>Tanggal Mulai: {new Date(project.start_date).toLocaleDateString('id-ID')}</div>
                          )}
                          <div>Deadline: {new Date(project.deadline).toLocaleDateString('id-ID')}</div>
                        </div>
                      </div>

                      {project.klien_notes && (
                        <div>
                          <h4 className="font-medium mb-2">Catatan Klien:</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {project.klien_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Attachments */}
                {project.attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lampiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {project.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-sm">{attachment.name}</div>
                                <div className="text-xs text-gray-500">{attachment.size}</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="proposals" className="space-y-4">
                {project.proposals.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Proposal</h3>
                  <p className="text-gray-600">Jadilah yang pertama mengirim proposal untuk proyek ini!</p>
                      <Button className="mt-4" onClick={() => setShowProposalForm(true)}>
                        Kirim Proposal
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {project.proposals.map((proposal) => (
                      <Card key={proposal.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={proposal.seniman_avatar} alt={proposal.seniman_name} />
                                <AvatarFallback>{proposal.seniman_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{proposal.seniman_name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="ml-1">{proposal.seniman_rating}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{proposal.seniman_total_projects} proyek</span>
                                  <span>•</span>
                                  <span>{proposal.seniman_location}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {proposal.seniman_categories.map((cat) => (
                                    <Badge key={cat} variant="secondary" className="text-xs">
                                      {cat}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">Rp {proposal.proposed_budget.toLocaleString('id-ID')}</div>
                              <div className="text-sm text-gray-600">{proposal.proposed_timeline_days} hari</div>
                              <Badge className={`${getStatusColor(proposal.status)} mt-2`}>
                                {proposal.status === 'PENDING' ? 'Menunggu' : getStatusText(proposal.status)}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Cover Letter:</h4>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {proposal.cover_letter}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                <div>Tarif Normal: Rp {proposal.seniman_rate_per_hour.toLocaleString('id-ID')}/jam</div>
                                <div>Dikirim: {new Date(proposal.created_at).toLocaleDateString('id-ID')}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Chat
                                </Button>
                                <Button variant="outline" size="sm">
                                  Lihat Profil
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="text-center">
                      <Button onClick={() => setShowProposalForm(true)}>
                        Kirim Proposal
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="client" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Klien</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={project.klien.avatar} alt={project.klien.name} />
                        <AvatarFallback>{project.klien.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{project.klien.name}</h3>
                        <div className="text-gray-600">{project.klien.industry}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="ml-1">{project.klien.rating_as_buyer}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{project.klien.total_projects_posted} proyek diposting</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Ukuran Perusahaan:</span>
                        <div className="text-gray-600">{project.klien.company_size}</div>
                      </div>
                      <div>
                        <span className="font-medium">Industri:</span>
                        <div className="text-gray-600">{project.klien.industry}</div>
                      </div>
                      <div>
                        <span className="font-medium">Total Proyek:</span>
                        <div className="text-gray-600">{project.klien.total_projects_posted}</div>
                      </div>
                      <div>
                        <span className="font-medium">Total Pengeluaran:</span>
                        <div className="text-gray-600">Rp {project.klien.total_spent.toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => setShowProposalForm(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Proposal
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Klien
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Simpan Proyek
                </Button>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik Proyek</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="text-sm font-medium">{project.stats.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Proposal</span>
                  <span className="text-sm font-medium">{project.stats.proposals_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Disimpan</span>
                  <span className="text-sm font-medium">{project.stats.saved_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sisa Waktu</span>
                  <span className="text-sm font-medium">{project.stats.days_left} hari</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Proyek Serupa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">UI/UX Designer for Mobile App</h4>
                    <div className="text-xs text-gray-600 mt-1">Desain • Rp 3.000.000</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Fashion Photographer Needed</h4>
                    <div className="text-xs text-gray-600 mt-1">Fotografi • Rp 2.500.000</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Brand Identity Design</h4>
                    <div className="text-xs text-gray-600 mt-1">Desain • Rp 4.000.000</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Proposal Form Modal */}
      {showProposalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Kirim Proposal</CardTitle>
              <CardDescription>
                Berikan penawaran terbaik Anda untuk proyek ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProposalSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget yang Diajukan (Rp)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="4800000"
                      value={proposalData.budget}
                      onChange={(e) => setProposalData(prev => ({ ...prev, budget: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline (Hari)</Label>
                    <Input
                      id="timeline"
                      type="number"
                      placeholder="40"
                      value={proposalData.timeline}
                      onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_letter">Cover Letter</Label>
                  <Textarea
                    id="cover_letter"
                    placeholder="Jelaskan mengapa Anda adalah kandidat terbaik untuk proyek ini..."
                    value={proposalData.cover_letter}
                    onChange={(e) => setProposalData(prev => ({ ...prev, cover_letter: e.target.value }))}
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Jelaskan pengalaman, pendekatan Anda, dan meng Anda cocok untuk proyek ini.
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Proposal yang dikirim tidak dapat diedit. Pastikan semua informasi sudah benar sebelum mengirim.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowProposalForm(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmittingProposal}>
                    {isSubmittingProposal ? 'Mengirim...' : 'Kirim Proposal'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}