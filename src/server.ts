import http from "http";

import { serverHandler } from "./server.handler";

export class Server {
  private readonly server: http.Server;

  constructor(port: number | string) {
    const server = http.createServer(serverHandler);
    server.listen(port, () => console.log(`Server is running on ${port}`));

    this.server = server;
  }

  public getServer() {
    return this.server;
  }
}
