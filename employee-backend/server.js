const express = require("express"); // calling express framework
const app = express();              // creating object of express
const cors = require("cors");       // calling cors origin library to allow data communication between 2 server
app.use(cors());                    // creating object of cors library
app.use(express.json());            // injecting the json to handle json data communication

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/internship")
const db = mongoose.connection;

db.on("error", (error)=>console.log("Error in database connection"));
db.on("open", ()=>console.log("Database is Connected..."));

const MyLogin = require("./loginapi");
app.use("/t_login", MyLogin);

const Employee = require("./employee-api");
app.use("/t_Employee", Employee);

app.use("/uploads", express.static("uploads"));


app.listen(2222,function(){
    console.log("The Server is Live... on : http://localhost:2222/t_login");
    console.log("The Server is Live... on : http://localhost:2222/t_Employee");
})