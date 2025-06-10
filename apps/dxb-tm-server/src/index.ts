'use strict'
import express, { NextFunction, Request, Response } from 'express'

// Create the express app
const app = express()

// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)

// Error handlers


// Start server
app.listen(1234, function (err?: Error) {
  if (err) {
    return console.error(err)
  }

  console.log('Started at http://localhost:1234')
})

app.get('/test', (_req: Request, res: Response) => {
  res.status(200).send('Server is running!')
})

app.use(function fourOhFourHandler(_req: Request, res: Response) {
  res.status(404).send()
})

app.use(function fiveHundredHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  res.status(500).send()
})
