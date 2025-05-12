import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const response = NextResponse.json({ message: 'Logout successful' })
        response.cookies.set('token', '', { path: '/', httpOnly: true, maxAge: 0 });
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'An error occurred during logout' }, { status: 500 });
    }
}