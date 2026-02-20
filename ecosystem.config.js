module.exports = {
  apps: [
    {
      name: 'site',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 6003',
      env_local: {
        APP_ENV: 'local' // APP_ENV=local
      },
      env_development: {
        APP_ENV: 'development' // APP_ENV=dev
      },
      env_production: {
        APP_ENV: 'production' // APP_ENV=prod
      }
    }
  ]
}