import jwt from "jsonwebtoken"
import * as dotenv from "dotenv";

dotenv.config({path:'./.env'});

export const authenticate =  async (req,res)=>{

    //authentication
    const {email, password, role} = req.body;

    console.log("");

    let found;

    if(role === "user"){
        const res = await fetch(`http://localhost:3000/api/user/${email}`,{
            method:'GET'
        });
        const data = await res.json();
        found = data.pop();

    }

    if(role === "worker"){
        const res = await fetch(`http://localhost:3000/api/worker/${email}`,{
            method:'GET'
        });

        const data = await res.json();
        found = data.pop();
    }  
    
    if(!found) return res.json({success:0, message:"no user found"});

    if(found.password !== password) return res.json({success:0, message:"password does not match"});

    // token 
    const accessToken = jwt.sign(found, process.env.ACCESS_TOKEN_SECRET);


    return res.json({
        success:1, message:"welcome",
        user:{
            username:`${found.firstName} ${found.lastName}`,
            email:found.email
        },
        accessToken
    });

}