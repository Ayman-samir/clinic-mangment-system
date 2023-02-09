const { body, query, param, validationResult } = require("express-validator");
let empValidator = [
    body("firstName")
    .isString()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("name must contains characters only"),
    body("lastName")
    .isString()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("name must contains characters only"),
    body("empAge")
    .isInt({ min: 22, max: 60 })
    .withMessage("Age must be numbers only between 22 and 60 years"),
    body("empGender")
    .isIn(["male", "female"])
    .withMessage("Gender must be Male or Female"),
    body("empEmail").matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).isString().withMessage("Email must be like: myemail@ourearth.com"),
    body("empPassword").isStrongPassword(),
    body("empImage").isString().withMessage("Upload your message"),
    body("empSalary").isFloat().withMessage("Salary must be Number"),
    body("empPhone").isInt().matches(/^01[0125][0-9]{8}$/).withMessage("Phone Number must be like: 010|011|012|015 xxxxxxxx"),
    body("clinicid")
    .isInt()
    .withMessage("Clinic id must be number"),
    body("address").isObject().withMessage("address is an object"),
    body("address.city").isString().withMessage("city is string"),
    body("address.street").isString().withMessage("street is string"),
    body("address.building").isInt().withMessage("building is number"),
];

module.exports = empValidator;