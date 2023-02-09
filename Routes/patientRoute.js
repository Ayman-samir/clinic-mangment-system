const express = require("express");
const { body, query, param } = require("express-validator");
const controller = require("../Controllers/patientController");
const validator = require("../Middelwares/errorValidation");
const router = express.Router();
const validatorAuth = require("../Middelwares/authValidation");
const patientValidator = require("../Middelwares/patientValidation");
// const { myInfo } = require("../Controllers/authController");
router.route("/patient").
get(validatorAuth.checkAdminEmployee, controller.displayPatient)
    .post(patientValidator, validator, validatorAuth.checkAdminEmployee, controller.addPatient);
router.get("/patient/:id", param("id").isInt().withMessage("ID IS NOT VALID (INTEGER)"), validator, validatorAuth.checkAdminDoctorEmployee, controller.displayPatientById);
router.patch("/patient/:id", param("id").isInt().withMessage("ID IS NOT VALID (INTEGER)"), validator, validatorAuth.checkAdminEmployee, patientValidator, controller.uploadPatientImg, controller.updatePatient);
router.delete("/patient/:id", param("id").isInt().withMessage("ID IS NOT VALID (INTEGER)"), validator, validatorAuth.checkAdminEmployee, controller.deletePatientById);
// router.get("/me",myInfo,validator);

module.exports = router;