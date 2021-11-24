const bcrypt = require('bcryptjs');

const Employee = require('../../models/Employee');
const User = require('../../models/User');


const findEmployees = employeeID => {
    return Employee.find({_id: {$in: employeeID}}).then(employyes => {
        return employyes.map(employye => {
            return {...employye._doc,
                employer: findUser.bind(this, employye.employer)}
        })
    }).catch(err => {
        throw err;
    })
}

const findUser = UserID => {
    return User.findById(UserID).then(user => {
        return {...user._doc, _id: user._id, createdEmployees:findEmployees.bind(this, user._doc.createdEmployees) };
    }).catch(err => {
        throw err;
    })
}

module.exports = {
    employees: ()=>{
        return Employee.find().populate('employer').then(employees => {
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
            experience: args.employeeInput.experience,
            employer: '619dd51d2b7c03e5204a208b'
        });
        return employee.save().then(result =>{
            createdEmployee = {...result._doc, _id:result._doc._id.toString()};
            return User.findById('619dd51d2b7c03e5204a208b');
        }).then(user => {
            user.createdEmployees.push(employee)
            return user.save();
        }).then(result => {
            return createdEmployee;
        })
        .catch(err =>{
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
}