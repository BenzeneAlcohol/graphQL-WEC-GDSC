const bcrypt = require('bcryptjs');

const Employee = require('../../models/Employee');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');


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
    createEmployee: (args, req)=>{
        if(!req.isAuth)
        {
            throw new Error('UnAuthenticated');
        }
        const employee = new Employee({
            name: args.employeeInput.name,
            age: args.employeeInput.age,
            salary: args.employeeInput.salary,
            experience: args.employeeInput.experience,
            employer: req.userID
        });
        return employee.save().then(result =>{
            createdEmployee = {...result._doc, _id:result._doc._id.toString()};
            return User.findById(req.userID);
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
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("User doesn't exist");
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            throw new Error('Password is incorrect');
        }
        const token = jwt.sign({userID: user.id, email: user.email}, 'GTNnO0OA0dWzCUdyUGuZR7x5kPWnYTp3', {expiresIn: '3h'});
        return {userID: user.id, token: token, tokenExpiry:3}
    },
    deleteEmployee: async (args) => {
        try{
            const employee = await Employee.findById(args.employeeID).populate('employer');
            const user = await User.findById(employee.employer._id);
            for( var i = 0; i < user.createdEmployees.length; i++){ 
                if ( user.createdEmployees[i].toString() === employee._id.toString()) { 
                    user.createdEmployees.splice(i, 1);
                }
            }
            await Employee.deleteOne({_id:args.employeeID});
            const result = await user.save();
            return {message: "Deletion successful"};
        }catch(err)
        {
            throw err;
        }
    },
    specificEmployee: async (args) => {
        try {
            console.log(args.name);
            const newEmployee = await Employee.findOne({name: args.name});
            console.log({...newEmployee._doc});
            if(!newEmployee){
                throw new Error("User doesn't exist");
            }
            return {...newEmployee._doc};
        } catch (error) {
            throw error;
        }
    }
}