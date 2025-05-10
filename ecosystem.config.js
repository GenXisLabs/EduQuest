module.exports = {
    apps: [
      {
        name: 'eduquest',
        script: 'npm',
        args: 'start -- -p 9000',
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  };