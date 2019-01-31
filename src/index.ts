import {ApolloServer} from 'apollo-server-express';
import * as express from 'express';
import schema from 'src/graphql/schema';
import * as cors from 'cors';
import {createServer} from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const isPlaygroundActive = env !== 'production';

// Regular express setup
const app = express();
app.use(cors());

// Create an apollo server
const apolloServer = new ApolloServer({
    schema: schema,
    subscriptions: '/subscriptions',
    playground: isPlaygroundActive ? {
        settings: {
            'editor.theme': 'dark', // change to light if you prefer
            'editor.cursorShape': 'line' // possible values: 'line', 'block', 'underline'
        }
    } : false
});

// Add graphql routes
apolloServer.applyMiddleware({app, path: '/graphql'});

// Start listening on the port
const server = createServer(app);
server.listen(port, () => {
    console.log('environment:', env, process.env.NODE_ENV);
    console.log(`🚀 Server ready at http://localhost:${port}/graphql ${ isPlaygroundActive ? 'with' : 'without' } playground`);

    // Set up the WebSocket for handling GraphQL subscriptions
    const sunscriptionServer = new SubscriptionServer({
        execute,
        subscribe,
        schema
    }, {
        server,
        path: '/subscriptions',
    });
});
