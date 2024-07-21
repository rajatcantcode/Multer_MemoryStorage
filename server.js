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

const sharp = require("sharp");

app.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res.send("File not Found 😅");
  }

  let newBuffer = req.file.buffer;

  try {
    // If file's buffer size is greater than 1MB, resize the image
    if (req.file.size > 1024 * 1024) {
      newBuffer = await sharp(req.file.buffer)
        .resize({
          width: 1000,
        })
        .toBuffer();
    }

    //Converting Size from Bytes to Megabytes
    console.log(
      `Original File size: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB`
    );

    //Buffer.byteLength - Buffer Length , then converts the bytes to Megabytes
    console.log(
      `New File size: ${(Buffer.byteLength(newBuffer) / (1024 * 1024)).toFixed(
        2
      )} MB`
    );

    const user = await userModel.create({
      name: "Simba",
      image: newBuffer,
    });

    res.send("File uploaded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing the file");
  }
});

app.get("/show", async (req, res) => {
  let allImages = await userModel.find();
  res.render("show", { allImages });
});
