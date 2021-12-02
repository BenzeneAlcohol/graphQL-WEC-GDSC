const bcrypt = require('bcryptjs');

const Employee = require('../../models/Employee');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');


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
    deleteEmployee: async (args, req) => {
        try{
            if(!req.isAuth)
            {
                throw new Error('UnAuthenticated');
            }
            let deleted = 0;
            const employee = await Employee.findById(args.employeeID).populate('employer');
            const user = await User.findById(employee.employer._id);
            if(!(req.userID.toString()===employee.employer._id.toString())){
                return ("You did not create the employee, hence you can't delete the employee");
            }
            for( var i = 0; i < user.createdEmployees.length; i++){
                if ( user.createdEmployees[i].toString() === employee._id.toString()) 
                {
                    user.createdEmployees.splice(i, 1);
                    await Employee.deleteOne({_id:args.employeeID});
                    const result = await user.save();
                    return ("Deletion successful");
                }
            }
        }catch(err)
        {
            throw err;
        }
    },
    specificEmployee: async (args) => {
        try {
            return Employee.find(args).populate('employer').then(employees => {
                return employees.map(employee => {
                    return {...employee._doc, _id: employee._doc._id.toString()};
                })
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            throw error;
        }
    },
    updateEmployee: async (args, req) => {
        try{
            if(!req.isAuth)
            {
                throw new Error('UnAuthenticated');
            }
            const employee = await Employee.findById(args.employeeID).populate('employer');
            const user = await User.findById(employee.employer._id);
            if(!(req.userID.toString()===employee.employer._id.toString())){
                return ("You did not create the employee, hence you can't Update the employee");
            }
            await Employee.findByIdAndUpdate(args.employeeID, args)
            return ("Employee Updated Successfully");
        }catch(err)
        {
            throw err;
        }
    }
}
