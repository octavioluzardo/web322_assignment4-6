const express = require('express')
const router = express.Router();
const Rooms = require("../models/Rooms")

router.get("/",(req,res)=>
{
    res.render("home");
});

router.get("/Rooms",(req,res)=>{
    const query = {}
    if(req.query.location){query.roomLocation=req.query.location}
    Rooms.find(query)
    .then(Rooms => {
        res.render("Rooms", {Rooms})
    })
});

exports.getRoom = (req, res) => {
    const query = {};
    if (req.query.location) {
        query.roomLocation = req.query.location;
    }
    Rooms.find(query)
        .then(rooms => {
            res.render("rooms", { rooms, city: req.query.location});
        })
        .catch(err => {
            console.log(`Something went wrong:\n${err}`);
            res.redirect("/");
        });
}
module.exports=router;
