const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Employee{
    _id: ID!
    name: String!
    age: String!
    salary: String!
    experience: String!
    employer: User!
}

type User{
    _id: ID!
    email: String!
    password: String
    createdEmployees: [Employee!]
}

type authData{
    userID: ID!
    token: String!
    tokenExpiry: Int!
}

input UserInput{
    email: String!,
    password: String,
}

input EmployeeInput{
    name: String!
    age: String!
    salary: String!
    experience: String!
}

type RootQuery {
    employees: [Employee!]!
    login(email: String!, password: String!): authData
}

type RootMutation {
    createEmployee(employeeInput: EmployeeInput): Employee
    createUser(userInput: UserInput): User
}


schema {
    query: RootQuery
    mutation: RootMutation
}
`)