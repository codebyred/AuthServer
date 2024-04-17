import jwt from "jsonwebtoken"
import * as dotenv from "dotenv";

dotenv.config({path:'./.env'});

export const authenticate =  async (req,res)=>{

    //authentication
    const {email, password} = req.body;
    console.log(req.body)
  
    const userApiResponse = await fetch(`http://localhost:3000/api/user`,{
        method:"GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
    });

    if(!userApiResponse.ok) 
        return res.status(500).json({msg:"could not authentiacte"});

    const userData = await userApiResponse.json();

    const user = userData.find((user)=> user.email === email);
    
    if(!user) return res.json({success:0, message:"no user found"});

    if(user.password !== password) return res.json({success:0, message:"password does not match"});

    // token 
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);


    return res.json({
        success:1, 
        msg:"welcome",
        user:{
            username:`${user.firstName} ${user.lastName}`,
            email:user.email
        },
        accessToken
    });

}

export const register = ()=>{

}