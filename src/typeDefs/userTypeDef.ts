const userTypeDefs = `
    type User {
        username: String!
        password: String!
    }
    type UserWithoutPassword {
        username: String!
    }
    type UserWithToken {
        username: String!
        token: String!
    }
    extend type Query {
        users: [User!]!
    }
    extend type Mutation {
        register(username: String!, password: String!): UserWithoutPassword!
        login(username: String!, password: String!): UserWithToken!
    }
`;

export default userTypeDefs;
