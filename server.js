const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(
    "mongodb+srv://LucilleCS:password720360@cafedata.r5zimi1.mongodb.net/cafeDB"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Couldn't connect to MongoDB", err));

const catSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  personality: String,
  favorite_activity: String,
  img_name: String,
});

const Cat = mongoose.model("Cat", catSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/cats", async (req, res) => {
  const cats = await Cat.find();
  console.log(cats);
  res.send(cats);
});

app.get("/api/cats/:id", async (req, res) => {
  const cat = await Cat.findById(req.params.id);
  if (!cat) return res.status(404).send("Cat not found");
  res.send(cat);
});

app.post("/api/cats", upload.single("img_name"), async (req, res) => {
  const result = validateCat(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const cat = new Cat({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    personality: req.body.personality,
    favorite_activity: req.body.activity,
    img_name: req.file ? "images/" + req.file.filename : null,
  });

  const newCat = await cat.save();
  res.status(200).send(newCat);
});

app.put("/api/cats/:id", upload.single("img_name"), async (req, res) => {
  const result = validateCat(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const updatedFields = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    personality: req.body.personality,
    favorite_activity: req.body.activity,
  };

  if (req.file) {
    updatedFields.img_name = "images/" + req.file.filename;
  }

  const cat = await Cat.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
  });

  if (!cat) return res.status(404).send("Cat not found");
  res.status(200).send(cat);
});

app.delete("/api/cats/:id", async (req, res) => {
  const cat = await Cat.findByIdAndDelete(req.params.id);

  if (!cat) return res.status(404).send("Cat not found");
  res.status(200).send(cat);
});

function validateCat(cat) {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.string().required(),
    gender: Joi.string().required(),
    personality: Joi.string().required(),
    activity: Joi.string().required(),
  });

  return schema.validate(cat);
}

app.listen(3001, () => {
  console.log("I'm listening on port 3001");
});
