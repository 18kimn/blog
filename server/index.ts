import express from 'express'
import {handler} from './ui/handler'
import 'dotenv/config'

async function main() {
  const app = express()
  app.use(handler).listen(process.env.PORT || 3500)
}

main()
