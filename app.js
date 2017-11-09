const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),        
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        User            = require("./models/user");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/voting-app", {useMongoClient: true}, function(err){
    if (err) {
        console.log(err);
    }
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(process.env.port || 3000, () => {
    console.log('App Running...');
});