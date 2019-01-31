import gql from 'graphql-tag';

// an enum that defines countries
export default gql`
    enum CountryEnum {
        US
        BL
        MX
        CH
        UK
        RU
        IL
        NL
        JP
    }
`;
