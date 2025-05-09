import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        response.cookies.set('token', '', { path: '/', httpOnly: true, maxAge: 0 });
        return NextResponse.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'An error occurred during logout' }, { status: 500 });
    }
}