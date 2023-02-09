const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

// create schema

const medicineSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    type: { type: String, required: true },
    expireDate: {
        type: String,
        required: true,
        get: (date) => {
            return date.split("T")[0];
        },
    },
    productionDate: {
        type: String,
        required: true,
        get: (date) => {
            return date.split("T")[0];
        },
    },
    companyName: { type: String, required: true },
    price: { type: Number, required: true },
});

medicineSchema.plugin(autoIncrement, { id: "medicine_id", inc_field: "_id" });
module.exports = mongoose.model("medicine", medicineSchema);