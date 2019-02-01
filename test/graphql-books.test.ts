import compiledSchema from 'src/graphql/schema';
import {cloneDeep} from 'lodash';
import {graphql} from 'graphql';
import {addMockFunctionsToSchema, makeExecutableSchema} from 'graphql-tools';

// create a mocked schema for the tests
const schema = makeExecutableSchema(compiledSchema);
addMockFunctionsToSchema({schema});

describe('Booking Schema', () => {
    test('booksList query should work', () => {
        const query = `
            {
                books: bookList {
                    id
                }
            }
        `;

        return graphql(schema, query).then((result) => {
            const bookId = result.data.books[0].id;
            expect(bookId.length).toBe(36); // a valid uuid
        });
    });

    test('bookFindById query should work', () => {
        const query = `
            {
                book: bookFindById(id: "${'book-0'}") {
                    name
                }
            }
        `;

        return graphql(schema, query).then((result) => {
            const bookName = result.data.book.name;
            expect(bookName).toBe('Hello World');
        });
    });
});
