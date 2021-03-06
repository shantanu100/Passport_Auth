const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Local user Model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField:'email'},(email,password,done)=>{
            //match user
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'That email isnt register'});
                }

                //Match password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                     
                    if(isMatch){
                        return done(null,user);

                    }else{
                        return done(null,flase,{message:'Password inccorect'});
                    }
                });
            })
            .catch(err=>console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}