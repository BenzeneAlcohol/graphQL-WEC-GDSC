const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const connectDB = require('./config/mongoose');
const bcrypt = require('bcryptjs');

const Employee = require('./models/Employee');
const User = require('./models/User');

connectDB();

const app = express();

app.get('/', (req,res)=>{
    res.send("Hello");
})

app.use('/grahql', graphqlHTTP({
    schema: buildSchema(`

        type Employee{
            _id: ID!,
            name: String!
            age: String!
            salary: String!
            experience: String!
        }

        type User{
            _id: ID!,
            email: String!,
            password: String,
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
    `),
    rootValue: {
        employees: ()=>{
            return Employee.find().then(employees => {
                return employees.map(employee => {
                    return {...employee._doc, _id: employee._doc._id.toString()};
                })
            }).catch(err => {
                console.log(err);
            })
        },
        createEmployee: (args)=>{
            const employee = new Employee({
                name: args.employeeInput.name,
                age: args.employeeInput.age,
                salary: args.employeeInput.salary,
                experience: args.employeeInput.experience
            });
            return employee.save().then(result =>{
                return{...result._doc};
            }).catch(err =>{
                console.log(err);
            });
        },
        createUser: (args)=>{
            return User.findOne({email: args.userInput.email}).then(user => {
                if(user){
                    throw new Error('User already exists');
                }
                return bcrypt.hash(args.userInput.password, 10)
            }).then(newPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: newPassword
                });
                return user.save();
            }).then(result => {
                return {...result._doc,password: null, _id: result.id};
            }).catch(err => {
                console.log(err);
            })
        }
    },
    graphiql: true
})

)

app.listen(3000, (err)=>{
    if(err) {
        console.log(`Error: ${err}`);
    }
    console.log(`server is up and running at port 3000`);
})

