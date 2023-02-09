const express = require("express");
const {body,query,param} = require("express-validator");
const controller = require("../Controllers/authController");
const validator =require("../Middelwares/errorValidation");
const authValidator = require("../Middelwares/authValidation");
const router = express.Router();
router.route("/register").post([
    body("fname").isString().withMessage("FIRST NAME NOT VALID (STRING)").isLength({max:12}).withMessage("Length is More than 8"),
    body("lname").isString().withMessage("LAST NAME NOT VALID (STRING)").isLength({max:12}).withMessage("Length is More than 8"),
    body("age").isInt().withMessage("AGE NOT VALID (NUMBER)"),
    body("email").isString().matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).withMessage("EMAIL IS NOT VAILD"),
    body("password").isStrongPassword().withMessage("PASSWORD NOT STRONG ENOUGH"),
    body("telephone").isString().withMessage("TELEPHONE IS NOT VALID (NUMBER)"),
    body("role").isString().withMessage("ROLE IS NOT VALID (NUMBER)"),
    body("gender").isIn(['M','F']).withMessage("GENDER SHOULD BE M OR F"),
    body("address").isObject().withMessage("ADDRESS NOT VALID (OBJECT)"),
    body("address.city").isString().withMessage("CITY NOT VALID (STRING)"),
    body("address.street").isString().withMessage("STREET NOT VALID (STRING)"),
    body("address.building").isInt().withMessage("BUILDING NOT VALID (NUMBER)")
],
validator,controller.register);
router.route("/login").post(validator,controller.login);
// router.route("/me").get(validator,controller.myInfo);
module.exports=router;

