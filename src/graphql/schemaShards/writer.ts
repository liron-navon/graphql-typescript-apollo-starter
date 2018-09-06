import {mockBooks, mockWriters, createNewWriter} from 'src/mocks';
import gql from 'graphql-tag';

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
            writerCreate: (root, {input}) => createNewWriter(input)
        },
        Writer: {
            books: writer => mockBooks.filter(({ writerId }) => writer.id === writerId)
        }
    },
    typeDefs: [typeDefs]
};

