const express = require("express");
const router = express.Router();
const controllers = require("./../Controllers/doctorsController")

//doctor validator
const validator = require("./../Middelwares/errorValidation")
const doctorValidation = require("./../Middelwares/doctorValidation");
const validatorAuth = require("../Middelwares/authValidation");


router.route("/doctors")
    .get(validatorAuth.checkAdmin, controllers.getAllDoctors)
    .post(doctorValidation.doctorValidation, validator, controllers.addNewDoctor)


router.route("/doctors/:id")
    .get(validatorAuth.checkAdmin, controllers.getDoctorById)
    .patch(validatorAuth.checkAdmin, doctorValidation.doctor_id, validator, controllers.uploadDoctorImg, controllers.updateDoctor)
    .delete(validatorAuth.checkAdmin, doctorValidation.doctor_id, validator, controllers.deleteDoctor)


module.exports = router