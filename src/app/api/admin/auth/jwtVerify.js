import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

function jwtVerify(req) {
    try {
        // Get cookies from the request
        const cookies = req.cookies;
        const token = cookies.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        const tokenValue = token.value;

        // Validate the JWT
        return jwt.verify(tokenValue, secretKey);
    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}

export { jwtVerify };