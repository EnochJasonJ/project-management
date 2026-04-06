import { supabase } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        // const result = await pool.query(`
        //         INSERT INTO users(name,email,password)
        //         VALUES ($1,$2,$3)
        //         RETURNING id,name,email
        //     `,
        //     [name,email,hashedPassword]
        // );
        const {data,error} = await supabase.from("users")
        .insert([{name,email,password: hashedPassword}])
        .select("id, name, email")
        .single();
        if(error){
            console.error("registerUser error: ", error);
            return res.status(500).json({error: error.message});
        }
        res.status(201).json(data);
    } catch (error) {
        console.error("registerUser exception: ", error);
        res.status(500).json({error: error.message});
    }
};

export const loginUser = async(req,res) => {
    try {
        console.log("Trying to login");
        const {email,password} = req.body;
        // const user = await pool.query(
        //     "SELECT * FROM users where email=$1",
        //     [email]
        // );

        if(!email) console.error("Email is empty");
        if (!password) console.error("Password is empty");

        const {data: users, error} = await supabase.from("users")
        .select("*")
        .eq("email", email)
        .limit(1);

        

        if(error){
            console.error("loginUser query error: ", error);
            res.status(500).json({error: error.message});
        }

        if(!users ||  users.length===0){ 
            return res.status(400).json({error: "Invalid credentials"});}

        const dbUser = users[0];
        const userId = dbUser.id;
        const userName = dbUser.name;
        const emailId = dbUser.email
        console.log(dbUser)
        console.log(userName)
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




