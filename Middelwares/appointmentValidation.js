const { body, query, param, validationResult } = require("express-validator");

let appointmentValidator = [
    body("doctor").isInt().withMessage("Doctor ref id should be a number"),
    body("patient").isInt().withMessage("Patient ref id should be a number"),
    body("clinic").isInt().withMessage("Clinic ref id should be a number"),
    body("date").isDate().withMessage("Invalid date format"),
    body("time").custom(value => { //05:00  
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(value)) {
            throw new Error('Invalid time format');
        }
        return true;
    })
];
let appointmentID = param("id").isInt().withMessage("id should be integer");
module.exports = { appointmentValidator, appointmentID }