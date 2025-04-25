const express=require("express");
const mongoose=require("mongoose");
const app=express();
const ejs=require("ejs");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
require('dotenv').config();
const port=8080;
let dburl=process.env.MONGO_URI;
const path=require("path");
const ExpressError=require("./utils/expresserror.js");
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport")
const localStrategy=require("passport-local");
const User=require("./models/user");
const CareerPath = require("./models/careercontent"); 
const Assessment=require("./models/assessment");
const Roadmap=require("./models/roadmaps");
const Course=require("./models/course");
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{secret:process.env.SECRET_KEY,},
  touchAfter:24*3600,
});
store.on("error",()=>
{
  console.log("ERROR in MONGO SESSION STORE",err);
  
});
sessionOptions={
  store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) ,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
     }
  }
  app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
console.log("Setting up Passport local strategy");
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.listen(port,()=>
    {
        console.log("Listening to port 8080");
        
    });
main()
.then(()=>
{
    console.log("connection successful");
    
})
.catch((err)=>
{
    console.log(err);
    
});
async function main(){
    await mongoose.connect(dburl)
}
const careerContent = {
    "Web Development": {
      roadmap: "https://roadmap.sh/frontend",
      resources: [
        "HTML & CSS Tutorial",
        "JavaScript Basics",
        "React Beginner Guide"
      ],
      courses: [
        { name: "Complete Web Dev Bootcamp", link: "https://udemy.com" },
        { name: "JavaScript Deep Dive", link: "https://coursera.org" }
      ]
    },
    "Data Science": {
      roadmap: "https://roadmap.sh/data-science",
      resources: [
        "Python for Data Science",
        "Pandas and NumPy Basics",
        "Matplotlib for Visualization"
      ],
      courses: [
        { name: "Data Science with Python", link: "https://datacamp.com" },
        { name: "Machine Learning A-Z", link: "https://udemy.com" }
      ]
    }
    // Add more career paths as needed
  };



  
app.use((req,res,next)=>
    {
      res.locals.successMsg=req.flash("success");
      res.locals.errorMsg=req.flash("error");
      res.locals.currUser=req.user;
      
      next();
    });
