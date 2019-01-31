import gql from 'graphql-tag';
import {makeExecutableSchema} from 'graphql-tools';
import {mergeRawSchemas} from 'src/graphql/helpers/mergeRawSchemas';
import graphqlEnums from 'src/graphql/enums';
import graphqlScalarTypes from 'src/graphql/scalarTypes';
import graphqlSchemaShards from 'src/graphql/schemaShards';

// create a complete schema by merging the shards
const schema = mergeRawSchemas(
    {
        typeDefs: [
            // we create empty main types, we can later extend them in the shards
            gql`
                type Query {
                    _empty: String
                }

                type Mutation {
                    _empty: String
                }

                type Subscription {
                    _empty: String
                }
            `
        ].concat(graphqlEnums),
        resolvers: {}
    },
    graphqlSchemaShards,
    graphqlScalarTypes,
);

// we turn the schema into an object apollo can use to create an api
export default makeExecutableSchema(schema);
