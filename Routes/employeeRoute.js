const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
// import controller
const controller = require("./../Controllers/employeeController");
// import validators
const validator = require("./../Middelwares/errorValidation");
const employeeValidator = require("./../Middelwares/employeeValidation");
const validatorAuth = require("../Middelwares/authValidation");
const router = express.Router();

router
    .route("/employee")
    .get(validatorAuth.checkAdmin, controller.getAllEmployees)
    .post(employeeValidator, validatorAuth.checkAdmin, validator, controller.addEmployee);



router.patch(
    "/employee/:id",
    param("id").isInt().withMessage("Id should be integer"),
    validator, validatorAuth.checkAdmin,
    controller.uploadEmployeeImg, controller.updateEmployee);

router.get(
    "/employee/:id",
    param("id").isInt().withMessage("Id should be integer"),
    validatorAuth.checkAdmin,
    validator,
    controller.getEmployeeById
);
router.delete(
    "/employee/:id",
    param("id").isInt().withMessage("Id should be integer"),
    validatorAuth.checkAdmin,
    validator,
    controller.deleteEmployee
);

//router.patch("/employee/:id/image",validatorAuth.checkAdmin,controller.uploadImage);


module.exports = router;