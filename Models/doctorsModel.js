const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');
const doctorSchema = new mongoose.Schema({

    firstName: {
        type: String,

        required: [true, "FirstName is required"]
    },
    lastName: {
        type: String,
        required: [true, "LastName  is required"]
    },
    specialty: {
        type: String
    },
    vezeeta: {
        type: Number,
        default: 100
    },
    password: {
        type: String,
        required: [true, "Password  is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    },
    salary: {
        type: Number,
        min: [3000, 'salary must be over 3000'],
        required: [true, "  salary is required"]
    },
    age: {
        type: Number,

        min: 22,
        max: 60,
        required: [true, "  age is required"]
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    clinic: {
        type: Number,
        ref: 'clinic'
    },
    image: {
        type: String,
        default: "default.jpg"

    },
    role:{type:String,require:true,default:'Doctor'}



}, { _id: false })

doctorSchema.plugin(autoIncrement, { id: "doctor_id", inc_field: '_id' })
doctorSchema.index({ firstName: 1, lastName: 1 }, { unique: true })

doctorSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next()
})
const doctors = mongoose.model("doctors", doctorSchema)

module.exports = doctors;