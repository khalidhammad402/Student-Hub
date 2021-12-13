const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var i = [true, false];

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/signup", function(req, res) {
    res.render("signup");
});

app.post("/signup", function(req, res) {
    res.render("signup");
});

app.get("/signin", function(req, res) {
    res.render("signin");
});

app.post("/signin", function(req, res) {
    res.render("signin");
});

<<<<<<< HEAD
app.get("/forum", function(req, res) {
    res.render("forum")
})
=======
// $(".login").on("click", function() {
//     $("#signup_form").addClass("hidden");
// });
>>>>>>> 0a6b1265c2871f0ceb525a8b3f3f2d9b9f13afab

app.listen(3000, function() {
    console.log("Server started on port 3000")
});
