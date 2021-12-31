
# CRUD API

#### Create a simple CRUD app to manage employees in a organization. The app should allow an employer to create, read, update and delete any employee datails. Bonus points if GraphQL is used for the communication between the frontend and the backend.



In this project, I have used graphQL with node.js (express framework), to create a CRUD API with Authentication.


## Features implemented



## Run Locally

Clone the project

```bash
  git clone https://github.com/BenzeneAlcohol/graphQL-WEC-GDSC.git
```

Go to the project directory

```bash
  cd graphQL-WEC-GDSC
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  nodemon index.js
```


## Tech stacks used

To implement the server, node.js was used, with express as the framework. Since we had to use graphQL to establish the connection between server and client, `express-graphql` package was also used.

Since graphQL in node comes with a pre built GUI to test all the APIs, I did not create a specific frontend in React for it. However, my plan was to create one in the beginning.
## Features Implemented

1. CRUD: The most basic feature that was implemented in this project was just CRUD for employees. This whole project is about employers managing employees. 
Employers can Create, Read, Update and Delete any Employee **that they have created**.

2. Authentication: The most important functionality to any API is Authentication. We cannot just let anyone edit, erase or create new records. 

\
To implement authentication, I used JWT token (json web token). Once a login request is sent to the server, the server returns a token back. This token should be sent through the request headers, in the form of Authorization headers, with the format: `Bearer $Token`.

3. 2-way Relationship: In this API, there are basically two models -> Employee and Employer. An employer (also referred to as "User"), is able to make as many employees as he wants. However, he can **edit/delete the data of only his OWN employees (ie., those that he created)** We cannot let any employer manage employees. Only the employer linked to an employee should be able to Update and Delete those specific records.
\
So, to implement this, I made a two way relationship between Employee and Employer, and managed them through this.

4. Since graphQL is implemented, you can get any data of the employee, like a combination of 2 out of 4 datas, etc. If we do not use graphQL, it would take a lot of different routes, or complicated Regex expressions to match the requests.


## API Reference

**Every Field is a string. Age, Salary are not of Integer type, but are of String type.**

### Queries

#### Get all Employees

```http
  query: employee
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `age, salary, experience, name` | `string` | Gives the list of all employees with the given data |

#### Login

```http
  query: login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| email      | `string` | Enter the email of the user |
| password      | `string` | Enter the password of the user |

This query gives back a token, tokenExpiry, and email, any of which can be selected. 
\
Token is required for authentication purposes.

#### Get Specific Employee

```http
  query: specificEmployee
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| name, age, salary, experience      | `string` | Enter the paramters of the users to be found |

You can enter any number of paramters, it will match the employees satisfying *all* the paramters and return an array of employees.

\
Suppose I enter just the name, it will return an employee array with all the employees whose name is what I have entered in the query. If I add age to the query, it will return employees matching both name and age.

### Mutations

#### Create Employee

```http
  mutation: createEmployee
```

**Requires Authentication of the form: `Bearer ${JWT Token}`, which must be sent in request headers (Authorization)**

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| name, age, salary, experience      | `string` | Enter the paramters of the employee to be created |

You have to enter every parameter.


#### Update Employee

```http
  mutation: updateEmployee
```

**Requires Authentication of the form: `Bearer ${JWT Token}`, which must be sent in request headers (Authorization)**

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| name, age, salary, experience, EmployeeID     | `string` | Enter the paramters of the employee to be Updated |

Employee ID is compulsory, however the rest of the fields can be filled as per choice. Suppose the user wants to update just the age, then they can give the age and employeeID, which will update just the age. Giving any number of paramters is fine

**However, only the user who has created the employee can update the employee.**

#### Delete Employee

```http
  mutation: deleteEmployee
```

**Requires Authentication of the form: `Bearer ${JWT Token}`, which must be sent in request headers (Authorization)**

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| EmployeeID     | `string` | Enter the ObjectID of the employee to be deleted |

Employee ID is compulsory to delete the Employee.

**Only the user who has created the employee can delete the employee.**

#### Create User

```http
  mutation: createUser
```


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| email, password     | `string` | Enter the paramters of the user to be created |

Both the paramteres are necessary.

## Example Queries

Query:
` query{
  employees{
    age
  }
} `

Output: 
`{
  "data": {
    "employees": [
      {
        "age": "40"
      },
      {
        "age": "1231"
      },
      {
        "age": "400"
      }
    ]
  }
}`

Query: `query{
  login(email: "xd@xd.com", password: "test123"){
    token
    tokenExpiry
  }
}`

Output: `{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MWE5MGI4OWNkMDU2NjUwNjhmNmQ4MzEiLCJlbWFpbCI6InhkQHhkLmNvbSIsImlhdCI6MTYzODUyMzQ0NCwiZXhwIjoxNjM4NTM0MjQ0fQ.A97VXwRwg-vnL5HdSxetZoWQft9ziqx3FwI1bIPIaXY",
      "tokenExpiry": 3
    }
  }
}`

Now, using this token as the Request Header for our next Mutation, we can try out the createEmployee, updateEmployee mutations as follows:

## Example Mutations
Request Header, sent under the Authorization Headers:

`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MWE5MGI4OWNkMDU2NjUwNjhmNmQ4MzEiLCJlbWFpbCI6InhkQHhkLmNvbSIsImlhdCI6MTYzODUyMzQ0NCwiZXhwIjoxNjM4NTM0MjQ0fQ.A97VXwRwg-vnL5HdSxetZoWQft9ziqx3FwI1bIPIaXY`

Using the ModeHeader extension of google chrome,
then sending the mutation as:

`mutation{
  createEmployee(employeeInput: {experience: "123", name: "123123", age: "123", salary: "111"}){
    name,
    salary
  }
}`

Output:
`{
  "data": {
    "createEmployee": {
      "name": "123123",
      "salary": "111"
    }
  }
}`

**If we do not sent the token as header, this will be the response:**

`{
  "errors": [
    {
      "message": "UnAuthenticated",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "createEmployee"
      ]
    }
  ],
  "data": {
    "createEmployee": null
  }
}`

## Acknowledgements

 - [Documentation](https://graphql.org/graphql-js/running-an-express-graphql-server/)
 - [Academind Channel](https://www.youtube.com/playlist?list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_) - Referred for getting an intuitive idea about graphQL











