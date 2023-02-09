const { body, query, param, validationResult } = require("express-validator");

let doctorValidation = [

    body("firstName").isAlpha().isLength({ min: 3 }).withMessage("firstName must be at least 3 characters"),
    body("lastName").isAlpha().isLength({ min: 3 }).withMessage("lastName must be at least 3 characters"),
    body("password").isStrongPassword().withMessage(" password  must be a strong one"),
    body("email").isEmail().withMessage(" invalid email"),
    body("salary").isInt({ min: 3000 }).withMessage("Salary must be a whole number greater than or equal to 3000"),
    body("age").isInt({ min: 22, max: 60 }).withMessage("Age must be numbers only between 22 and 60 years"),
    body("gender").isIn(["male", "female"]).withMessage("Gender must be mail or Femail"),
    body("clinic").isInt().withMessage("clinic id must be number"),
    body("image").isString().withMessage("image src id must be string"),

]
let doctor_id = param("id").isInt().withMessage("doctor  id must be a number")
module.exports = { doctorValidation, doctor_id }