# Graphql typescript apollo starter

A starter template for developing a graphql server, can also be used as a mock server simulating a book rating site, similar to goodreads. It uses typescript and express, and it uses jest as a testing framework.
It's configured with prisma playground, and subscriptions support.

This project follows the ideas, defined in the article from apollo regarding schema modularization [Modularizing your GraphQL schema code](https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2)

This project uses the wonderful `nps` script manager, you can read more about it [here](https://github.com/kentcdodds/nps/issues) and download it with `npm install -g nps`

Since I'm sharding the entire project to chunks of typedefs with the gql tag, you can see the full schema in src/__typedefs/schema.graphql

### Getting started

- Run in development mode with hot reloading `nps dev`

- Build `nps build`

- Test `nps test`

- Test and watch `nps test.watch`

- Generate types and schemas `nps generateDefs`. do this after changes to the api to keep the types in sync.

### Project structure:
       .graphqlconfig - configuration for the graphql cli tool
       package-scripts.js - this is where all the nps scripts are
       
       test/ 
       src/ - |
             | - index.ts
             | - mocks.ts: mock data, replace it with a database layer for most production apps
             | - __typedefs/ - containes type definitions and graphql schema
             | - graphql/ - |
                            | - enums/: different enums should go here
                            | - scalarTypes/: used for validation and mutating input/output
                            | - schemaShards/: your resolvers and typeDefs should go here
                            | - helpers/: includes helper functions for manipulating and merging schemas 
                            | - schema.ts: this file merges all the different graphql parts and export an executable schema

### Api
The graphql api is self documented, you can access the documentations through the prisma playground after running the server, or by going through the typescript or full graphql schema in src/__typedefs.


### Example usage
Let's see an example, you can run the development server using `nps dev`, and go to [http://localhost:3000/graphql](http://localhost:3000/graphql) (or change port with the PORT environment variable) to use the playground.
In the playground you can subscribe to the `writerCreated` subscription like this in one tab:

```graphql
subscription{
  writerCreated{
    name
    id
    birthDay
    country
  }
}
```

And create new books like this on another:

```graphql
mutation createWriter($input:WriterCreateInput!) {
  writerCreate(input:$input) {
    name
    id
  }
}
```

with this input.
```json
{
  "input": {
    "name": "liron navon",
    "birthDay": "02/02/1994",
    "country": "IL"
  }
}
```
