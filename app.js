const   express     = require('express'),
        app         = express(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/voting-app", {useMongoClient: true}, function(err){
    if (err) {
        console.log(err);
    }
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(process.env.port || 3000, () => {
    console.log('App Running...');
});