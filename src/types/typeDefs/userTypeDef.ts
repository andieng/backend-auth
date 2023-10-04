const userTypeDefs = `#graphql
    type User {
        username: String!
        password: String!
        refreshToken: String
    }
    type UserWithoutPassword {
        username: String!
    }
    type UserWithToken {
        username: String!
        accessToken: String!
    }
    type accessToken {
        accessToken: String!
    }
    extend type Query {
        users: [User!]!
    }
    extend type Mutation {
        register(username: String!, password: String!): UserWithoutPassword!
        login(username: String!, password: String!): UserWithToken!
        handleRefreshToken: accessToken!
    }
`;

export default userTypeDefs;
