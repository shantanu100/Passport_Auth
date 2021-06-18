const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User Model
const User = require('../models/User')


//Login Page
router.get('/login',(req,res)=>{
    res.render("login")
})

//Register Page
router.get('/register',(req,res)=>{
    res.render("register");
})

//Register Handle
router.post('/register',(req,res)=>{
  const {name,email,password,password2} = req.body;
//   console.log("in post register req body is",req.body);

  let errors = [];
  //check requires fields
  if(!name || !email || !password || !password2){
      errors.push({msg:'Please fill all fields'})
      console.log("cannot be push as empty fiels are there")
  }

  //check password match
  if(password !== password2){
     errors.push({msg:'Password do not match'});
     console.log("password idn't match")
  }

  //check password length
  if(password.length < 6){
      errors.push({msg:"password should be at least 6 chars"})
      console.log("path length should be mnore than 6")
  }

   if(errors.length>0){
       console.log("there are error more than 0")
         res.render('register',{
             errors,
             name,
             email,
             password,
             password2 
         })
   }else{
       //Validation Pass

       User.findOne({email: email })
       .then(user=>{
           if(user){
               //User exists
               console.log("user exists")
               errors.push({msg:'Email is already registered'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2 
            });
           }else{
               console.log("in else of newuser");
             const newUser = new User({
                 name,
                 email,
                 password
             });
             //Hash Password
             bcrypt.genSalt(10, (err,salt)=>
             bcrypt.hash(newUser.password,salt,(err,hash)=>{
                 if(err) throw err;
                 //Set password to hashed
                 newUser.password=hash;
                 //Save user
                 newUser.save()
                 .then((user)=>{
                     req.flash('success_msg','You are now registered and can log in')
                     res.redirect('/users/login');
                 })
                 .catch(err => console.log(err))
             }))

           }
       })
   }

});

//Login handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
})(req,res,next);
}
);

//Logout handle
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
});

module.exports= router;