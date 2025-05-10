/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },

    // watchOptions: {
    //     ignored: [
    //         '**/C:/Users/ASUS/Application Data/**', // Explicit ignore
    //         '**/node_modules/**',                   // General ignore
    //     ],
    // }
};

export default nextConfig;
