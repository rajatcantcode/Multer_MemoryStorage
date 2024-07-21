const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const path = require("path");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route for the homepage
app.get("/", (req, res) => {
  res.render("index", { title: "Hello, EJS!" });
});

const connectDB = require("./db/mongoose-connection");

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection FAILED ", err);
  });

const userModel = require("./model/user.models");
const upload = require("./middlewares/multer.middleware");
app.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file);

  const user = await userModel.create({
    name: "Simba",
    image: req.file.buffer,
  });

  res.send("File uploaded successfully");
});

app.get("/show", async (req, res) => {
  let allImages = await userModel.find();
  res.render("show", { allImages });
});
