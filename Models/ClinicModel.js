const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

//Schema for Address
const AddressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    street: { type: String, required: true },
    buildingNumber: { type: Number, required: true },
}, { _id: false });
//create schema validator
const ClinicSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    department: { type: String, required: true },
    address: AddressSchema,
    doctor: {
        type: Array,
        validate: {
            validator: function(array) {
                return array.every((v) => typeof v === 'number');
            }
        },

        ref: "doctors"
    },
    telephoneNumber: { type: Number, required: true, unique: true, match: /^01[0125][0-9]{8}$/ },
});
ClinicSchema.plugin(autoIncrement, { id: "clinic_id", inc_field: "_id" });
module.exports = mongoose.model("clinic", ClinicSchema);