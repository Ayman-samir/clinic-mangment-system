const mongoose = require("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');
const patientAddress = new mongoose.Schema({
    city: { type: String, require: true },
    street: { type: String, require: true },
    building: { type: Number, require: true }
}, { _id: false })
const patientSchema = new mongoose.Schema({
    _id: { type: Number },
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    age: { type: Number, require: true },
    email: { type: String, require: true, match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, unique: true },
    password: { type: String, require: true },
    telephone: { type: String, require: true, match: /^01[0125][0-9]{8}$/, unique: true },
    gender: { type: String, require: true, enum: ['M', 'F'] },
    address: patientAddress,
    role: { type: String, require: true, default: 'Patient' },
    Image: { type: String, default: "./../public/img/patient/default.jpg" }
})
patientSchema.plugin(autoIncrement, { id: 'Patient_id', inc_field: '_id' })


patientSchema.methods.jwtSignIn = function() {
    return jwt.sign({ id: this._id, Email: this.email }, process.env.SECRET_KEY, {
        expiresIn: '4h'
    });
}

patientSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next()
})
mongoose.model("patientModel", patientSchema);