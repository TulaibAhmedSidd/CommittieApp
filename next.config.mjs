import withPWAInit from 'next-pwa';
import defaultCache from 'next-pwa/cache.js';

const withPWA = withPWAInit({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    // Videos are big: never download them when the app is installed, only when someone presses play.
    publicExcludes: ['!noprecache/**/*', '!guides/**/*', '!video/**/*'],
    // Never cache API answers (private data, money status). Pages and static files keep the default caching.
    runtimeCaching: [
        { urlPattern: ({ url }) => url.pathname.startsWith('/api/'), handler: 'NetworkOnly', method: 'GET' },
        ...defaultCache,
    ],
});

const isDev = process.env.NODE_ENV === 'development';

const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    "connect-src 'self'",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Lint runs separately with `npm run lint`.
        ignoreDuringBuilds: true,
    },
    // Old URLs from before the 2026-10 redesign.
    async redirects() {
        const idQuery = [{ type: 'query', key: 'id', value: '(?<id>[a-f0-9]{24})' }];
        return [
            { source: '/admin/login', destination: '/login', permanent: false },
            { source: '/adminLogin', destination: '/login', permanent: false },
            { source: '/admin/forgot-password', destination: '/forgot-password', permanent: false },
            { source: '/admin/manage', has: idQuery, destination: '/admin/bc/:id', permanent: false },
            { source: '/admin/edit', has: idQuery, destination: '/admin/bc/:id', permanent: false },
            { source: '/admin/manage', destination: '/admin/bcs', permanent: false },
            { source: '/admin/manage-committie', destination: '/admin/bcs', permanent: false },
            { source: '/admin/announcement', destination: '/admin/bcs', permanent: false },
            { source: '/admin/referrals', destination: '/admin/invite', permanent: false },
            { source: '/admin/assign-member', destination: '/admin/members', permanent: false },
            { source: '/admin/addmember', destination: '/admin/members', permanent: false },
            { source: '/admin/add-admin', destination: '/admin/approvals', permanent: false },
            { source: '/admin/theme', destination: '/admin', permanent: false },
            { source: '/userDash/committee/:id', destination: '/userDash/bc/:id', permanent: false },
            { source: '/userDash/join', has: idQuery, destination: '/userDash/bc/:id', permanent: false },
            { source: '/userDash/join', destination: '/userDash/explore', permanent: false },
            { source: '/userDash/organizer', has: idQuery, destination: '/userDash/organizer/:id', permanent: false },
            { source: '/notification', destination: '/userDash/notifications', permanent: false },
            { source: '/theme-guide', destination: '/', permanent: false },
        ];
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [{ key: 'Cache-Control', value: 'no-store' }],
            },
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                    { key: 'Permissions-Policy', value: 'camera=(self), geolocation=(self), microphone=()' },
                    { key: 'Content-Security-Policy', value: csp },
                ],
            },
        ];
    },
};

export default withPWA(nextConfig);
