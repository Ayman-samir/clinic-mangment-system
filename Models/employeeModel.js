const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require('bcrypt');
const patientAddress = new mongoose.Schema({
    city: { type: String, require: true },
    street: { type: String, require: true },
    building: { type: Number, require: true }
}, { _id: false })
const empSchema = new mongoose.Schema({
    _id: { type: Number },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true, match: /^[A-Za-z\s]+$/ },
    empAge: { type: Number, match: / \d+ /, min: 22, max: 60 },
    empGender: { type: String, enum: ["male", "female"] },
    empEmail: { type: String, unique: true, match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
    empPassword: { type: String, required: true },
    empImage: { type: String },
    empSalary: { type: Number },
    empPhone: { type: String, unique: true, match: /^01[0125][0-9]{8}$/ },
    clinicId: { type: Number, match: / \d+ /, ref: 'clinic' },
    role: { type: String, require: true, default: 'Employee' },
    address: patientAddress,
    image: { type: String, default: './../public/uploads/default.jpg' }
}, { _id: false });
empSchema.plugin(autoIncrement, { id: 'EmployeeId', inc_field: "_id" });

empSchema.methods.jwtSignIn = function() {
    return jwt.sign({ id: this._id, Email: this.email }, process.env.SECRET_KEY, {
        expiresIn: '3h'
    });
}

empSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next()
})
mongoose.model("employee", empSchema);