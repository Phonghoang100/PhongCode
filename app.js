require ('dotenv').config();
var express                     = require("express");
    app                         = express();
    bodyParser                  = require("body-parser");
    campground                  = require("./models/campground");
    Comment                     = require("./models/comment");
    User                        = require("./models/user");
    flash                       = require("connect-flash");
    passport                    = require("passport");
    LocalStrategy               = require("passport-local");
// seedDB                          = require("./seeds");
var methodOverride              = require("method-override");



// ========
// REQUIRING ROUTES
// ============
var commentRoutes               = require("./routes/comments");
var campgroundRoutes           = require("./routes/campgrounds");
var indexRoutes                 = require("./routes/index");




const mongoose                  = require("mongoose");
const password                  = process.env.ADMINCODE;


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://CodeMaster:${password}@yelpcamp.hhg1f.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// mongoose.connect(`mongodb+srv://CodeMaster:${password}@yelpcamp.hhg1f.mongodb.net/yelpcamp?retryWrites=true&w=majority`, { 
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//  }) .catch((error) => console.log(error));



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// seedDB();
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// ===============
// PASSPORT CONFIGURATION
// ===============
app.use(require("express-session")({
    secret: "Rusty is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
})



app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(process.env.PORT || 3000, function(){
    console.log("server is here");
  });