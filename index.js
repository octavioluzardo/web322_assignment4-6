const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'))
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }))

const DBURL= "mongodb+srv://octavioluzardo:Polillas21.@cluster0-likhw.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(DBURL, {useNewUrlParser: true})

.then(()=>{
    console.log(`Database is connected`)
})
.catch(err=>{
    console.log(`Something went wrong : ${err}`);
})

const Schema = mongoose.Schema;

const registration = new mongoose.Schema({
email: String,
password: String,
firstName: String,
lastName: String,
day: Number,
month: Number,
year: Number
});

const reg = mongoose.model("reg", registration);

app.get("/",(req,res)=>{
    res.render("homePage")
});

app.get("/roomListing",(req,res)=>{
    res.render("roomListing")
});

app.get("/userRegistration",(req,res)=>{
    res.render("userRegistration",{})
});

app.get("/login",(req,res)=>{
    res.render("login")
});

app.get("/dashboard", (req,res)=>{
    res.render("dashboard")
});

app.post("/login",(req,res)=>{
    const errors=[];
    
    if(req.body.username == ""){
        errors.push("Please enter your username")
    }
    if(req.body.password == ""){
        errors.push("Please enter your password")
    }
    if(errors.length > 0){
        res.render("userRegistration",{
            message:errors
        })
    }
    else{
        res.render("dashboard")
    }
});


app.post("/userRegistration",(req,res)=>{

    const errorReg=[];

    if(req.body.fName =="")
    {
        errorReg.push("Please enter name");
    }

    if(req.body.lName =="")
    {
        errorReg.push("Please enter name");
    }
    
    if(req.body.email =="")
    {
        errorReg.push("Please enter your email");
    }

    if((/^[a-zA-Z0-9]+$/.test(req.body.password) == false) || req.body.password.length < 6 || req.body.password.length > 12){
        errorReg.push("Password must be 6-12 characters and must only contain letters and numbers")
    }

    if(errorReg.length > 0 )
        {
            res.render("userRegistration",{
                message:errorReg
            })
        }
    else
    {
        const formData ={
            email:req.body.email,
            password: req.body.password,
            firstName: req.body.fName,
            lastName: req.body.lName,
            day: req.body.day,
            month: req.body.month,
            year: req.body.year
        };
        const ta = new reg(formData);
        ta.save()
        .then(()=>{
            console.log('Task was inserted into the database')
        })
        .catch((err)=>{
            console.log(`Task was not inserted into the database because ${err}`)
        })

        const nodemailer = require('nodemailer');
        const sgTransport = require('nodemailer-sendgrid-transport');

        const options = {
            auth: {
                api_key: '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'
            }
        }

        const mailer = nodemailer.createTransport(sgTransport(options));

        const email = {
            to: `${req.body.email}`,
            from: 'octavio@web322.com',
            subject: 'Registration Confirmation',
            text: 'Thanks For Registering'
        };
         
        mailer.sendMail(email, (err, res)=> {
            if (err) { 
                console.log(err) 
            }
            console.log(res);
        })

        res.redirect("/dashboard");        
    }
})



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{

    console.log(`The Web Server started at PORT :${PORT}`);
});