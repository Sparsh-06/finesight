/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove custom distDir to use default .next directory
    // distDir: 'build',
    
    // Ensure proper static export configuration
    output: 'standalone',
    
    // Disable strict mode for better compatibility
    reactStrictMode: false,
    
    // Add experimental features for better build stability
    experimental: {
        serverMinification: false,
    },
    
    // Webpack configuration to handle potential build issues
    webpack: (config, { isServer }) => {
        // Add fallbacks for Node.js modules
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        
        return config;
    },
};

export default nextConfig;
