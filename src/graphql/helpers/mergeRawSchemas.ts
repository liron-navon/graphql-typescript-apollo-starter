import { mergeWith, isArray } from 'lodash';

// will merge typedefs into an array
function withArraysConcatination(objValue, srcValue) {
    // if have an array, concat it
    if (isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

// allows us to merge schemas
export const mergeRawSchemas = (...schemas) => {
    return mergeWith({}, ...schemas, withArraysConcatination);
};
