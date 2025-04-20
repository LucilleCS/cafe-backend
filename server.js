const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
const multer = require("multer");

// Serve static files from the public folder
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://LucilleCS:password720360@cafedata.r5zimi1.mongodb.net/cafeDB"
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const schema = new mongoose.Schema({
  name: String,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/api/cats", upload.single("img"), (req, res) => {
  console.log("got data. inputing it in");
  const result = validateCat(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const cat = {
    _id: cats.length,
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    personality: req.body.personality,
    favorite_activity: req.body.activity,
  };

  if (req.file) {
    cat.img_name = "./public/images/" + req.file.filename;
  }

  cats.push(cat);
  res.status(200).send(cat);
});

const cats = [
  {
    _id: 1,
    name: "Oscar",
    age: "3 years old",
    gender: "Male",
    personality:
      "Oscar prefers a quiet afternoon, likes sleeping beside other cats, and enjoys squeezing into small areas. He warms up easily to repeat customers.",
    favorite_activity: "Hiding in cat huts and curling up with other cats.",
    img_name: "images/oscar.jpg",
  },
  {
    _id: 2,
    name: "Dusty",
    age: "1 year old",
    gender: "Female",
    personality:
      "Dusty is funny, adorable, and loves to sit near people. She might occasionally climb onto the table and has a tail that dusts the furniture.",
    favorite_activity: "Purring and sitting next to children or other cats.",
    img_name: "images/dusty.jpg",
  },
  {
    _id: 3,
    name: "Milo",
    age: "Few months old",
    gender: "Male",
    personality:
      "Milo is energetic, sometimes lazy, and enjoys bothering other cats, especially Oscar. He loves to play with shoes and toys.",
    favorite_activity:
      "Running around the cafe and playing with toys or shoelaces.",
    img_name: "images/milo.jpg",
  },
  {
    _id: 4,
    name: "Morgana",
    age: "6 years old",
    gender: "Female",
    personality:
      "Morgana is a lap kitty who enjoys chin scratches and belly rubs. She’s a bit of a snack beggar with her baby doll eyes.",
    favorite_activity: "Sitting on laps and getting pampered.",
    img_name: "images/morgana.jpg",
  },
  {
    _id: 5,
    name: "Worm",
    age: "4 years old",
    gender: "Male",
    personality:
      "Worm is small and loves sitting on bookshelves. He enjoys staring at customers and observing everything happening around the cafe.",
    favorite_activity: "People watching from the bookshelf.",
    img_name: "images/worm.jpg",
  },
  {
    _id: 6,
    name: "Soot",
    age: "Unknown",
    gender: "Male",
    personality:
      "Soot is a charming black cat with a soft fur coat. Shy at first, but once he trusts you, he loves cuddling and playing with toys.",
    favorite_activity: "Lounging in the sun and chasing toys.",
    img_name: "images/soot.jpg",
  },
];

app.get("/api/cats", (req, res) => {
  res.send(cats);
});

const validateCat = (cat) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.string().required(),
    gender: Joi.string().required(),
    personality: Joi.string().required(),
    activity: Joi.string().required(),
    img: Joi.string().optional(),
  });

  return schema.validate(cat);
};

app.listen(3001, () => {
  console.log("I'm listening");
});
