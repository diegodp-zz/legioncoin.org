module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'npm',
      args: 'run start',
      instances: 'max', // or set a specific number of instances like 4
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'partykit-server',
      script: 'npm',
      args: 'run party',
      instances: 'max', // or set a specific number of instances like 4
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
