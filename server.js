const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Joi = require("joi");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "public/images")));

mongoose
  .connect(
    "mongodb+srv://LucilleCS:password720360@cafedata.r5zimi1.mongodb.net/cafeDB"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Couldn't connect to MongoDB", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const catSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  personality: String,
  favorite_activity: String,
  img: String,
});
const Cat = mongoose.model("Cat", catSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/cats", async (req, res) => {
  const cats = await Cat.find();
  res.send(cats);
});

app.get("/api/cats/:id", async (req, res) => {
  const cat = await Cat.findById(req.params.id);
  if (!cat) return res.status(404).send("Cat not found");
  res.send(cat);
});

app.post("/api/cats", upload.single("img"), async (req, res) => {
  const { error } = validateCat(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cat = new Cat({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    personality: req.body.personality,
    favorite_activity: req.body.favorite_activity,
    img: req.file ? "images/" + req.file.filename : null,
  });

  const newCat = await cat.save();
  res.status(201).send(newCat);
});

app.put("/api/cats/:id", upload.single("img"), async (req, res) => {
  const { error } = validateCat(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updatedFields = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    personality: req.body.personality,
    favorite_activity: req.body.favorite_activity,
  };

  if (req.file) {
    updatedFields.img = "images/" + req.file.filename;
  }

  const updatedCat = await Cat.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
  });
  if (!updatedCat) return res.status(404).send("Cat not found");

  res.send(updatedCat);
});

app.delete("/api/cats/:id", async (req, res) => {
  const deletedCat = await Cat.findByIdAndDelete(req.params.id);
  if (!deletedCat) return res.status(404).send("Cat not found");
  res.send(deletedCat);
});

function validateCat(cat) {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.string().required(),
    gender: Joi.string().required(),
    personality: Joi.string().required(),
    favorite_activity: Joi.string().required(),
  });
  return schema.validate(cat);
}

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
