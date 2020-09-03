var express                     = require("express");
var router                      = express.Router({mergeParams: true});
var campground                  = require("../models/campground");
var Comment                     = require("../models/comment");
// var middleware                  = require("../middleware");


// ====================================
// CREATE A COMMENT ROUTE
// ====================================
router.get("/new", isLoggedIn, function(req, res){
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
                res.render("comments/new", {campground: campground});
        }
    });
});

// =========================
// COMMENT POST ROUTE
// =============================
router.post("/", isLoggedIn, function(req, res){
 
    campground.findById(req.params.id, function(err, campgrounds){
    if(err){
        console.log(err);
        res.redirect("/campgrounds");
    } else {
        Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error", "Something is wrong");
            } else {
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                // save comment
                comment.save();
                campgrounds.comments.push(comment);
                campgrounds.save();
                req.flash("success", "New comment created");
                res.redirect('/campgrounds/'+ campgrounds._id);
            }
        });
    };
});
});

// ===================================
// COMMENT EDIT ROUTE
// ====================================
router.get("/:comment_id/edit", checkCommentOwnerShip, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
        }
    }) 
})

// ==========================
// COMMENT UPDATE
// =============================
router.put("/:comment_id", checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "You updated the comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// ======================
// COMMENT DESTROY ROUTE
// ======================
router.delete("/:comment_id", checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment terminated");
            res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnerShip(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                res.redirect("back"); 
                } else {
                    // does user own the comment?
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You need to be Login");
                        res.redirect("back");
                    }  
                }
            });
} else{
    res.redirect("back");
}
};


module.exports = router;