import express, {Request, Response, NextFunction} from 'express';
import {v4 as uuidv4} from 'uuid'
import { UserInstance } from '../models/user';
import { registerSchema,options,loginSchema,generateToken, updateSchema} from '../utils/utils';
var router = express.Router();
import bcrypt from 'bcryptjs'

/* GET users listing. */
export async function signupUser (req: Request, res: Response, next: NextFunction) {

    const id = uuidv4()
    try{ 
        const validationResult = registerSchema.validate(req.body,options)
        const duplicatEmail = await UserInstance.findOne({where:{email:req.body.email}})
        if(duplicatEmail){
         return res.status(409).json({
            msg:"Email is used, please change email"
         })  
        }

        const username = await UserInstance.findOne({where:{username:req.body.username}})

        if(username){
         return res.status(409).json({
            msg:"username  is used"
         })
        }
        
       const passwordHash = await bcrypt.hash(req.body.password,8)
       const record = await UserInstance.create({ 
          id:id,
          username:req.body.username,
          fullname:req.body.fullname,
          email:req.body.email,
          password:passwordHash,
          phone:req.body.phone,
          gender:req.body.gender

        })
        
       res.status(201).json({
           msg:"You have successfully created a user",
           record
       })
    }catch(err){
        console.log(err);
        
       res.status(500).json({
        
        msg:'failed to register',
        route:'/register' 
       })
    }
 

    
};

/* GET users listing. */
export async function loginUser (req: Request, res: Response, next: NextFunction) {
    res.json({
        msg: "login user route"
    });
};

/* GET users listing. */
export async function logoutUser (req: Request, res: Response, next: NextFunction) {
    res.json({
        msg: "logout user route"
    });
};

/* GET ALL USERS users listing. */
export async function getUsers (req: Request, res: Response, next: NextFunction) {
    res.json({
        msg: "get all users route"
    });
};

/* GET SINGLE users listing. */
export async function getSingleUser (req: Request, res: Response, next: NextFunction) {
    res.json({
        msg: "get single user route"
    });
};

/* UPDATE users listing. */
export async function updateUser (req: Request, res: Response, next: NextFunction) {
    try{
        const {id} = req.params;
        const {username, fullname, email, password, phone, gender} = req.body;
        const validationResult = updateSchema.validate(req.body, options);
        if (validationResult.error){
            return res.status(400).json({Error: validationResult.error.details[0].message});
        }
        const record = await UserInstance.findOne({where: {id}});
        if(!record){
            return res.status(404).json({error: "User not found"})
        }
        const updateRecord = await record.update({
            
            id, 
            username,
            fullname,
            email,
            password,
            phone,
            gender
        });
        res.status(200).json({
            msg: "you have successfully updated your account"
        });
    }
     catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "failed to update",
            route: "/users/api/:id",
        })
     }
}

/* DELETE users listing. */
export async function deleteUser (req: Request, res: Response, next: NextFunction) {
    res.json({
        msg: "delete user route"
    });
};

