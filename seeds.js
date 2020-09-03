var campground = require("./models/campground");
var Comment = require("./models/comment");
const mongoose = require("mongoose");
var data = [
    {
        name:"Coffee Mug",
        image:"https://images.pexels.com/photos/1239422/pexels-photo-1239422.jpeg?auto=compress&cs=tinysrgb&h=350",
        description:"A blog (a truncation of )[1] is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order, so that the most recent post appears first, at the top of the web page. Until 2009, blogs were usually the work of a single individual,[citation needed] occasionally of a small group, and often covered a single subject or topic. In the 2010s, (MABs) emerged, featuring the writing of multiple authors and sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks, advocacy groups, and similar institutions account for an increasing quantity of blog traffic. The rise of Twitter and other systems helps integrate"
    },
    {
        name:"Fire",
        image:"https://images.pexels.com/photos/266436/pexels-photo-266436.jpeg?auto=compress&cs=tinysrgb&h=350",
        description:"A blog (a truncation of )[1] is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order, so that the most recent post appears first, at the top of the web page. Until 2009, blogs were usually the work of a single individual,[citation needed] occasionally of a small group, and often covered a single subject or topic. In the 2010s, (MABs) emerged, featuring the writing of multiple authors and sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks, advocacy groups, and similar institutions account for an increasing quantity of blog traffic. The rise of Twitter and other systems helps integrate"
    },
    {
        name:"Land of Water",
        image:"https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg?auto=compress&cs=tinysrgb&h=350",
        description:"A blog (a truncation of )[1] is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order, so that the most recent post appears first, at the top of the web page. Until 2009, blogs were usually the work of a single individual,[citation needed] occasionally of a small group, and often covered a single subject or topic. In the 2010s, (MABs) emerged, featuring the writing of multiple authors and sometimes professionally edited. MABs from newspapers, other media outlets, universities, think tanks, advocacy groups, and similar institutions account for an increasing quantity of blog traffic. The rise of Twitter and other systems hel"
    }
] 

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

function seedDB(){
    // REMOVE ALL CAMP GROUND
    campground.remove({}, function(err){
    if(err){
        console.log(err);
    } 
        console.log("remove campground");
            // ADD IN NEW CAMPGROUND
            data.forEach(function(seed){
                campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else{
                        // create a comment
                        Comment.create(
                            {
                                text: "This place is greate, but i wish there was internet",
                                author:"Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("comment saved");
                                }
                            });
                    }
                })
            })
    });
    
  
    // ALL COMMENT
}

module.exports = seedDB