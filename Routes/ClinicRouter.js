const { request, response } = require("express");
const express = require("express");
const ClinicController = require("./../Controllers/ClinicController");
const { body, param, query } = require("express-validator");
const validator = require("./../Middelwares/errorValidation");
const clinicValidator = require ("./../Middelwares/clinicValidation");
const validatorAuth = require("../Middelwares/authValidation");
const router = express.Router();

router
    .route("/clinic")
    .get(validatorAuth.checkAdminPatient,ClinicController.getAllClinic)
    .post(validatorAuth.checkAdmin,clinicValidator,validator,ClinicController.addClinic)
    .put(validatorAuth.checkAdmin,clinicValidator,validator,ClinicController.updateClinic)
    .delete(validatorAuth.checkAdmin,ClinicController.deleteClinic);
    
router.get( "/clinic/:id", param("id").isInt().withMessage("id should be number"),validatorAuth.checkAdmin, validator, ClinicController.getClinicID);

module.exports = router;