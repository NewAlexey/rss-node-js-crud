import dotenv from "dotenv";

dotenv.config();

import { heh } from "./componens/heh";

const param = "1555";

heh(param);
heh(process.env.PORT ?? "3000");
