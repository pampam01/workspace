'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Check,
  CheckCheck,
  Clock,
  Circle,
  User,
  Briefcase,
  Star,
  MapPin,
  MessageCircle
} from 'lucide-react'

// Mock data untuk conversations
const mockConversations = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Siti Nurhaliza',
      avatar: '/avatars/siti.jpg',
      role: 'seniman',
      rating: 4.8,
      location: 'Yogyakarta',
      category: 'Batik, Fashion'
    },
    lastMessage: {
      id: '1',
      content: 'Baik, saya akan selesaikan desainnya besok sore.',
      timestamp: '2024-01-23T14:30:00Z',
      isRead: true,
      isFromMe: false
    },
    unreadCount: 0,
    project: {
      id: '1',
      title: 'Desain Koleksi Fashion Spring/Summer'
    }
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Budi Santoso',
      avatar: '/avatars/budi.jpg',
      role: 'seniman',
      rating: 4.9,
      location: 'Jakarta',
      category: 'Desain, Coding'
    },
    lastMessage: {
      id: '2',
      content: 'Proposal sudah saya kirim. Mohon dicek ya.',
      timestamp: '2024-01-23T12:15:00Z',
      isRead: false,
      isFromMe: false
    },
    unreadCount: 2,
    project: {
      id: '2',
      title: 'Branding untuk Produk Baru'
    }
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'PT Creative Studio',
      avatar: '/avatars/company1.jpg',
      role: 'klien',
      rating: 4.7,
      location: 'Jakarta',
      industry: 'Fashion & Retail'
    },
    lastMessage: {
      id: '3',
      content: 'Terima kasih, hasilnya sangat bagus!',
      timestamp: '2024-01-22T16:45:00Z',
      isRead: true,
      isFromMe: true
    },
    unreadCount: 0,
    project: {
      id: '3',
      title: 'Logo Design'
    }
  }
]

// Mock data untuk messages dalam satu conversation
const mockMessages = [
  {
    id: '1',
    senderId: '1',
    content: 'Halo, saya tertarik dengan proyek desain fashion yang Anda posting.',
    timestamp: '2024-01-23T10:00:00Z',
    isRead: true,
    status: 'read'
  },
  {
    id: '2',
    senderId: 'current',
    content: 'Halo! Terima kasih sudah menghubungi. Bisa ceritakan lebih detail tentang kebutuhan Anda?',
    timestamp: '2024-01-23T10:15:00Z',
    isRead: true,
    status: 'read'
  },
  {
    id: '3',
    senderId: '1',
    content: 'Saya butuh desain untuk koleksi Spring/Summer dengan tema "Urban Garden". Total ada 15 outfit yang perlu didesain.',
    timestamp: '2024-01-23T10:30:00Z',
    isRead: true,
    status: 'read'
  },
  {
    id: '4',
    senderId: 'current',
    content: 'Menarik! Saya sudah lihat brief-nya. Untuk timeline 45 hari dan budget Rp 5 juta, saya bisa kerjakan.',
    timestamp: '2024-01-23T11:00:00Z',
    isRead: true,
    status: 'read'
  },
  {
    id: '5',
    senderId: '1',
    content: 'Bagus! Apa saja yang akan Anda sertakan dalam proposal?',
    timestamp: '2024-01-23T11:30:00Z',
    isRead: true,
    status: 'read'
  },
  {
    id: '6',
    senderId: 'current',
    content: 'Saya akan sertakan mood board, color palette, sketch desain, dan estimasi waktu untuk setiap outfit.',
    timestamp: '2024-01-23T12:00:00Z',
    isRead: true,
    status: 'read'
  },
  {
    id: '7',
    senderId: '1',
    content: 'Baik, saya akan selesaikan desainnya besok sore.',
    timestamp: '2024-01-23T14:30:00Z',
    isRead: true,
    status: 'read'
  }
]

export default function MessagePage() {
  const params = useParams()
  const router = useRouter()
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load conversation details
    if (params.userId) {
      const conversation = conversations.find(c => c.user.id === params.userId)
      setSelectedConversation(conversation || null)
    }
  }, [params.userId, conversations])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }
  }

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInDays === 1) {
      return 'Kemarin'
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('id-ID', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const messageData = {
      id: Date.now().toString(),
      senderId: 'current',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
      status: 'sending'
    }

    setMessages(prev => [...prev, messageData])
    setNewMessage('')

    // Simulate sending message
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageData.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      )
    }, 1000)

    // Simulate message delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageData.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    }, 2000)

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageData.id 
            ? { ...msg, status: 'read', isRead: true }
            : msg
        )
      )
    }, 3000)
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.project.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const MessageStatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversations List */}
        <div className="w-80 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-4">Pesan</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari percakapan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.user.id}`}
                className={`block p-4 border-b hover:bg-gray-50 transition-colors ${
                  selectedConversation?.user.id === conversation.user.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.user.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatLastMessageTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {conversation.user.role === 'seniman' ? 'Seniman' : 'Klien'}
                      </Badge>
                      {conversation.user.rating && (
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{conversation.user.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 truncate">
                        {conversation.project.title}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                    <AvatarFallback>{selectedConversation.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge variant="secondary" className="text-xs">
                        {selectedConversation.user.role === 'seniman' ? 'Seniman' : 'Klien'}
                      </Badge>
                      {selectedConversation.user.rating && (
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="ml-1">{selectedConversation.user.rating}</span>
                        </div>
                      )}
                      {selectedConversation.user.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3" />
                          <span className="ml-1">{selectedConversation.user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {selectedConversation.project && (
                <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">
                        {selectedConversation.project.title}
                      </span>
                    </div>
                    <Link href={`/projects/${selectedConversation.project.id}`}>
                      <Button variant="outline" size="sm">
                        Lihat Proyek
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.senderId === 'current' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.senderId === 'current'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      message.senderId === 'current' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.senderId === 'current' && (
                        <MessageStatusIcon status={message.status} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Button type="button" variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Ketik pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Percakapan</h3>
              <p className="text-gray-600">Pilih percakapan dari daftar di sebelah kiri untuk memulai mengobrol</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}