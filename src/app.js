import express from "express";
import {authenticate} from "./login.controller.js";
import * as dotenv from "dotenv";

dotenv.config({path:'./.env'});

const app = express();
const port = process.env.PORT || 3006;


app.use(express.json());

app.post("/api/login", authenticate);

app.listen(port,(err) =>{
    if(err) console.log(`Could not establish connection on ${port}`);
    console.log(`connection is established on ${port}`);
});
