const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),        
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        User            = require("./models/user"),
        Poll            = require("./models/poll"),
        Option          = require("./models/option");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/voting-app", {useMongoClient: true}, function(err){
    if (err) {
        console.log(err);
    }
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "It's always sunny in Ferndale!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/polls', isLoggedIn, (req, res) => {
    Poll.find({}, (err, allPolls) => {
        if (err) {
            console.log(err);
        } else {
            res.render('polls', {polls: allPolls});
        }
    });
});
app.post('/polls', (req, res) => {
    var newPoll = {name: req.body.name};
    var options = req.body.options;
    Poll.create(newPoll, (err, newPollEntry) => {
        if (err) {
            console.log(err);
        } else {
            console.log('New Poll Created!');
            options.forEach(option => {
                var newOption = {name: option};
                console.log(newOption);
                Option.create(newOption, (err, newOptionEntry) => {
                    if (err) {
                        console.log(err);
                    } else {
                        newPollEntry.options.push(newOptionEntry);
                        newPollEntry.save();
                    }
                });
            });
            console.log(newPollEntry);
            res.redirect('/polls'); 
        }
    });
});

app.get('/polls/new', (req, res) => {
    res.render('new');
});


app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/polls");
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/polls",
    failureRedirect: "/login"
}), function(req,res){});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.port || 4200, () => {
    console.log('App Running...');
});