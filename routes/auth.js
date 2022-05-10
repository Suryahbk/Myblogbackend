const router = require("express").Router();
const User= require("../models/User")
const bcrypt = require('bcrypt');

//REGISTER
router.post("/register",async (req,res)=>{
  try{
      const salt = await bcrypt.genSalt(10); //password is hashed with 10 rounds.
      const hashedPass = await bcrypt.hash(req.body.password,salt)
      const newUser = new User({     
          username: req.body.username, //here i am indicating my own property instead of indicating all property(req.body).
          email:req.body.email,
          password:hashedPass,
      })

      const user = await newUser.save(); //saving the new user.
      res.status(200).json(user)
  }catch(err){
      res.status(500).json(err);
  }
})
//LOGIN
router.post("/login" , async (req,res)=>{
    try{
       const user = await User.findOne({username: req.body.username}) //using model schema of User we r finding one username from db.
       if(!user){
           return res .status(400).json("Wrong Credentials!") // if there is no user response with 400.
       }
      
       const validated = await bcrypt.compare(req.body.password,user.password) // validating the password through compare method between the saved password and user entered password.
       if(!validated){
        return res.status(400).json("password wrong") // if now validated return 400 error.
    }
     const {password,...others} = user._doc;
    res.status(200).json(others);
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports= router