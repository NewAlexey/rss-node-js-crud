import dotenv from "dotenv";

import { Server } from "./server";

dotenv.config();

const port = process.env.PORT ?? 3000;

new Server(port);
