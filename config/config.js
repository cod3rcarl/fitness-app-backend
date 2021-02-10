const dotenv = require("dotenv");
dotenv.config();

const config = {
  SECRET: process.env.SESSION_SECRET,
  CONNECT: process.env.MONGO_DB_CONNECTION,
  PORT: process.env.PORT,
  SOCKET_CONNECTION: process.env.SOCKET_CONNECTION,
  ACCESS_KEY: process.env.S3_ACCESS_KEY,
  ACCESS_SECRET: process.env.S3_ACCESS_SECRET,
};
module.exports = config;
