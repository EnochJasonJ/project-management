import { supabase } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const {data,error} = await supabase.from("users")
        .insert([{name,email,password: hashedPassword}])
        .select("id, name, email")
        .single();
        if(error){
            return res.status(500).json({error: error.message});
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;

        if(!email) return res.status(400).json({error: "Email is required"});
        if(!password) return res.status(400).json({error: "Password is required"});

        const {data: users, error} = await supabase.from("users")
        .select("*")
        .eq("email", email)
        .limit(1);

        if(error){
            return res.status(500).json({error: error.message});
        }

        if(!users ||  users.length===0){ 
            return res.status(400).json({error: "Invalid credentials"});
        }

        const dbUser = users[0];
        const userId = dbUser.id;
        const userName = dbUser.name;
        const emailId = dbUser.email;
        
        const validPassword = await bcrypt.compare(password,dbUser.password);
        if(!validPassword) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign(
            {id: dbUser.id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.json({token,userName,emailId,userId});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}




