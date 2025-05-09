import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        // Get cookies from the request
        const cookies = req.cookies;
        const token = cookies.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        // Validate the JWT
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);

        return NextResponse.json({ message: 'Token is valid', user: decoded });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}