module.exports = {
  apps: [
    {
      name: "blog:8000",
      cwd: __dirname,
      script: "node",
      args: "-r dotenv/config build/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "8000",
      },
    },
  ],
};
