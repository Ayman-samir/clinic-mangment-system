const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema({
  _id:{type: Number},
  doctorId:{type: Number, ref:"doctors"},
  patientId:{type: Number, ref:"patientModel"},
  clinicId:{type: Number, ref:"clinic"},
  medicineId:[{type:Number, ref:"medicine"}],
  prescriptionDate:{type:Date}
},{_id:false});
schema.plugin(autoIncrement,{id:'prescriptionId', inc_field: "_id"});
mongoose.model("prescription",schema);