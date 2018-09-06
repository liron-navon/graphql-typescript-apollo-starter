import {mockBooks, mockWriters, createNewBook} from 'src/mocks';
import gql from 'graphql-tag';

const typeDefs = gql`
    extend type Query {
        # list all books
        bookList: [Book]
        # find a book by id
        bookFindById(id: ID!): Book
        # find books by writer id
        bookListByWriterId(writerId: ID!): [Book]
    }

    extend type Mutation {
        # create a new book
        bookCreate(input: BookCreateInput!): Book
        # change book description
        bookRedescribe(input: BookRedescribeInput!): Book
        # vote book
        bookVote(input: BookVoteInput!): Book
    }

    # used for redescribing a book by mutation
    input BookVoteInput {
        id: ID!
        score: ScalarValidStarsVote!
    }

    # used for redescribing a book by mutation
    input BookRedescribeInput {
        id: ID!
        description: String!
    }

    # used for creating a new book by mutation
    input BookCreateInput {
        name: String!
        writerId: ID!
        description: String
    }

    type Book {
        id: ID
        writerId: ID
        name: String
        writer: Writer
        description: String
        score: Float,
        votes: Int
    }
`;

export default {
    resolvers: {
        Query: {
            bookList: () => mockBooks,
            bookFindById: (root, {id}) => mockBooks.find(b => b.id === id),
            bookListByWriterId: (root, {id}) => mockBooks.filter(b => b.writerId === id),
        },
        Mutation: {
            bookCreate: (root, {input}) => createNewBook(input),
            bookRedescribe: (root, { input: { id, description } }) => {
                const mutableBook = mockBooks.find(book => id === book.id);
                mutableBook.description = description;
                return mutableBook;
            },
            bookVote: (root, { input: { id, score } }) => {
                const bookToVoteFor = mockBooks.find(book => id === book.id);
                const newVotes = bookToVoteFor.votes + 1;
                const newScore = ((bookToVoteFor.score * bookToVoteFor.votes) + score)  / newVotes;

                bookToVoteFor.score = newScore;
                bookToVoteFor.votes = newVotes;

                return bookToVoteFor;
            },
        },
        Book: {
            writer: book => mockWriters.find(({id}) => id === book.writerId)
        }
    },
    typeDefs: [typeDefs]
};

