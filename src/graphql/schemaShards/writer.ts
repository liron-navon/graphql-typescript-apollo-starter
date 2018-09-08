import {mockBooks, mockWriters, createNewWriter} from 'src/mocks';
import gql from 'graphql-tag';
import {pubsub, withFilter} from 'src/graphql/subscriptionManager';

const typeDefs = gql`
    extend type Query {
        # list all writers
        writerList: [Writer]
        # find a writer by id
        writerFindById(id: ID!): Writer
    }

    extend type Mutation {
        # create a new writer
        writerCreate(input: WriterCreateInput!): Writer
    }

    extend type Subscription {
        # called when a new writer is created
        writerCreated: Writer
    }

    # used for creating a new writer by mutation
    input WriterCreateInput {
        name: String
        birthDay: String
        country: CountryEnum
    }

    type Writer {
        id: ID
        name: String
        birthDay: String
        country: CountryEnum
        books: [Book]
    }
`;

export default {
    resolvers: {
        Query: {
            writerList: () => mockWriters,
            writerFindById: (root, {id}) => mockWriters.find(b => b.id === id)
        },
        Mutation: {
            writerCreate: (root, {input}) => {
                const newWriter = createNewWriter(input);
                pubsub.publish('writerCreated', {
                    writerCreated: newWriter
                });
                return newWriter;
            }
        },
        Subscription: {
            writerCreated: {
                subscribe: () => pubsub.asyncIterator('writerCreated')
            }
        },
        Writer: {
            books: writer => mockBooks.filter(({ writerId }) => writer.id === writerId)
        }
    },
    typeDefs: [typeDefs]
};

