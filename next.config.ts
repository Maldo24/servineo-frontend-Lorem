import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "drive.google.com",
                pathname: "/**",

            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                pathname: "/**",

            },
            {
                protocol: "https",
                hostname: "ejemplo.com",
                pathname: "/**",

            },

        ],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    }
    /* config options here */
};

export default withNextIntl(nextConfig);
