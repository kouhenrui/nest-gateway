import dotenv from 'dotenv';
import path from 'path';
// 解析 `.env` 文件
dotenv.config({
  path:
    path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`) ||
    path.resolve(__dirname, '../../.env'),
});

export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  mainDatabase: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  // logDatabase: {
  //   host: process.env.LOG_DB_HOST,
  //   port: parseInt(process.env.LOG_DB_PORT!, 10),
  //   username: process.env.LOG_DB_USER,
  //   password: process.env.LOG_DB_PASS,
  // },
  whitePaths: process.env.WHITE_PATH ? process.env.WHITE_PATH.split(',') : [],
  jwt: {
    secret: process.env.JWT_SECRET,
    exp: process.env.JWT_EXP || 3600,
  },
});
