const Appointment = require('../models/appointmentModel');
const doctorSchema = require("./../Models/doctorsModel");
const mongoose = require("mongoose");
require("./../Models/patientModel");
const PatientSchema = mongoose.model("patientModel");
require("./../Models/ClinicModel");
const clinicSchema = mongoose.model("clinic");
//get all appointments
exports.getAllAppointments = async(req, res) => {
    try {
        // 1)Filtring
        const queryObj = {...req.query };
        const excludedFieleds = ['page', 'sort', 'limit', 'fields', 'select'];

        excludedFieleds.forEach(el => delete queryObj[el]);


        //  filtering gte|gt|lt
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,
            (match) => `$${match}`)


        let query = Appointment.find(JSON.parse(queryStr))
            .populate({ path: "doctor", select: ["firstName", "lastName"] })
            .populate({ path: "patient" })
            .populate({ path: "clinic", select: ["name", "address"] })

        // sorting .......................
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
            console.log(sortBy)
        }
        // Excute Query
        const apointments = await query

        res.status(200).json({
            staus: 'succesed',
            result: apointments.length,
            data: [
                apointments
            ]
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


// Create an appointment
exports.createAppointment = async(req, res, next) => {

    try {

        //// Check if the doctor is available at the specified time
        console.log(req.body)
        const { doctor, patient, clinic, date, time } = req.body;
        const existingAppointment = await Appointment.findOne({ doctor, date, time });
        if (existingAppointment) {
            return res.status(400).json({ error: 'Doctor is not available at the specified time' });
        }
        const doctorExsisting = await doctorSchema.findOne({ _id: doctor, clinic: clinic })
        console.log("doctor es", doctorExsisting) //cooooooooooooo
        if (!doctorExsisting) {
            return res.status(400).json({ error: 'Doctor is not available at This clinic' });
        }

        const patirntExsisting = await PatientSchema.findOne({ _id: patient })
        if (!patirntExsisting) {
            return res.status(400).json({ error: 'we cant assign an appointment for non exsisting patient' });
        }


        const newAppointment = await Appointment.create(req.body)


        res.status(201).json({
            status: 'succesed',
            data: {
                newAppointment: newAppointment
            }
        })
    } catch (error) {
        next(error)
            //return res.status(400).json({ error: error.message });
    }

};

// Edit an appointment
exports.editAppointment = async(req, res) => {
    try {
        //// Check if the doctor is available at the specified time
        const { doctor, date, time } = req.body;
        console.log(req.body)
        const existingAppointment = await Appointment.findOne(req.body);
        console.log(existingAppointment)
        if (existingAppointment) {
            return res.status(400).json({ error: 'Doctor is not available at the specified time' });
        }
        const { id } = req.params;
        const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true }); //still here validation for ether doctor her or not
        return res.status(200).json({ appointment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Remove an appointment
exports.removeAppointment = async(req, res, next) => {

    try {
        const { id } = req.params;
        // Remove the appointment from the doctor's list of appointments
        const appointment = await Appointment.findByIdAndDelete(id)
        if (appointment != null) {
            res.status(200).json({
                massage: "appointment deleted",
                deletedObj: appointment

            })
        } else {
            next(new Error("appointment doesn't exist"));
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}