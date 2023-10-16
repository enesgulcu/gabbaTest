/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      //appDir: true,
    },
    images: {
      domains: ['source.unsplash.com'],
    },
    
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.module.rules.push({
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
              },
            },
          ],
        });
      }
  
      return config;
    },
    
  }
  
  module.exports = nextConfig
  