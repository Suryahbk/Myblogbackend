const router = require("express").Router();
const User= require("../models/User");
const Post= require("../models/Post");
const bcrypt = require("bcrypt");

//Update
router.post("/:id",async (req,res)=>{
    if(req.body.userId === req.params.id){  //if the requested userid and req parameters id are same 
            const salt = await bcrypt.genSalt(10); // first of all we r hashing thep password.
            req.body.password = await bcrypt.hash(req.body.password,salt)
       try{   
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{ // inorder to update the user we use findbyidandupdate method from User schema
                $set :req.body
            },{new:true}); //its the updated version of user.
            res.status(200).json(updatedUser)
        }catch(err){
            res.status(500).json(err);
            console.log(err)
        }
    }
else{
    res.status(401).json("You can update only your account!")
}
});

//GET USER
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id); //we get user by findbyid method from User schema for requested parameters userid.
      const { password, ...others } = user._doc; //when we get user v should not c password.
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports= router