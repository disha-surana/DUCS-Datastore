var mongoose    = require("mongoose");
var Subject     = require("./models/subject"),
    Semester    = require("./models/semester");

var sem4_subjects = [
    {
        name:"Compiler Design",
        teacher:"Ms. Roni Chakre", 
        code: "MCA-401"
    },{
        name:"Information Security",
        teacher:"Prof. S.K Muttoo", 
        code: "MCA-402"
    },
    {
        name:"Network Programming",
        teacher:"Ms. Nisha", 
        code: "MCA-403"
    },
    {
        name:"DataBase Applications",
        teacher:"Ms. Ritika Sharma", 
        code: "MCAE-404"
    },
    {
        name:"Advanced Operating System",
        teacher:"Dr. Sapna Varshney", 
        code: "MCAE-405"
    },
    {
        name:"Numerical Computing",
        teacher:"Ms. Megha Khandelwal", 
        code: "MCAE-407"
    },
    {
        name:"Combinational Optimization",
        teacher:"Prof. Neelima Gupta", 
        code: "MCAE-409"
    },
    {
        name:"Deep Learning",
        teacher:"Prof. Naveen Kumar", 
        code: "MCAE-410"
    },
]

function seedDB(){
   //Remove all campgrounds
   Semester.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Semester!");
        Subject.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed Subjects!");
			
            Semester.create({sem: "M4"}, function(err, semester){
                if(err){
                    console.log(err)
				} else 
				{
					console.log("added semester m4");
					Subject.insertMany(sem4_subjects, function(err,sub_ids){
						if(err){
							console.log("Sub error: " + err);
						}
						else{
							semester.subjects = sub_ids;
							semester.save();
							console.log(semester);
						}
					});
                }
			});
        });
    }); 
}
 
module.exports = seedDB;