/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false }
        config.externals.push("pino-pretty", "lokijs", "encoding")
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "nft-cdn.alchemy.com",
                port: "",
                pathname: "/eth-mainnet/**",
            },
        ],
        dangerouslyAllowSVG: true,
    },
}

module.exports = nextConfig
