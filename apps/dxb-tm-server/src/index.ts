'use strict'
import express, { NextFunction, Request, Response } from 'express';
import { env } from 'process';

/**
 * Setting up the environment
 */
const app = express()
const port = env.PORT || 3000;

/**
 * Starting the server
 */
app.listen(port, function (err?: Error) {
  if (err) {
    return console.error(err)
  }

  console.log(`Started at http://localhost:${port}`)
})

/**
 * Routes
 */
app.get('/test', (_req: Request, res: Response) => {
  res.status(200).send('Server is running!')
})

/**
 * Error handlers
 */
app.use(function fourOhFourHandler(_req: Request, res: Response) {
  res.status(404).send()
})

app.use(function fiveHundredHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  res.status(500).send()
})
