const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/Users");
const postRoute = require("./routes/Post");
const catRoute = require("./routes/Categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
// app.use(express.static(path.join(__dirname, "E:\blog\blog_post\build")));
app.use(express.static(path.join(__dirname, "../blog/blog_post/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../blog/blog_post/build/index.html"));
});

const port = process.env.PORT;
mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })

  .then(console.log("server is created"))
  .catch((err) => {
    console.log(err);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file has been uploadeed");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/cat", catRoute);

app.listen(port, () => {
  console.log("backend is running");
});
