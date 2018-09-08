# Graphql typescript apollo starter

A starter template for developing a graphql server, can also be used as a mock server simulating a book rating site, similar to goodreads. It uses typescript and express, and it uses jest as a testing framework.

This project follows the ideas, defined in the article from apollo regarding schema modularization [Modularizing your GraphQL schema code](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2)

### Getting started

Build `npm run build`

Start and watch `npm start`

Test `npm test`

Test and watch `npm run test:watch`

### Project structure:
        
       test/ 
       src/ - |
             | - index.ts
             | - mocks.ts: mock data, replace it with a database layer for most production apps
             | - graphql/ - |
                            | - enums/: different enums should go here
                            | - scalarTypes/: used for validation and mutating input/output
                            | - schemaShards/: your resolvers and typeDefs should go here
                            | - helpers/: includes helper functions for manipulating and merging schemas 
                            | - schema.ts: this file merges all the different graphql parts and export an executable schema
