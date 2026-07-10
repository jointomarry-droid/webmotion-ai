'use client'

import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

/**
 * Check if the Supabase key is valid
 * Supports both legacy JWT format (eyJ...) and new publishable format (sb_publishable_...)
 */
function isValidAnonKey(key: string): boolean {
  return key.startsWith('eyJ') || key.startsWith('sb_publishable_')
}

export function createClient() {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || !isValidAnonKey(supabaseAnonKey)) {
    // Return a mock client for demo mode
    return createDemoClient()
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Supports both legacy JWT keys and new publishable keys
  return !!(url && key && (key.startsWith('eyJ') || key.startsWith('sb_publishable_')) && url.includes('supabase'))
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured()
}

/**
 * Demo user for when Supabase is not configured
 */
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@webmotion.ai',
  user_metadata: {
    full_name: 'Demo User',
    avatar_url: null,
  },
  created_at: new Date().toISOString(),
}

/**
 * Create a mock Supabase client for demo mode
 * This allows the app to work without a real Supabase backend
 */
function createDemoClient() {
  const storageKey = 'webmotion-demo-session'
  
  const getSession = async () => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const session = JSON.parse(stored)
        return { data: { session }, error: null }
      } catch {
        return { data: { session: null }, error: null }
      }
    }
    return { data: { session: null }, error: null }
  }

  const getUser = async () => {
    const { data } = await getSession()
    if (data.session) {
      return { data: { user: DEMO_USER }, error: null }
    }
    return { data: { user: null }, error: null }
  }

  return {
    auth: {
      getSession,
      getUser,
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        // Demo: accept any email/password
        if (email && password) {
          const session = { user: DEMO_USER, access_token: 'demo-token' }
          localStorage.setItem(storageKey, JSON.stringify(session))
          return { data: { user: DEMO_USER, session }, error: null }
        }
        return { data: { user: null, session: null }, error: { message: 'Invalid credentials' } }
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        // Demo: create account immediately
        if (email && password) {
          const session = { user: DEMO_USER, access_token: 'demo-token' }
          localStorage.setItem(storageKey, JSON.stringify(session))
          return { data: { user: DEMO_USER, session }, error: null }
        }
        return { data: { user: null, session: null }, error: { message: 'Invalid input' } }
      },
      signOut: async () => {
        localStorage.removeItem(storageKey)
        return { error: null }
      },
      onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
        // Check initial state
        getSession().then(({ data }) => {
          if (data.session) {
            setTimeout(() => callback('SIGNED_IN', data.session), 0)
          }
        })
        
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        single: async () => ({ data: null, error: null }),
        limit: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({ data: null, error: null }),
      }),
    }),
  } as any
}
