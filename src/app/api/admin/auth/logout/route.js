import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Clear authentication-related cookies or tokens
        const response = NextResponse.json({ message: 'Logout successful' });
        response.cookies.set('token', '', { path: '/', httpOnly: true, maxAge: 0 });

        // Return the response
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
    }
}