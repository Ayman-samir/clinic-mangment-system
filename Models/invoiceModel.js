const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

//create schema for Department collection
const schema = new mongoose.Schema(
  {
    _id: { type: Number },
    prescription: [{ type: Number, ref: "prescription" }],
    invoiceDate: {
      type: String, //"2016-11-05" date formate
      get: (date) => {
        return date.split("T")[0];
      },
      required: [true, " Date for appointment is required"],
      default: Date.now(),
    },
    invoiceTime: {
      type: String, //8:30=>time formate
      required: [true, " Time for appointment is required"],
    },
    Status: { type: String, enum: ["failed", "success"] },
    receptionist: [{ type: Number, ref: "employee" }],
    paymentMethod: { type: String, enum: ["Cash", "Credit Card", "Insurance Card"], default: "cash", required: true },
    totalPaid: { type: Number },
  },
  { _id: false }
);

schema.plugin(AutoIncrement, { id: "Invoice_id_counter", inc_field: "_id" });

//mapping: binding Schema with collection
module.exports = mongoose.model("invoice", schema);
