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