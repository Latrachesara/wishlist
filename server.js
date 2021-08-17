const cookieParser = require("cookie-parser");
const express = require('express');
const dotenv = require("dotenv")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./graphql/schema")
const { connectDB } = require("./dataBase/config");
const app = express();
connectDB();
dotenv.config();
const {authentificate} = require ("./middleware/auth")
//app.use(authenticate);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ msg: "Welcome! Go to /graphql" });
});

app.use("/graphql", (req, res) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: { req, res }
  })(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`App running on PORT ${process.env.PORT}`);
});
