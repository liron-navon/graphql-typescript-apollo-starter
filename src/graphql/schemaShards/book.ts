import {mockBooks, mockWriters, createNewBook, IBook} from 'src/mocks';
import gql from 'graphql-tag';
import {withFilter, pubsub} from 'src/graphql/subscriptionManager';

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

    extend type Subscription {
        # called whenever an existing book mutation is called
        bookUpdated(bookId: ID!): BookUpdateSubscription
        # called when a new book is added
        bookCreated: Book
    }

    type BookUpdateSubscription {
        id: ID
        book: Book
        mutation: String
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

function publishBookUpdate(mutation: string, book: IBook) {
    pubsub.publish('bookUpdated', {
        bookUpdated: {
            book,
            mutation
        }
    });
}

export default {
    resolvers: {
        Query: {
            bookList: () => mockBooks,
            bookFindById: (root, {id}) => mockBooks.find(b => b.id === id),
            bookListByWriterId: (root, {id}) => mockBooks.filter(b => b.writerId === id),
        },
        Mutation: {
            bookCreate: (root, {input}) => {
                const newBook = createNewBook(input);
                pubsub.publish('bookCreated', {
                    bookCreated: newBook
                });
                return newBook;
            },
            bookRedescribe: (root, {input: {id, description}}) => {
                const mutableBook = mockBooks.find(book => id === book.id);
                mutableBook.description = description;
                publishBookUpdate('bookRedescribe', mutableBook);
                return mutableBook;
            },
            bookVote: (root, {input: {id, score}}) => {
                const bookToVoteFor = mockBooks.find(book => id === book.id);
                const newVotes = bookToVoteFor.votes + 1;
                const newScore = ((bookToVoteFor.score * bookToVoteFor.votes) + score) / newVotes;

                bookToVoteFor.score = newScore;
                bookToVoteFor.votes = newVotes;

                publishBookUpdate('bookVote', bookToVoteFor);
                return bookToVoteFor;
            },
        },
        Subscription: {
            bookUpdated: {
                subscribe: withFilter(
                    () => pubsub.asyncIterator('bookUpdated'),
                    (payload, update) => {
                        const {bookUpdated: {book}} = payload;
                        return book.id === update.bookId;
                    }
                )
            },
            bookCreated: {
                subscribe: () => pubsub.asyncIterator('bookCreated')
            }
        },
        Book: {
            writer: book => mockWriters.find(({id}) => id === book.writerId)
        }
    },
    typeDefs: [typeDefs]
};

