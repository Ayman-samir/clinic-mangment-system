const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const appointmentSchema = new mongoose.Schema({
    // _id: {
    //     type: Number,
    //     required: [true, "  appointment  id is required"]
    // },
    doctor: {
        type: Number,
        ref: 'doctors',
        required: true
    },
    patient: {
        type: Number,
        ref: 'patientModel', // ref to name of schema
        required: true
    },
    clinic: {
        type: Number,
        ref: "clinic",
        required: true
    },
    date: {
        type: String, //"2016-11-05" date formate
        get: (date) => {
            return date.split("T")[0];
        },

        required: [true, " Date for appointment is required"]
    },
    time: {
        type: String, //8:30=>time formate
        required: [true, " Time for appointment is required"]
    }
}, { _id: false });


appointmentSchema.plugin(autoIncrement, { id: "appointemt_id", inc_field: '_id' });
const Appointment = mongoose.model('Appointment', appointmentSchema);


module.exports = Appointment;