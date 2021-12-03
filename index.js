const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const connectDB = require('./config/mongoose');
const GQLSchema = require('./graphQL/schema/index')
const GQLResolver = require('./graphQL/resolvers/index');
const isAuth = require('./middleware/authentication');

connectDB();

const app = express();

app.use(isAuth);

app.get('/', (req,res)=>{
    res.send("Welcome to GraphQL Project - Muthukumar");
})

app.use('/graphql', graphqlHTTP({
    schema: GQLSchema,
    rootValue: GQLResolver,
    graphiql: true
})

)

app.listen(3000, (err)=>{
    if(err) {
        console.log(`Error: ${err}`);
    }
    console.log(`server is up and running at port 3000`);
})

