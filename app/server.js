import express from 'express'
import { createServer } from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'

import schema from './schema'
import config from './config'

const app = express()

app.use(cors())

app.use(
  '/ide',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `${config.SUBSCRIPTIONS_URL}/subscriptions`
  })
)

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }))

export default app
