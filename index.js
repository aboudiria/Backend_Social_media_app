const express=require("express");
const DB=require("./database");

DB();
const app=express();

app.use(express.json());
app.listen(process.env.PORT,()=>{

     console.log("server is running on port 3000");


})
