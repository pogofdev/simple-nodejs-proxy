module.exports = {
    apps: [
      {
        name: "app",
        script: "npm",
        args: "start",
        watch: true,
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  };