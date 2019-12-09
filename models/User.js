const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


    const UserSchema = new Schema({
        firstName:  
        {
            type:String,
            required:true
        },
        lastName:  
        {
            type:String,
            required:true
        },
        email:  
        {
            type:String,
            required:true,
            unique:true
        },
        password:  
        {
            type:String,
            required:true
        },
      birthMonth: {
          type:String,
          required:true
        },
      birthDay: {
        type:String,
        required:true
      },
      birthYear: {
        type:String,
        required:true
      },    
      admin: {
          type:Boolean,
          default: false
      },
    type :
    {
        type:String,
            default:"User"
        },
        dateCreated :
        {
            type:Date,
            default: Date.now()
        }
    });
    
    
//The "pre" mongoose function is going to call the below function right before the document is saved to the DB
UserSchema.pre("save", function(next){
  
        bcrypt.genSalt(10)
        .then(salt=>{
            bcrypt.hash(this.password,salt)
            .then(hash=>{
                this.password=hash
                // The below code is a call back function that does the following :
                 //It forces the code of execution to  move onto the next code in the execution queue 
                next();
            })
        })
})

const userModel =mongoose.model("User",UserSchema);

module.exports=userModel;