const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.get("/",(req,res)=>{
    res.render("homePage")
});

app.get("/roomListing",(req,res)=>{
    res.render("roomListing")
});

app.get("/userRegistration",(req,res)=>{
    res.render("userRegistration")
});


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{

    console.log(`The Web Server started at PORT :${PORT}`);
});