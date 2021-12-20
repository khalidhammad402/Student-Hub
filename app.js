const express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
const { urlencoded } = require("body-parser");
const User = require("./models/User");
const ejs = require("ejs");
const app = express();

let isSignedIn = false;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
    key: 'user',
    secret: 'StudentHub',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(function(req, res, next) {
    if (req.session.user && req.session.StudentHub) {
        res.render("home", {bool:isSignedIn})
    }
    next()
})

var sessionChecker = function(req, res, next) {
    if (req.session.user && req.session.StudentHub) {
        res.render("home")
    } else {
        next()
    }
}

app.get("/", sessionChecker, function(req, res) {
    res.render("home", {bool:isSignedIn});
});

app.get("/signup", sessionChecker, function(req, res) {
    res.render("signup");
});
app.post("/signup", function(req, res) {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        institute: req.body.institute,
    });

    user.save(function(err, docs) {
        if (err) {
            res.redirect("/signup");
            console.log(err);
        } else {
            console.log(docs);
            req.session.user = docs;
            res.render("signin") 
        }
    })
});

app.get("/signin", sessionChecker, function(req, res) {
    isSignedIn = false;
    res.render("signin");
});
app.post("/signin", async function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    try {
        let user = await User.findOne({username: username}).exec();
        if(!user) {
            res.redirect("signin")
        }
        user.comparePassword(password, function(error, match) {
            if (!match) {
                res.redirect("signin");
            }
        });
        req.session.user = user;
        isSignedIn = true;
        res.render("home", {bool:isSignedIn})
    } catch(e) {
        console.log(e)
    }
});

app.get("/forum", sessionChecker, function(req, res) {
    if(isSignedIn) {
        res.render("forum", {bool: isSignedIn})
    } else {
        res.redirect("signin")
    }
})
app.get("/helpdesk", function(req, res) {
    res.render("helpdesk", {bool: isSignedIn})
})

app.get("/aboutus", sessionChecker, function(req, res) {
    res.render("aboutus", {bool: isSignedIn})
})

app.get("/resources", sessionChecker, function(req, res) {
    res.render("resources", {bool: isSignedIn})
})

app.get("/internship", sessionChecker, function(req, res) {
    res.render("internship", {bool: isSignedIn})
})  
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Server is started on http://127.0.0.1:'+PORT);
});
