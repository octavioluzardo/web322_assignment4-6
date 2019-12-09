const mongoose = require('mongoose');
const Schema = mongoose.Schema;

    const RoomsSchema = new Schema({
        roomName:  
        {
            type:String,
            required:true
        },
        roomPrice:  
        {
            type:Number,
            required:true
        },
        roomDescription:  
        {
            type:String,
            required:true
        },
        roomLocation:  
        {
            type:String,
            required:true
        },
        roomPicture:
        {
            type:String
        },
        type:
        {
            type:String,
            default:"Rooms"
        },
     });


const roomsModel=mongoose.model("Rooms",RoomsSchema);

module.exports=roomsModel;