const express = require('express')
const router = express.Router();
const bcrypt= require("bcryptjs");
const path = require("path");
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const hasAccess= require("../middleware/authentication");
const Book = require("../models/book");
const User = require("../models/User");
const Rooms = require("../models/Rooms");

router.get("/loginPage", (req,res)=>{
    res.render("loginPage")
});
router.get("/registration", (req,res)=>{
    res.render("registration")
});
router.get("/adminDashboard", hasAccess,(req,res)=>{
    Book.find({userId: req.session.userInfo._id})
    .then(books => res.render("adminDashboard", {books})) 
});
router.get("/nonAdminDashboard",hasAccess,(req,res)=>{
    Book.find({userId: req.session.userInfo._id})
    .then(books => res.render("nonAdminDashboard", {books})) 
});
router.get("/editRooms", hasAccess,(req,res)=>{
    res.render("editRooms");
})

router.get("/logout",(req,res)=>{
    //This destroys the session
    req.session.destroy();
    res.redirect("/user/loginPage");

});

router.post("/loginPage",(req,res)=>{

    const errors =[];

    if(req.body.email=="")
    {
        errors.push("Please enter your email")
    }

    if(req.body.password=="")
    {
        errors.push("Please enter your password")
    }

    //This means that there are errors
    if(errors.length > 0)
    {
        res.render("loginPage",
        {
            message:errors 
        })
    }

      //This means that there are no errors
    else
    {
        User.findOne({email:req.body.email})
        .then(user=>{
    
            //This means that there was no matching email in the database
            if(user==null)
            {
                errors.push("Sorry your email/password is incorrect");
                console.log("Incorrect password");
                res.render("loginPage",{
                    message: errors
                })
            }
    
            //This reprsents tha the email exists
            else
            {
                bcrypt.compare(req.body.password,user.password)
                .then(isMatched=>{
    
                    if(isMatched==true)
                    {
                        //It means that the user is authenticated 
    
                        //Create session 
                        req.session.userInfo=user;
                        console.log("login successful");
                        if(user.admin)
                        {
                            res.redirect("/user/adminDashboard")
                        }
                        else
                        {
                            // comment 
                            res.redirect("/user/nonAdminDashboard");
                        }
                    }
                    else
                    {
                        errors.push("Sorry your email/password is incorrect");
                        console.log("Incorrect password");
                        res.render("loginPage",{
                            message:errors
                        })
                    }   
                })
    
                .catch(err=>console.log(`Error :${err}`));
            }
        })
        .catch(err=> console.log(`Something occured ${err}`));
    }

});

router.post("/registration",(req,res)=>{
    
    const errors = [];

    if(req.body.firstName=="")
    {
        errors.push("Please enter your first name")
    }
    if(req.body.lastName=="")
    {
        errors.push("Please enter your last name")
    }
    if(req.body.regPassword=="")
    {
        errors.push("Please enter a password")
    }
    if(req.body.confirmRegPassword=="")
    {
        errors.push("Please confirm your password")
    }
    if(req.body.email=="")
    {
        errors.push("Please enter an email")
    }
    if((/^[a-zA-Z0-9]+$/.test(req.body.regPassword) == false) || req.body.regPassword.length < 8 || req.body.regPassword.length > 14) 
    {
        errors.push("Password must only contain letters and numbers and be between 8 and 14 characters")
    }
    if(req.body.confirmRegPassword !=req.body.regPassword)
    {
        errors.push("Passwords do not match")
    }
    //This means that there are errors
    if(errors.length > 0)
    {
        res.render("registration",
        {
            message:errors
        });
    }
    //This means that there are no errors
    else
    {
        const formData ={
          email:req.body.email,
          password:req.body.regPassword,
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          birthMonth:req.body.birthMonth,
          birthDay:req.body.birthDay,
          birthYear:req.body.birthYear,
          confirmRegPassword:req.body.confirmRegPassword
        }
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
        to: req.body.email,
        from: 'oluzardo@web322example.com',
        subject: 'User Registration to Web322-Airbnb',
        text: 'You have been registered to Fake Airbnb',
        };
        sgMail.send(msg);

    const user = new User(formData);
    user.save()
    .then(() => 
    {
        console.log('Form data was inserted into database')
        res.redirect("/dashboard");

    })
    .catch((err)=>{
        errors.push("email already exists");
        res.render("registration",
        {
            message:errors
        });
        console.log(`Email was not inserted into the database because ${err}`)
    })
}




});

router.get("/booking/:id", hasAccess, (req, res) =>{
    Rooms.findById(req.params.id)
    .then(rooms=> {
        const booking = {
            roomId: rooms._id,
            userId: req.session.userInfo._id,
            roomName: rooms.roomName,
            roomLocation: rooms.roomLocation,
            roomPrice: rooms.roomPrice,
        }
        const newbooking = new Book(booking)
        newbooking.save()
        .then(()=>{
            res.redirect('/user/nonAdminDashboard') 
         })
         .catch(err=>console.log(`Error : ${err}`));
    })
    .catch((error) => {
        res.redirect(`/rooms`)
        console.log(`Something went wrong.`)})
});

module.exports=router;