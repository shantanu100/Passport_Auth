const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");

const app = express();


//Passport config
require('./config/passport')(passport);

//DB config
const url = "mongodb://localhost/testdb"
mongoose.connect(url,
{useNewUrlParser:"true", useUnifiedTopology: true }
)

mongoose.connection.on("error",err=>{
    console.log("err",err)
})

mongoose.connection.on("connected",(err,res)=>{
    console.log("Mongoose is connected")
})


//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }));

//Passport middleware
  app.use(passport.initialize());
app.use(passport.session());

  //Connect flash
  app.use(flash());

  //global vars
//   app.use((req,res,next)=>{
//       res.locals.success_msg=req.flash('success-msg');
//       res.locals.error_msg = req.flash('error_msg');
//       res.locals.error_msg = req.flash("error");
//       next();
//   });



//Rotes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'))


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on ${PORT}`));