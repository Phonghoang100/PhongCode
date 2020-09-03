//jshint esversion:8
require('dotenv').config();
var express = require('express');
const app = express();
const bodyParser = require('body-parser');
const campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
// seedDB                          = require("./seeds");
var methodOverride = require('method-override');

// ========
// REQUIRING ROUTES
// ============
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

const password = process.env.ADMINCODE;
mongoose
	.connect(`mongodb+srv://CodeMaster:${password}@cluster0.hhg1f.mongodb.net/yelpCamp`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.catch((error) => console.log(error));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// seedDB();
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// ===============
// PASSPORT CONFIGURATION
// ===============
app.use(
	require('express-session')({
		secret: 'Rusty is the best',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.currentUser = req.user;
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';

app.listen(port, ip, function() {
	console.log('Server is here');
});
