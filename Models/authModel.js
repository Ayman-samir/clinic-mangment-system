const mongoose = require ("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAddress = new mongoose.Schema({
    city:{type:String,require:true},
    street:{type:String,require:true},
    building:{type:Number,require:true}
},{_id:false})
const userSchema = new mongoose.Schema({
    _id:{type:Number},
    fname:{type:String,required:true},
    lname:{type:String,required:true},
    age:{type:Number,required:true},
    telephone:{
        type:String,
        require:true,
        match:/^01[0125][0-9]{8}$/,
        unique:true},
    gender:{
        type:String,
        require:true,
        num:['M','F']},
    email:{type:String,
        require:[true,'Please Enter Email'],
    match:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    unique:true},
    password:{type:String,
        require:[true,'Please Enter Password']},
    role:{
        type:String,
        enum:['Doctor','Patient','Employee','Admin'],
        default:'Patient',required:true},
    salary: {type: Number},
    address:userAddress,
    specialty: {
        type: String,
        required:false
    },
    vezeeta: {
        type: Number,
        required:false
    },
    clinicId: { type: Number, match: / \d+ /, ref: 'clinic' ,required:false}


},{_id:false})
userSchema.plugin(autoIncrement,{id:'user_id',inc_field:'_id'});
userSchema.pre('save', async function (){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

userSchema.methods.jwtSignIn=function(){
    return jwt.sign({id:this._id,email:this.email},process.env.SECRET_KEY,{
        expiresIn:'1h'
    });
}

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
mongoose.model("authModel",userSchema);

