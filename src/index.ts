import http from "http";

import dotenv from "dotenv";

import { serverHandler } from "./server.handler";

dotenv.config();

const serverPort = process.env.PORT ?? 3000;

const server = http.createServer(serverHandler);
server.listen(serverPort, () =>
  console.log(`Server is running on ${serverPort}`),
);
