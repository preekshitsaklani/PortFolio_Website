/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ['@xenova/transformers', 'onnxruntime-node'],
    experimental: {
        turbopackUseSystemTlsCerts: true,
    },
};

module.exports = nextConfig;
