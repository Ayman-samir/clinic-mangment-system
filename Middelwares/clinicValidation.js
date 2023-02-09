const { body, query, param, validationResult } = require("express-validator");
const router = require("../Routes/ClinicRouter");
let clinicValidator =[
    
        body("name")
        .isString()
        .withMessage("name Should be character")
        .isLength({ max: 20 })
        .withMessage("Name less than 20"),
        body("department")
        .isAlpha()
        .withMessage("Department should be characters")
        .isLength({ max: 30 })
        .withMessage("Department should < 30"),
        body("address").isObject().withMessage("in valid address"),
        body("address.city").isString().withMessage("invalid city"),
        body("address.street").isString().withMessage("invalid street"),
        body("address.building").isString().withMessage("invaild bulding"),
        body("doctor").isArray().withMessage("invalid doctor"),
        body("telephoneNumber")
        .isInt()
        .withMessage("invalid telephone number")
        .matches(/^01[0125][0-9]{8}$/),
    
]

module.exports = clinicValidator;