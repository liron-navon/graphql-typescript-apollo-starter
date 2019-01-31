/**
 * This file merges all of the schemas that belong to different parts of the shards
 */
import book from 'src/graphql/schemaShards/book';
import writer from 'src/graphql/schemaShards/writer';
import { mergeRawSchemas } from 'src/graphql/helpers/mergeRawSchemas';

export default mergeRawSchemas(
    writer,
    book
);
