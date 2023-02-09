const express = require("express");
const router = express.Router();
const controller = require("./../Controllers/appointmentController")
const { body, query, param, validationResult } = require("express-validator");
// appoint validator
const appointmentValidation = require("./../Middelwares/appointmentValidation");
const errorvalidation = require("./../Middelwares/errorValidation")
const validatorAuth = require("../Middelwares/authValidation");
router.route('/appointment')
    .get(validatorAuth.checkAdminDoctorEmployee, controller.getAllAppointments)
    .post(validatorAuth.checkAdminDoctorEmployee, appointmentValidation.appointmentValidator, errorvalidation, controller.createAppointment)





router.route('/appointment/:id')
    .put(validatorAuth.checkAdminDoctorEmployee, appointmentValidation.appointmentID, errorvalidation, controller.editAppointment)
    .delete(validatorAuth.checkAdminDoctorEmployee, appointmentValidation.appointmentID, errorvalidation, controller.removeAppointment)



module.exports = router