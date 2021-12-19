const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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

app.get("/forum", function(req, res) {
    res.render("forum")
})

app.get("/helpdesk", function(req, res) {
    res.render("helpdesk")
})

app.get("/aboutus", function(req, res) {
    res.render("aboutus")
})

app.get("/resources", function(req, res) {
    res.render("resources")
})

app.get("/internship", function(req, res) {
    res.render("internship")
})

app.listen(3000, function() {
    console.log("Server started on port 3000")
});
