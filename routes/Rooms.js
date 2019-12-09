const express = require('express')
const router = express.Router();
const path = require("path");
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const hasAccess= require("../middleware/authentication");

const Rooms = require("../models/Rooms");

router.get("/searchRooms", hasAccess, (req, res) => {
    res.render("searchRooms");
})

router.get("/adminRooms", hasAccess, (req, res) => {
    res.render("adminRooms");
})

router.post("/adminRooms", hasAccess, (req,res)=>{
    
    const errors =[];

    if(req.body.roomName=="")
    {
        errors.push("Please enter room name")
    }

    if(req.body.roomPrice=="")
    {
        errors.push("Please enter a price")
    }

    if(req.body.roomDescription=="")
    {
        errors.push("Please enter a description")
    }
    if(req.body.roomLocation=="")
    {
        errors.push("Please enter a location")
    }
    if(req.files.roomPicture.mimetype.indexOf("image")==-1)
    {
        errors.push("Sorry you can only upload images : Example (jpg,gif, png) ")
    }
    if(errors.length > 0)
    {
        res.render("adminRooms",
        {
            message:errors
        });
    }

    else
    {
        const formData ={
          roomName:req.body.roomName,
          roomPrice:req.body.roomPrice,
          roomDescription:req.body.roomDescription,
          roomLocation:req.body.roomLocation,
        }

        const room = new Rooms(formData);
        room.save()
        .then(room=>{
            //rename file to include the userid            
            //upload file to server
            req.files.roomPicture.name = `db_${rm._id}${path.parse(req.files.roomPicture.name).ext}`
            req.files.roomPicture.mv(`public/uploadedIMG/${req.files.roomPicture.name}`)
            .then(()=>{
                //Then is needed to refer to associate the uploaded image to the user
                Rooms.findByIdAndUpdate(room._id,{
                    roomPicture:req.files.roomPicture.name 
                })
                .then(()=>{
                    console.log(`File was updated in the database`)
                    res.redirect("/rooms");  
                })
                .catch(err=>console.log(`Error :${err}`));           
            })
        })
        .catch(err=>console.log(`Error :${err}`));
    }
});

//Route to direct user to edit room form
router.get("/editRooms/:id",hasAccess,(req,res)=>
{
    Rooms.findById(req.params.id)
    .then((rooms)=>{
        res.render("editRooms",{
            roomDocument:rooms
        })
    })
    .catch(err=>console.log(`Error : ${err}`));
});

//Route to update a task based on the information entered in the room form
router.put("/editRooms/:id",hasAccess,(req,res)=>
{
    Rooms.findById(req.params.id)
    .then((rooms)=>{

        rooms.roomName=req.body.roomName;  
        rooms.roomPrice=req.body.roomPrice;
        rooms.roomDescription=req.body.roomDescription;
        rooms.roomLocation=req.body.roomLocation;

        rooms.save()

        .then(()=>{
           res.redirect("/rooms") 
        })
        .catch(err=>console.log(`Error : ${err}`));

    })
    .catch(err=>console.log(`Error : ${err}`));
});


module.exports = router