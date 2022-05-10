const router = require("express").Router();
const User= require("../models/User");
const Post= require("../models/Post");


//CREATE POST
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body); // when requested body wants to create a newpost  we create it.
    try{
       const savedPost = await  newPost.save(); // we save the newPost created.
       res.status(200).json(savedPost)
    }catch(err){

    }
});


//UPDATE POST
router.put("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id); //firstly, we use findbyid method for finding the Post using schema as requested by user parameters id.
       if(post.username === req.body.username){  //if post username === requested body username are same then,
         try{
              const updatedPost = await Post.findByIdAndUpdate(req.params.id,{ // it set to updatedpost and uses findbyidandupdate method for finding and updating the post using schema through requested by user parameters id. 
                  $set:req.body
              },{new:true}); //its the updated version of user.
              res.status(200).json(updatedPost);
        }catch(err){
            res.status(500).json(err)
        } 
    } else{
        res.status(401).json("You can update only your post!") //if post username !== requested body username.
    }
    }catch(err){
        res.status(500).json(err)
    }
});

//DELETE POST
router.delete("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id); //firstly, we use findbyid method for finding the Post using schema as requested by user parameters id.
       if(post.username === req.body.username){ //if post username === requested body username are same then,
         try{
            await post.delete();  // using delete method we delete the post using schema.
            res.status(200).json("Post has been deleted...");
        }catch(err){
            res.status(500).json(err)
        } 
    } else{
        res.status(401).json("You can delete only your post!") //if post username !== requested body username.
    }
    }catch(err){
        res.status(500).json(err)
    }
});

//GET POST
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id); //firstly, we use findbyid method for finding the Post using schema as requested by user parameters id.
      
      res.status(200).json(post); //success.
    } catch (err) {
      res.status(500).json(err); // failure.
    }
  });

//GET ALL POSTS
router.get("/", async (req, res) => {
      const username= req.query.user; 
      const catName= req.query.cat;
      try{
          let posts;
     if(username){
         posts = await Post.find({username:username})
     }
     else if(catName){
        posts = await Post.find({categores:{
            $in:[catName] // we use inmethod to find the catgoryname(catName). 
        }})
    }else{
        posts = await Post.find();
    }
    res.status(200).json(posts)
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports= router