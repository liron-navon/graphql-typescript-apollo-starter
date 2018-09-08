import {mergeWith, isArray} from 'lodash';
import gql from 'graphql-tag';
import {makeExecutableSchema} from 'graphql-tools';
import graphqlEnums from 'src/graphql/enums';
import graphqlScalarTypes from 'src/graphql/scalarTypes';
import {mergeRawSchemas} from 'src/graphql/helpers/mergeRawSchemas';
import graphqlSchemaShards from 'src/graphql/schemaShards';

const schema = mergeRawSchemas(
    {
        typeDefs: [
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

export default makeExecutableSchema(schema);
