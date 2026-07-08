import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@nirogitanman/ui', '@nirogitanman/supabase', '@nirogitanman/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
