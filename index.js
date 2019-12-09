const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const fileupload = require("express-fileupload");
const session = require("express-session");
require("dotenv").config();

const userRoutes = require("./routes/User");
const generalRoutes = require("./routes/General");
const roomsRoutes = require("./routes/Rooms");
const app = express();


app.use(bodyParser.urlencoded({extended:false}));
app.use(fileupload())
app.use(methodOverride('_method'));
app.use(express.static("public"));

app.use(session({secret:`${process.env.dbusername} is the master`}))

app.use((req,res,next)=>{
    res.locals.user= req.session.userInfo;
    next();
})

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}))

app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/rooms", roomsRoutes);

const DBURL= `mongodb+srv://${process.env.dbusername}:${process.env.dbpassword}@cluster0-likhw.mongodb.net/WEB322A456?retryWrites=true&w=majority`;
mongoose.connect(DBURL, {useNewUrlParser: true})
.then(()=>{
    console.log(`Database is connected`)
})
.catch(err=>{
    console.log(`Something went wrong : ${err}`);
})

app.get("/loginPage", (req,res)=>{
    res.render("loginPage")
});
app.get("/dashboard", (req, res)=> {
    res.render("dashboard")
})  

const PORT= process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`server ${PORT} is running`)
})