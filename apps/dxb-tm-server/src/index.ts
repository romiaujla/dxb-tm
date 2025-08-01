import "dotenv/config";
import { App } from "./app";

const port = process.env.PORT || 3001;
const server = new App();
const dbURL = process.env.DATABASE_URL;

console.log(`Database URL: ${dbURL}`);

server.listen(port);
