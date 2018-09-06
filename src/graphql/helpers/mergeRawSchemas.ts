import { mergeWith, isArray } from 'lodash';

// will merge typedefs into an array
function withArraysConcatination(objValue, srcValue) {
    if (isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

export const mergeRawSchemas = (...schemas) => {
    return mergeWith({}, ...schemas, withArraysConcatination);
};
