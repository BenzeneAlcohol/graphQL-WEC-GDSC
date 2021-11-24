const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const connectDB = require('./config/mongoose');
const GQLSchema = require('./graphQL/schema/index')
const GQLResolver = require('./graphQL/resolvers/index')

connectDB();

const app = express();

app.get('/', (req,res)=>{
    res.send("Hello");
})

app.use('/grahql', graphqlHTTP({
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