app.get("/signup",(req,res)=>
    {
        res.render("signup.ejs");
    });
    
    app.post("/signup", async (req, res) => {
        let { username, email, password } = req.body;
      
        try {
          // Create a new user document
          let newUser = new User({ username, email });
      
          // Register the user (hashes password)
          let registeredUser = await User.register(newUser, password);
      
          // Log in the user after registration
          req.login(registeredUser, (err) => {
            if (err) {
              console.log("Error during login:", err);
              req.flash("error", "Something went wrong while logging you in. Please try again.");
              return res.redirect("/login");
            }
      
            // If successful, redirect to the dashboard
            req.flash("success", "Welcome to my chatApp!");
            res.redirect("/dashboard");
          });
      
        } catch (error) {
          req.flash("error", error.message);
          res.redirect("/signup");
        }
      });
      

        app.get("/login",(req,res)=>
            {
              res.render("login.ejs")
            })
            
            app.post("/login",passport.authenticate("local",{
                failureFlash:true,
                failureRedirect:"/login",
                
            }),async(req,res)=>{
                req.flash("success","Logged In");
            res.redirect("/dashboard");

            }
            )
            
            app.get("/logout", (req, res) => {
                req.logout((err) => {
                  if (err) {
                    console.error("Logout error:", err);
                    req.flash("error", "Failed to log out.");
                    return res.redirect("/dashboard");
                  }
                  req.flash("success", "Logged out successfully!");
                  res.redirect("/login");
                });
              });
              function isLoggedIn(req, res, next) {
                if (req.isAuthenticated()) {
                  return next();
                }
                req.flash("error", "You must log in first!");
                res.redirect("/login");
              }
              const careerPaths = [
                "Web Development",
                "Data Science",
                "Machine Learning",
                "Artificial Intelligence",
                "DSA",
                "Cloud Computing",
                "Cybersecurity",
              ];
            
              app.get("/dashboard", async (req, res) => {
                if (!req.isAuthenticated()) {
                  return res.redirect("/login");
                }
              
                const user = req.user; // Fetch logged-in user
              
                // Check if the user has an active career path
                let selectedPath = user.activeCareerPath;
              
                if (!selectedPath && user.careerPaths.length > 0) {
                  // If no active career path is set, default to the first one
                  selectedPath = user.careerPaths[0].path;
              
                  // Set the first career path as the active one
                  user.activeCareerPath = selectedPath;
                  await user.save();
                }
              
                // Fetch the content for the selected career path
                let content = null;
                if (selectedPath) {
                  content = await CareerPath.find({name:selectedPath});                  
                  // content = careerContent[selectedPath];
                }
              
                // Calculate cumulative progress for the active career path only
                const activePath = user.careerPaths.find((path) => path.path === selectedPath);
                             // Find the active career path data
  
              
                res.render("dashboard", { user, content, careerPaths });
              });
         
              app.get("/career-paths", isLoggedIn, async (req, res) => {
                // const user = await User.findById(req.user._id);
                // const careerPaths = user.careerPaths;  // Fetch the user's career paths from the database
                
                res.render("careerPaths.ejs", { careerPaths }); // Display career path options
              });
              
              
              app.post("/career-paths", isLoggedIn, async (req, res) => {
                try {
                  const { careerPath } = req.body;  // Career path selected from the form
                  const user = req.user;
              
                  console.log("Career path received:", careerPath);
              
                  // Check if the career path is already in the user's careerPaths array
                  const existingCareerPath = user.careerPaths.find(path => path.path === careerPath);
              
                  if (existingCareerPath) {
                    console.log("Career path already exists.");
                    req.flash("info", "You already have this career path.");
                    return res.redirect("/career-paths");
                  }
              
                  // If the career path is new, add it to the user's careerPaths array
                  user.careerPaths.push({
                    path: careerPath,
                    progress: {
                      score: 0,  // Initialize progress score
                    }
                  });
              
                  await user.save();  // Save the updated user data
                  console.log("Path saved successfully!");
              
                  req.flash("success", `Career path "${careerPath}" added successfully!`);
                  return res.redirect("/dashboard");
                } catch (error) {
                  console.error("Error saving career path:", error);
                  req.flash("error", "An error occurred while saving the career path.");
                  return res.redirect("/career-paths");
                }
              });
              
              app.get("/roadmaps", async (req, res) => {
                try {
                  const user = req.user // Get logged-in user
                  const roadmap = await Roadmap.findOne({ careerPath: user.activeCareerPath });
              
                  if (!roadmap) {
                    return res.render("roadmap", { roadmap: null });
                  }
              
                  res.render("roadmap", { roadmap });
                } catch (error) {
                  console.error(error);
                  res.status(500).send("Server error");
                }
            });
            
            app.get("/courses", async (req, res) => {
              if (!req.isAuthenticated()) {
                return res.redirect("/login");
              }
            
              const user = req.user; // Fetch logged-in user
            
              const careerPathData = user.careerPaths.find(
                (cp) => cp.path === user.activeCareerPath
              );
          
              if (!careerPathData) {
                return res.render("error", { message: "No progress data found." });
              }
          
              // Extract course progress
              const progress = careerPathData.courseProgress || {
                beginner: 0,
                intermediate: 0,
                advanced: 0,
              };
          
                res.render("selectlevel",{user,progress});
            });
            
              
            app.get("/assessments", isLoggedIn, async (req, res) => {
              const user = req.user;
            
              if (!user.activeCareerPath) {
                return res.redirect("/career-paths");
              }
              res.render("assessments",{careerPath:user.activeCareerPath});
            });
            
          
            app.get("/assessments/:careerPath/:level", async (req, res) => {
              const { careerPath, level } = req.params;
              const assessment = await Assessment.findOne({ careerPath, level });
            
              if (!assessment || assessment.tests.length === 0) {
                return res.status(404).send("No assessments found.");
              }
            
              res.render("assessmentsPage", { careerPath, level, tests: assessment.tests });
            });
            app.get("/assessments/:careerPath/:level/:testName", async (req, res) => {
              const { careerPath, level, testName } = req.params;
              const assessment = await Assessment.findOne({ careerPath, level });
              const user = req.user;
          
              if (!assessment) {
                  return res.status(404).send("Assessment not found.");
              }
          
              const test = assessment.tests.find(t => t.testName === testName);
              if (!test) {
                  return res.status(404).send("Test not found.");
              }
          
              res.render("startAssessment", { careerPath, level, test, user ,retestMode: false});
          });
          
          app.post("/assessments/:careerPath/:level/:testName/retest", async (req, res) => {
            const { careerPath, level, testName } = req.params;
            const assessment = await Assessment.findOne({ careerPath, level });
            if (!assessment) return res.status(404).send("Assessment not found.");
          
            const test = assessment.tests.find(t => t.testName === testName);
            if (!test) return res.status(404).send("Test not found.");
          
            const user = await User.findById(req.user._id);
            const attempt = user.attemptedAssessments.find(a =>
              a.careerPath === careerPath && a.level === level && a.testName === testName
            );
          
            if (!attempt || attempt.hasRetested) {
              return res.send("Retest not allowed.");
            }
          
            // Allow one-time retest
            res.render("startAssessment", {
              careerPath,
              level,
              test,
              user,
              retestMode: true
            });
          });
          
        

          app.post("/assessments/:careerPath/:level/:testName/submit", async (req, res) => {
            const { careerPath, level, testName } = req.params;
            const { answers, retestMode } = req.body;
          
            const assessment = await Assessment.findOne({ careerPath, level });
            if (!assessment) return res.status(404).send("Assessment not found.");
          
            const test = assessment.tests.find(t => t.testName === testName);
            if (!test) return res.status(404).send("Test not found.");
          
            let score = 0;
            test.questions.forEach((question, index) => {
              if (answers[index] === question.correctAnswer) score++;
            });
          
            const user = await User.findById(req.user._id);
          
            const existingAttempt = user.attemptedAssessments.find(a =>
              a.careerPath === careerPath && a.level === level && a.testName === testName
            );
          
            if (existingAttempt && retestMode === 'true') {
              if (existingAttempt.hasRetested) {
                return res.send("You’ve already used your one-time retest.");
              }
              existingAttempt.score = score;
              existingAttempt.hasRetested = true;
            } else if (!existingAttempt) {
              user.attemptedAssessments.push({
                careerPath,
                level,
                testName,
                score,
                hasRetested: false
              });
            } else {
              // Already attempted and not a retest
              return res.render("score", {
                careerPath,
                level,
                test,
                user,
                score: existingAttempt.score,
                alreadyAttempted: true
              });
            }
          
            await user.save();
            return res.render("score", {
              careerPath,
              level,
              test,
              user,
              score,
              alreadyAttempted: false
            });
          });
          
          
          
          
          
              
         
        
              
              app.post("/updateCareerPath", isLoggedIn, async (req, res) => {
                const { newCareerPath } = req.body;
              
                // Fetch the complete user document
                const user = await User.findById(req.user._id).exec();
              
                if (!user) {
                  console.log("User not found");
                  return res.status(404).send("User not found");
                }
                const existingCareerPath = user.careerPaths.find((path) => path.path === newCareerPath);
                console.log(existingCareerPath);
              
                if (existingCareerPath) {
                  user.activeCareerPath = newCareerPath;

                  // Save the updated user data
                  await user.save();
              
                  console.log("Career path already exists. Switching to:", newCareerPath);
                  return res.redirect("/dashboard");
                } else {
                  console.log("Career path does not exist. Adding new one.");
                  user.careerPaths.push({
                    path: newCareerPath,
                    progress: {
                      assessmentsDone: false,
                      score: 0,
                      mockInterviewProgress: [],
                      mockInterviewprogress: 0,
                    },
                  });
                  user.activeCareerPath = newCareerPath
                  await user.save();
                }
              
                res.redirect("/dashboard");
              });
              
     

