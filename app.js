const express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
const { urlencoded } = require("body-parser");
const ejs = require("ejs");
const app = express();

const User = require("./models/User");
const Forum = require("./models/Forum");
const Resources = require("./models/Resources");
const Experience = require("./models/Experience");

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
        expires: 604800
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
        res.render("home", {bool:isSignedIn})
    } else {
        next()
    }
}

app.route("/")
.get(sessionChecker, function(req, res) {
    res.render("home", {bool:isSignedIn});
});

app.route("/signup")
.get(sessionChecker, function(req, res) {
    res.render("signup");
})
.post(function(req, res) {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        institute: req.body.institute,
    });

    user.save(function(err, docs) {
        if (err) {
            res.redirect("signup");
            console.log(err);
        } else {
            console.log(docs);
            req.session.user = docs;
            res.render("signin") 
        }
    })
});

app.route("/signin")
.get(sessionChecker, function(req, res) {
    isSignedIn = false;
    res.render("signin");
})
.post(async function(req, res) {
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
        console.log(user);
        isSignedIn = true;
        res.render("home", {bool:isSignedIn})
    } catch(e) {
        console.log(e)
    }
});

app.route("/forum")
.get(sessionChecker, function(req, res) {
    if(isSignedIn) {
        Forum.find(function(err, result){
            if (!err){
                console.log(result);
                res.render("forum", {bool: isSignedIn, result: result})
            } else {
                res.redirect("home", {bool:isSignedIn})
            }
        });
    } else {
        res.redirect("/signin")
    }
});

app.route("/forum_add")
.get(sessionChecker, function(req, res){
    if (isSignedIn){
        res.render("forum_add", {bool: isSignedIn})
    } else {
        res.redirect("/signin")
    }
})
.post(sessionChecker, function(req, res){
    if (isSignedIn) {
        let forum = new Forum({
        title: req.body.title,
        topic: req.body.topic,
        content: req.body.content,
        author: req.session.user.username
    });
    forum.save(function(err, done){
        if (err) {
            res.render("forum_add", {bool: isSignedIn});
            console.log(err);
        } else {
            Forum.find(function(err, result){
                if (!err){
                    console.log(result);
                    res.render("forum", {bool: isSignedIn, result: result})
                } else {
                    res.render("home", {bool:isSignedIn})
                }
            }); 
        }
    })
    } else {
        res.redirect("/signin", {bool: isSignedIn})
    }
})

app.get("/aboutus", sessionChecker, function(req, res) {
    res.render("aboutus", {bool: isSignedIn})
})

app.get("/profile", sessionChecker, function(req, res){
    if(isSignedIn){
        Resources.find({author: req.session.user.username}, function(err, result_res){
            if (!err){
                Experience.find({author: req.session.user.username}, function(err, result_exp){
                    if(!err){
                        res.render("profile", {bool: isSignedIn, user: req.session.user, result_res: result_res, result_exp: result_exp})
                    } else {
                        res.redirect("home", {bool:isSignedIn})
                    }
                })
            } else {
                res.redirect("home", {bool:isSignedIn})
            }
        });
    } else {
        res.redirect("/signin")
    }
})

app.get("/helpdesk", sessionChecker, function(req, res) {
    res.render("helpdesk", {bool: isSignedIn})
})

app.get("/resources", function(req, res) {
    Resources.find(function(err, result){
        if (!err){
            res.render("resources", {bool: isSignedIn, result: result})
        } else {
            res.redirect("home", {bool:isSignedIn})
        }
    });
})
app.get("/resources/write", sessionChecker, function(req, res){
    if(isSignedIn){
        res.render("resources_write", {bool: isSignedIn});
    } else {
        res.redirect("/signin")
    }
})
app.post("/resources/write", sessionChecker, function(req, res){
    if (isSignedIn) {
        let resources = new Resources({
        title: req.body.title,
        content: req.body.content,
        author: req.session.user.username
        });
        resources.save(function(err, done){
        if (err) {
            res.render("resources_write", {bool: isSignedIn});
            console.log(err);
        } else {
            Resources.find(function(err, result){
                if (!err){
                    res.render("resources", {bool: isSignedIn, result: result})
                } else {
                    res.render("home", {bool:isSignedIn})
                }
            }); 
        }
    })
    } else {
        res.redirect("/signin", {bool: isSignedIn})
    }
})

app.get("/internship", sessionChecker, function(req, res) {
    Experience.find(function(err, result){
        if (!err){
            res.render("internship", {bool: isSignedIn, result: result})
        } else {
            res.redirect("home", {bool:isSignedIn})
        }
    });
})
app.get("/internship/write", sessionChecker, function(req, res){
    if(isSignedIn){
        res.render("internship_write", {bool: isSignedIn});
    } else {
        res.redirect("/signin")
    }
})
app.post("/internship/write", sessionChecker, function(req, res){
    if (isSignedIn) {
        let experience = new Experience({
        title: req.body.title,
        content: req.body.content,
        author: req.session.user.username,
        likes: 0
    });
    experience.save(function(err, done){
        if (err) {
            res.render("internship_write", {bool: isSignedIn});
            console.log(err);
        } else {
            Experience.find(function(err, result){
                if (!err){
                    res.render("internship", {bool: isSignedIn, result: result})
                } else {
                    res.render("home", {bool:isSignedIn})
                }
            }); 
        }
    })
    } else {
        res.redirect("/signin", {bool: isSignedIn})
    }
})

app.get("/forum/:id", function(req, res){
    if(isSignedIn){
        Forum.findOne({_id: req.params.id}, function(err, result){
            if (!err){
                res.render("forum_view", {bool: isSignedIn, result: result})
            } else {
                res.redirect("/forum")
            }
        });
    } else {
        res.redirect("/signin")
    }
})

app.get("/resources/:id", function(req, res){       
    Resources.findOne({_id: req.params.id}, function(err, result){
        if (!err){
            res.render("resources_view", {bool: isSignedIn, result: result})
        } else {
            res.redirect("/resources", {bool: isSignedIn, result: result})
        }
    });
})

app.get("/internship/:id", function(req, res){       
    Experience.findOne({_id: req.params.id}, function(err, result){
        if (!err){
            res.render("internship_view", {bool: isSignedIn, result: result})
        } else {
            res.redirect("/internship")
        }
    });
})

app.get("/:user", function(req, res){       
    User.findOne({username: req.params.user}, function(err, result){
        if (!err){
            res.render("general_profile", {bool: isSignedIn, result: result})
        } else {
            res.redirect("/home", {bool: isSignedIn})
        }
    });
})
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Server is started on http://127.0.0.1:'+PORT);
});
