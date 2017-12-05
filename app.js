// Index app
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { schema } from './schema';

// new
import cors from 'cors';
import http from 'http';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const app = express();
app.use(cors());

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

const PORT = 8080;
const SUBSCRIPTIONS_URL = `ws://localhost:${PORT}/subscriptions`;

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: SUBSCRIPTIONS_URL
}));

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`
    👍  GraphQL corriendo en http://localhost:${PORT}
    👍  Subscriptions corriendo en ws://localhost:${PORT}
    🎉  GraphiQL en http://localhost:${PORT}/graphiql
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
	);
});