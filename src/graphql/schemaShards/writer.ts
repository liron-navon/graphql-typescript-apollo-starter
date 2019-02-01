import {mockBooks, mockWriters, createNewWriter} from 'src/mocks';
import gql from 'graphql-tag';
import {pubsub} from 'src/graphql/subscriptionManager';

const typeDefs = gql`
    extend type Query {
        " list all writers "
        writerList: [Writer]
        " find a writer by id "
        writerFindById(id: ID!): Writer
    }

    extend type Mutation {
        " create a new writer "
        writerCreate(input: WriterCreateInput!): Writer
    }

    extend type Subscription {
        " called when a new writer is created "
        writerCreated: Writer
    }

    " used for creating a new writer by mutation "
    input WriterCreateInput {
        name: String
        birthDay: String
        country: CountryEnum
    }

    " a writer definition "
    type Writer {
        id: ID
        name: String
        " when the writer was born "
        birthDay: String
        " the country that the writer lives in "
        country: CountryEnum
        " a list of published books "
        books: [Book]
    }
`;

export default {
    resolvers: {
        Query: {
            // get a list of all the writers
            writerList: () => mockWriters,
            // find a writer by it's id
            writerFindById: (root, {id}: GQL.QueryToWriterFindByIdArgs) => mockWriters.find(b => b.id === id)
        },
        Mutation: {
            // create a new writer
            writerCreate: (root, {input}: GQL.MutationToWriterCreateArgs) => {
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