app.post("/contact",(req,res)=>
{
  let {firstName,lastName}=req.body;
  res.render("thankYou.ejs",{firstName,lastName});
})
app.get("/home",(req,res)=>
{
  res.render("home.ejs");
});
app.get("/features",(req,res)=>
{
  res.render("features.ejs");
});
app.get("/support",(req,res)=>
{
  res.render("contact.ejs");
});
app.get("/about",(req,res)=>
{
  res.render("about.ejs");
});





app.get("/courses/:careerPath/:level", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const { careerPath, level } = req.params;

    const user = await User.findById(userId);
    if (!user || !user.activeCareerPath) {
      return res.render("error", { message: "Career path not found." });
    }

    const courses = await Course.find({ careerPath, level });

    const careerPathData = user.careerPaths.find(cp => cp.path === careerPath);
    if (!careerPathData) return res.render("error", { message: "User progress not found." });

    // ✅ Ensure `completedCourses` exists in `courseProgress`
    let completedCourses = [];
    if (careerPathData.courseProgress && careerPathData.courseProgress.completedCourses) {
      completedCourses = careerPathData.courseProgress.completedCourses.map(id => id.toString());
    }

    // ✅ Pass `completedCourses` to the EJS template
    res.render("courses", { courses, careerPath, level, completedCourses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.render("error", { message: "Error fetching courses." });
  }
});


app.post("/courses/complete/:courseId", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found.");

    // Find the active career path
    const careerPathData = user.careerPaths.find(cp => cp.path === user.activeCareerPath);
    if (!careerPathData) return res.status(400).send("Career path not found.");

    // Find the course to get its level
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).send("Course not found.");

    const { level } = course; // beginner, intermediate, advanced

    // Ensure `courseProgress` exists
    if (!careerPathData.courseProgress) {
      careerPathData.courseProgress = { beginner: 0, intermediate: 0, advanced: 0, completedCourses: [] };
    }

    // 🔹 Fetch total courses for this level
    const totalCourses = await Course.countDocuments({ careerPath: user.activeCareerPath, level });
    if (totalCourses === 0) {
      return res.status(400).send("No courses found for this level.");
    }

    // 🔹 Track completed courses correctly
    if (!careerPathData.courseProgress.completedCourses.includes(courseId)) {
      careerPathData.courseProgress.completedCourses.push(courseId); // Mark course as completed
    }

    // 🔹 Count only completed courses for the same level
    const completedCourses = await Course.countDocuments({
      _id: { $in: careerPathData.courseProgress.completedCourses },
      level: level
    });


    // 🔹 Calculate progress correctly
    const progressPercentage = Math.min(100, Math.round((completedCourses / totalCourses) * 100));
    careerPathData.courseProgress[level] = progressPercentage;

    await user.save();
    res.redirect("back");

  } catch (error) {
    console.error("Error updating course progress:", error);
    res.status(500).send("Error updating course progress.");
  }
});



app.all("*",(req,res,next)=>
    {
      next(new ExpressError(404,"Page not found!"));
    });
                
 app.use((err,req,res,next)=>
    {
        let{status=500,message="Something went wrong"}=err;    
        res.status(status).render("error.ejs",{message});                   
     });

     