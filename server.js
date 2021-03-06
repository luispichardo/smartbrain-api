const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/sign-in");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1", //localhost
//     port: 5432,
//     user: "postgres",
//     password: "1234",
//     database: "smart-brain",
//   },
// });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

// db
//   .select("*")
//   .from("users")
//   .then((data) => {
//     console.log(data);
//   });

app.use(express.json());
app.use(cors());

// const database = {
//   users: [
//     {
//       id: "123",
//       name: "John",
//       email: "john@gmail.com",
//       password: "cookies",
//       entries: 0,
//       joined: new Date(),
//     },
//     {
//       id: "124",
//       name: "Sally",
//       email: "sally@gmail.com",
//       password: "bananas",
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
//   login: [
//     {
//       id: "987",
//       hash: "",
//       email: "john@gmail.com",
//     },
//   ],
// };

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("unable to get users"));
});

app.post("/signin", (req, res) => signin.handleSignIn(req, res, db, bcrypt));

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));
app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

// bcrypt.hash(password, null, null, function (err, hash) {
//   console.log(hash);
// });

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}}`);
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> user 
*/
