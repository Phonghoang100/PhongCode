var express                     = require("express");
var router                      = express.Router();
var campground                  = require("../models/campground");
var Comment                     = require("../models/comment");
// var middleware                  = require("../middleware");
// ======================
// INDEX ROUTE/CAMPGROUNDS
// ======================


router.get("/", function(req, res){
    campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("err");
        } else{
             res.render("campground/campgrounds", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    })
   
});

router.post("/",isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price:price, image: image, description: description, author: author}
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("err");
        } else{
            req.flash("success", "New Campground added");
            res.redirect("/campgrounds");
        } 
    })
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("campground/new");
});

router.get("/:id", function(req, res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campground/show", {campground: foundCampground});
        };
    });
});

// =======================================
// EDIT ROUTE
// ========================================
router.get("/:id/edit", checkCampgroundOwnerShip, function(req, res){
            campground.findById(req.params.id, function(err, foundCampground){
                 res.render("campground/edit", {campground: foundCampground});
            });
});

// ======================
// UPDATE EDIT ROUTE
// ===========================
router.put("/:id", checkCampgroundOwnerShip, function(req, res){
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Edit Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// =======================
// DESTROY CAMPGROUND ROUTE
// ======================
router.delete("/:id", checkCampgroundOwnerShip, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.send(err);
        } else {
            req.flash("success", "Campground Terminated");
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Login");
    res.redirect("/login");
}

function checkCampgroundOwnerShip(req, res, next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                req.flash("error", "Campground not found");
                res.redirect("back"); 
                } else {
                    // does user own the campground?
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You need to be Login");
                        res.redirect("back");
                    }  
                }
            });
} else{
    req.flash("error", "You need to be Login");
    res.redirect("back");
}
}


module.exports = router;
