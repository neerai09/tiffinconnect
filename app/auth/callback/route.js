import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role') || 'customer'

  if (code) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    if (session?.user) {
      const { data: existing } = await supabase.from('profiles').select('id').eq('id', session.user.id).single()
      if (!existing) {
        await supabase.from('profiles').insert({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url || null,
          role: role,
        })
      }
      return NextResponse.redirect(`${origin}/${role === 'provider' ? 'provider' : 'customer'}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
