import ScalarValidStarsVote from 'src/graphql/scalarTypes/ScalarValidStarsVote';
import gql from 'graphql-tag';

// Scalar types can be used to validate input, and modify output
// https://www.apollographql.com/docs/graphql-tools/scalars.html

export default {
    resolvers: {
        ScalarValidStarsVote
    },
    typeDefs: gql`
        scalar ScalarValidStarsVote
    `
};
