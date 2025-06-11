import 'dotenv/config';
import { App } from "./app";

console.log('PORT:', process.env.PORT);
const port = process.env.PORT || 3000;
const server = new App();

server.listen(port);
