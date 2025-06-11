import { App } from "./app";


const port = process.env.PORT || 3000;
const server = new App();

server.listen(port);
