const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const connectDB = require('./config/mongoose');

const Employee = require('./models/Employee');

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

