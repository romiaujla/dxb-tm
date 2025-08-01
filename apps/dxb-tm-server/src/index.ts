import "dotenv/config";
import { App } from "./app";

const port = process.env.PORT || 3001;
const server = new App();

server.listen(port);
