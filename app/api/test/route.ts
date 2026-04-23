import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const submitted = req.headers.get('x-admin-password')
    return NextResponse.json({
        hasPassword: !!process.env.ADMIN_PASSWORD,
        passwordLength: process.env.ADMIN_PASSWORD?.length,
        trimmedLength: process.env.ADMIN_PASSWORD?.trim().length,
        submittedLength: submitted?.length,
        match: submitted === process.env.ADMIN_PASSWORD,
    })
}