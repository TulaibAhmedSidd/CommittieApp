import { NextResponse } from 'next/server';

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // 1. Security Headers
    const requestHeaders = new Headers(req.headers);
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;");

    // 2. Auth Route Exceptions
    // Bypass middleware token check for endpoints handled with internal route logic
    const isAuthRoute =
        pathname.startsWith('/api/admin/login') ||
        pathname.startsWith('/api/login') ||
        (pathname === '/api/admin' && req.method === 'POST') ||
        (pathname === '/api/member' && req.method === 'POST') ||
        pathname.startsWith('/api/member/pool') ||
        pathname.startsWith('/api/member/approve') ||
        pathname.startsWith('/api/member/disapprove') ||
        pathname.startsWith('/api/member/unassign-member') ||
        pathname.startsWith('/api/member/assign-members') ||
        pathname.startsWith('/api/member/respond-request') ||
        pathname.startsWith('/api/member/admin-members') ||
        pathname.startsWith('/api/member/reset-password') ||
        pathname.startsWith('/api/member/bulk-upload') ||
        pathname.startsWith('/api/member/my-committie') ||
        (pathname.includes('/assets') && req.method === 'GET');

    if ((pathname.startsWith('/api/admin') || pathname.startsWith('/api/member')) && !isAuthRoute) {
        const token = req.headers.get('Authorization');
        if (!token) {
            return new Response(JSON.stringify({ message: 'Unauthorized: No token provided' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    }

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
