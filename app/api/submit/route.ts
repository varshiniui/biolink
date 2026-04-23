import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { impression, talk_choice, message, answers, game } = body

    if (!message && !impression && !answers) {
      return NextResponse.json({ error: 'Nothing to submit' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('responses').insert({
      impression: impression || null,
      talk_choice: talk_choice || null,
      message: message || null,
      answers: answers || null,
      game: game || null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}