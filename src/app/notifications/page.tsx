'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  Check, 
  X, 
  Settings,
  Archive,
  Trash2,
  Briefcase,
  Star,
  MessageCircle,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react'

// Mock data untuk notifications
const mockNotifications = [
  {
    id: '1',
    type: 'project_invite',
    title: 'Undangan Proyek Baru',
    description: 'PT Creative Studio mengundang Anda untuk proyek "Desain Logo Perusahaan"',
    relatedId: 'project-123',
    isRead: false,
    createdAt: '2024-01-23T10:30:00Z',
    actionUrl: '/projects/project-123',
    user: {
      name: 'PT Creative Studio',
      avatar: '/avatars/company1.jpg',
      role: 'klien'
    }
  },
  {
    id: '2',
    type: 'proposal_accepted',
    title: 'Proposal Diterima',
    description: 'Proposal Anda untuk proyek "Desain Koleksi Fashion" telah diterima!',
    relatedId: 'project-456',
    isRead: false,
    createdAt: '2024-01-23T09:15:00Z',
    actionUrl: '/projects/project-456',
    user: {
      name: 'PT Fashion Indonesia',
      avatar: '/avatars/company2.jpg',
      role: 'klien'
    }
  },
  {
    id: '3',
    type: 'message_received',
    title: 'Pesan Baru',
    description: 'Anda menerima pesan baru dari Siti Nurhaliza',
    relatedId: 'message-789',
    isRead: true,
    createdAt: '2024-01-22T16:45:00Z',
    actionUrl: '/messages/1',
    user: {
      name: 'Siti Nurhaliza',
      avatar: '/avatars/siti.jpg',
      role: 'seniman'
    }
  },
  {
    id: '4',
    type: 'payment_received',
    title: 'Pembayaran Diterima',
    description: 'Pembayaran untuk proyek "Website Redesign" telah diterima',
    relatedId: 'transaction-101',
    isRead: true,
    createdAt: '2024-01-22T14:20:00Z',
    actionUrl: '/dashboard/seniman/earnings',
    user: {
      name: 'System',
      avatar: '/avatars/system.jpg',
      role: 'system'
    }
  },
  {
    id: '5',
    type: 'review_posted',
    title: 'Ulasan Baru',
    description: 'Eco Fashion Studio memberikan ulasan 5 bintang untuk proyek "Koleksi Batik"',
    relatedId: 'review-202',
    isRead: true,
    createdAt: '2024-01-21T11:30:00Z',
    actionUrl: '/dashboard/seniman/reviews',
    user: {
      name: 'Eco Fashion Studio',
      avatar: '/avatars/company3.jpg',
      role: 'klien'
    }
  },
  {
    id: '6',
    type: 'project_update',
    title: 'Update Proyek',
    description: 'Proyek "Branding Produk" telah diperbarui statusnya menjadi "In Progress"',
    relatedId: 'project-303',
    isRead: true,
    createdAt: '2024-01-20T08:15:00Z',
    actionUrl: '/projects/project-303',
    user: {
      name: 'System',
      avatar: '/avatars/system.jpg',
      role: 'system'
    }
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project_invite':
        return <Briefcase className="h-5 w-5 text-blue-500" />
      case 'proposal_accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'message_received':
        return <MessageCircle className="h-5 w-5 text-purple-500" />
      case 'payment_received':
        return <DollarSign className="h-5 w-5 text-yellow-500" />
      case 'review_posted':
        return <Star className="h-5 w-5 text-orange-500" />
      case 'project_update':
        return <AlertCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'project_invite':
        return 'bg-blue-50 border-blue-200'
      case 'proposal_accepted':
        return 'bg-green-50 border-green-200'
      case 'message_received':
        return 'bg-purple-50 border-purple-200'
      case 'payment_received':
        return 'bg-yellow-50 border-yellow-200'
      case 'review_posted':
        return 'bg-orange-50 border-orange-200'
      case 'project_update':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Baru saja'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} jam yang lalu`
    } else if (diffInHours < 48) {
      return 'Kemarin'
    } else {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    )
  }

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const handleBulkDelete = () => {
    setNotifications(prev =>
      prev.filter(n => !selectedNotifications.includes(n.id))
    )
    setSelectedNotifications([])
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'unread') {
      return matchesSearch && !notification.isRead
    } else if (activeTab === 'read') {
      return matchesSearch && notification.isRead
    }
    return matchesSearch
  })

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
                <X className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
              <p className="text-gray-600 mt-1">
                Kelola notifikasi dan update terbaru dari proyek Anda
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Tandai Semua Dibaca
              </Button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari notifikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                Semua
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                  {notifications.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Belum Dibaca
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">
                Sudah Dibaca
              </TabsTrigger>
            </TabsList>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedNotifications.length} dipilih
                </span>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {filteredNotifications.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <span className="text-sm">Pilih semua</span>
              </label>
            </div>
          )}

          {/* Notifications List */}
          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'unread' ? 'Tidak Ada Notifikasi Baru' : 'Tidak Ada Notifikasi'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'unread' 
                      ? 'Semua notifikasi sudah dibaca'
                      : 'Belum ada notifikasi'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-purple-600' : ''
                  } ${getNotificationColor(notification.type)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="mt-1 rounded"
                      />
                      
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className={`font-medium text-gray-900 ${
                              !notification.isRead ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTime(notification.createdAt)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                                <AvatarFallback className="text-xs">
                                  {notification.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">
                                {notification.user.name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {notification.user.role === 'seniman' ? 'Seniman' : 'Klien'}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Tandai Dibaca
                              </Button>
                            )}
                            {notification.actionUrl && (
                              <Link href={notification.actionUrl}>
                                <Button variant="outline" size="sm" className="text-xs">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Lihat
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}