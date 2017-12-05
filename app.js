// Index app
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { schema } from './schema'

const app = express()

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

const PORT = 8080
app.listen(PORT, () => {
  console.log(`
    👍  GraphQL corriendo en http://localhost:${PORT}
    🎉  GraphiQL en http://localhost:${PORT}/graphiql
  `)
})