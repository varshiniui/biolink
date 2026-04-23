import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const submitted = req.headers.get('x-admin-password') ?? ''
    const stored = process.env.ADMIN_PASSWORD ?? ''

    return NextResponse.json({
        passwordLength: stored.length,
        trimmedLength: stored.trim().length,
        firstChar: stored[0],
        lastChar: stored[stored.length - 1],
        charCodes: [...stored].map(c => c.charCodeAt(0)), // reveals hidden characters
    })
}