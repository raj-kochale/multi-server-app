module.exports = {
  apps: [
    {
      name: 'http-server',
      script: 'apps/http-server/dist/index.js',
      watch: false,
      env: {
        PORT: 3000
      }
    },
    {
      name: 'ws-server',
      script: 'apps/ws-server/dist/index.js',
      watch: false,
      env: {
        PORT: 3002
      }
    },
    {
      name: 'web',
      script: 'apps/web/.next/standalone/server.js',
      watch: false,
      env: {
        PORT: 3001
      }
    }
  ]
}; 