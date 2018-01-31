// Index app
import http from 'http'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import config from './config'
import schema from './schema'
import app from './server'

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`
    👍  GraphQL corriendo en ${config.HOST}:${config.PORT}/graphql
    👍  Subscriptions corriendo en ${config.SUBSCRIPTIONS_URL}/subscriptions
    🎉  GraphiQL en ${config.HOST}:${config.PORT}/ide
  `)
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: server,
      path: '/subscriptions'
    }
  )
})
