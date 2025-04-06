const express = require("express");
const cors = require("cors");
const app = express();

// Serve static files from the public folder
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Cat data with corrected image paths
const cats = [
    {
        name: "Oscar",
        age: "3 years old",
        gender: "Male",
        personality: "Oscar prefers a quiet afternoon, likes sleeping beside other cats, and enjoys squeezing into small areas. He warms up easily to repeat customers.",
        favorite_activity: "Hiding in cat huts and curling up with other cats.",
        img_name: "images/oscar.jpg"
    },
    {
        name: "Dusty",
        age: "1 year old",
        gender: "Female",
        personality: "Dusty is funny, adorable, and loves to sit near people. She might occasionally climb onto the table and has a tail that dusts the furniture.",
        favorite_activity: "Purring and sitting next to children or other cats.",
        img_name: "images/dusty.jpg"
    },
    {
        name: "Milo",
        age: "Few months old",
        gender: "Male",
        personality: "Milo is energetic, sometimes lazy, and enjoys bothering other cats, especially Oscar. He loves to play with shoes and toys.",
        favorite_activity: "Running around the cafe and playing with toys or shoelaces.",
        img_name: "images/milo.jpg"
    },
    {
        name: "Morgana",
        age: "6 years old",
        gender: "Female",
        personality: "Morgana is a lap kitty who enjoys chin scratches and belly rubs. She’s a bit of a snack beggar with her baby doll eyes.",
        favorite_activity: "Sitting on laps and getting pampered.",
        img_name: "images/morgana.jpg"
    },
    {
        name: "Worm",
        age: "4 years old",
        gender: "Male",
        personality: "Worm is small and loves sitting on bookshelves. He enjoys staring at customers and observing everything happening around the cafe.",
        favorite_activity: "People watching from the bookshelf.",
        img_name: "images/worm.jpg"
    },
    {
        name: "Soot",
        age: "Unknown",
        gender: "Male",
        personality: "Soot is a charming black cat with a soft fur coat. Shy at first, but once he trusts you, he loves cuddling and playing with toys.",
        favorite_activity: "Lounging in the sun and chasing toys.",
        img_name: "images/soot.jpg"
    }
];


app.get("/api/cats", (req, res) => {
    res.send(cats);
});

app.listen(3001, ()=>{
    console.log("I'm listening");
});