/**
 * You can use nps to run these scripts, examples:
 *
 * nps dev
 * nps build.prod
 * nps watch.delay
 */

const path = require('path');

// wait this time before running the server
// it is used to wait for webpack to finish the first build
// and prevents nodemon from restarting twice when running "dev"
const initialWatchDelayTime = 10 * 1000;

// where we keep our generated graphql schemas
const schemasDir = path.join(__dirname, 'src', '__typedefs');
// where we keep our generated type definitions
const typeDefsFile = path.join(schemasDir, 'graphqlTypes.d.ts');

module.exports = {
    scripts: {
        // run the server in development mode, watch for changes and restart the server after each change
        dev: `NODE_ENV=development concurrently --kill-others-on-fail 'webpack --watch' 'nps start.watch.delay'`,
        build: {
            // build the server
            default: 'webpack',
            // build the server for production
            prod: 'NODE_ENV=production webpack ',
        },
       start: {
            // starts the server
            default: 'node ./dist/server.js',
            watch: {
                // starts the server, and restart after changes.
                default: `nodemon --watch dist -e js,ts,graphql,json --exec 'nps start'`,
                // wait some time and validate the existence of server.js
                // before watching with nodemon
                delay: `wait-on --delay ${initialWatchDelayTime} ./dist/server.js && nps start.watch`
            }
        },
        test: {
            // run tests with jest
            default: 'jest',
            // default: 'jest --forceExit --verbose --detectOpenHandles',
            // run tests with jest and watch
            watch: 'jest --verbose --detectOpenHandles'
        },
        lint: {
            // validate linting using tslint
            default: 'tslint -c tslint.json -p tsconfig.json'
        },
        // generate graphql schema and type definitions
        // --> the server must be running locally for this to work <--
        generateDefs: 'nps utils.downloadGraphqlSchema && nps utils.convertSchemaToTypescript',
        // generate api schematics
        utils: {
            // download the entire graphql api as a .graphql schema
            downloadGraphqlSchema: 'graphql get-schema',
            // convert a given graphql schema to typescript definitions
            convertSchemaToTypescript: `graphql-schema-typescript generate-ts  --global=true --namespace=GQL --typePrefix='' --output=${typeDefsFile} ${schemasDir}`,
            // use the generating typescript tool
            // for help: nps 'utils.graphqlSchemaTypescript --help'
            graphqlSchemaTypescript: 'graphql-schema-typescript generate-ts'
        },
    },
};
