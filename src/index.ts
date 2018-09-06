import {ApolloServer} from 'apollo-server-express';
import * as express from 'express';
import schema from 'src/graphql/schema';
import * as cors from 'cors';

const port = process.env.PORT || 3000;
const isPlaygroundActive = process.env.NODE_ENV !== 'production';

const app = express();
app.use(cors());

// create an apollo server
const server = new ApolloServer({
    schema: schema,
    playground: isPlaygroundActive ? {
        settings: {
            'editor.theme': 'dark', // change to light if you prefer
            'editor.cursorShape': 'line' // possible values: 'line', 'block', 'underline'
        }
    } : false
});

// add graphql routes
server.applyMiddleware({app, path: '/graphql'});

// start listening on the port
app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql ${ isPlaygroundActive ? 'with' : 'without' } playground`);
});
