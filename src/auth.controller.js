import jwt from "jsonwebtoken"
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs"


dotenv.config({path:'./.env'});

export const authenticate =  async (req,res)=>{

    //authentication
    const {email, password} = req.body;
      
    const userApiResponse = await fetch(`http://localhost:3020/api/user`,{
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

    const passwordMatch = bcrypt.compareSync(password, user.password);
    
    if(!passwordMatch) return res.json({success:0, message:"password does not match"})

    // token 
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);


    return res.json({
        success:1, 
        msg:"login success",
        user:{
            id:user.id,
            email:user.email,
            firstName: user.firstName,
            lastName: user.lastName
        },
        accessToken
    });

}

export const register = async(req, res)=>{

    const {firstName, lastName, email, password} = req.body;

    try{
        const userApiResponse = await fetch(`http://localhost:3020/api/user`,{
            method:"POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body:JSON.stringify({
                firstName,
                lastName,
                email,
                password: bcrypt.hashSync(password, 10)
            })
        });
    
        if(!userApiResponse.ok)
            throw new Error("user service not responding");


        const userData = await userApiResponse.json();

        if(!userData.success)
            throw new Error(userData.msg);
               
        return res.json({success:1, msg:"user registered successfully"});
    
    }catch(e){
        return res.json({success:0, msg:e.message})
    }


}