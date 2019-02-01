import {mockBooks, mockWriters, createNewBook} from 'src/mocks';
import gql from 'graphql-tag';
import {withFilter, pubsub} from 'src/graphql/subscriptionManager';
import {authenticateContext} from 'src/auth/auth';

const typeDefs = gql`
    extend type Query {
        " list all books "
        bookList: [Book]
        " find a book by id "
        bookFindById(id: ID!): Book
        " find books by writer id "
        bookListByWriterId(writerId: ID!): [Book]
    }

    extend type Mutation {
        " create a new book "
        bookCreate(input: BookCreateInput!): Book
        " change book description "
        bookRedescribe(input: BookRedescribeInput!): Book
        " vote book "
        bookVote(input: BookVoteInput!): Book
    }

    extend type Subscription {
        " called whenever mutation is applied to an existing book "
        bookUpdated(bookId: ID!): BookUpdateSubscription
        " called when a new book is added "
        bookCreated: Book
    }

    " The return value for book updates "
    type BookUpdateSubscription {
        id: ID
        book: Book
        " the type of mutation that happend to the book "
        mutation: String
    }

    " used for redescribing a book by mutation "
    input BookVoteInput {
        id: ID!
        score: ScalarValidStarsVote!
    }

    " used for redescribing a book by mutation "
    input BookRedescribeInput {
        id: ID!
        description: String!
    }

    " used for creating a new book by mutation "
    input BookCreateInput {
        name: String!
        " The id of the writer who wrote the book "
        writerId: ID!
        description: String
    }

    " a book definition "
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

// publish that a book was updated
function publishBookUpdate(mutation: string, book: GQL.Book) {
    pubsub.publish('bookUpdated', {
        bookUpdated: {
            book,
            mutation
        }
    });
}

// publish that a book was created
function publishBookCreated(book: GQL.Book) {
    pubsub.publish('bookCreated', {
        bookCreated: book
    });
}

export default {
    resolvers: {
        Query: {
            // get the list of books
            bookList: (root, args, context) => {
                authenticateContext(context);
                return mockBooks;
            },
            // find a book by it's id
            bookFindById: (root, {id}: GQL.QueryToBookFindByIdArgs, context) => {
                authenticateContext(context);
                return mockBooks.find(b => b.id === id);
            },
            // find books by a writer id
            bookListByWriterId: (root, {writerId}: GQL.QueryToBookListByWriterIdArgs, context) => {
                authenticateContext(context);
                return mockBooks.filter(b => b.writerId === writerId);
            },
        },
        Mutation: {
            // create a book
            bookCreate: (root, {input}: GQL.MutationToBookCreateArgs, context) => {
                authenticateContext(context);
                const bookWriter = mockWriters.find(writer => writer.id === input.writerId);
                if (!bookWriter) {
                    throw new Error(`A writer with the id: ${bookWriter}, does not exist`);
                }
                const newBook = createNewBook(input);
                publishBookCreated(newBook);
                return newBook;
            },
            // change the description for a book
            bookRedescribe: (root, {input}: GQL.MutationToBookRedescribeArgs, context) => {
                authenticateContext(context);
                const {id, description} = input;
                const book = mockBooks.find(b => id === b.id);
                book.description = description;
                publishBookUpdate('bookRedescribe', book);
                return book;
            },
            // vote for a book
            bookVote: (root, {input}: GQL.MutationToBookVoteArgs, context) => {
                authenticateContext(context);
                const {id, score} = input;
                const book = mockBooks.find(b => id === b.id);
                book.votes = book.votes + 1;

                // calculate the new score
                const newScore = ((book.score * book.votes) + score) / book.votes;
                book.score = newScore;
                publishBookUpdate('bookVote', book);
                return book;
            },
        },
        Subscription: {
            // emits an event when a book is updated
            bookUpdated: {
                subscribe: withFilter(
                    (root, args, context) => {
                        authenticateContext(context);
                        return pubsub.asyncIterator('bookUpdated');
                    },
                    (
                        {bookUpdated}: { bookUpdated: GQL.BookUpdateSubscription },
                        {bookId}: GQL.SubscriptionToBookUpdatedArgs
                    ) => bookUpdated.book.id === bookId
                )
            },
            // emits an event when a book is created
            bookCreated: {
                subscribe: (root, args, context) => {
                    authenticateContext(context);
                    return pubsub.asyncIterator('bookCreated');
                }
            }
        },
        Book: {
            // a resolver to find the writer through a book
            writer: book => mockWriters.find(({id}) => id === book.writerId)
        }
    },
    typeDefs: [typeDefs]
};

