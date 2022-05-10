const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require ("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 5000;


dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname,"/images"))) // here path is assigned to images folder.

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // it allows user to fall back to old parser if there is a bug in new parser.
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

  const storage = multer.diskStorage({
    destination:(req,file,cb)=>{        //cb(callback function) which takes care of our error.
      cb(null,"images"); //null is the first state and images is destination folder in api.
    },
    filename:(req,file,cb)=>{ // we r sending this filename to client side.
      cb(null,req.body.name); // filename vl be the name we vl be providing(req.body.name).
    }
  })

  const upload = multer({storage:storage}); // using multer we r uploading a file where 1st storage is configuration and 2nd is the place where we r storing it(line:27).
  app.post("/api/upload",upload.single("file"), (req, res)=>{ // In this we can only upload a single file.
    res.status(200).json("File has been uploaded")
  })

  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/posts", postRoute);

app.listen(process.env.PORT || 5000 ,()=>{
  console.log("Backend is running")
});
