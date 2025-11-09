import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      userType: string
      isVerified: boolean
      senimanProfile?: any
      klienProfile?: any
    } & DefaultSession['user']
  }

  interface User {
    userType: string
    isVerified: boolean
    senimanProfile?: any
    klienProfile?: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: string
    isVerified: boolean
    senimanProfile?: any
    klienProfile?: any
  }
}