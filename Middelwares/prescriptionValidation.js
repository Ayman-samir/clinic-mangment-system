const { body, query, param, validationResult } = require("express-validator");
let prescriptionValidator = [
    body("doctorid").isInt().withMessage("doctorid dddd must be number"),
    body("patientid").isInt().withMessage("patientid must be number"),
    body("clinicid").isInt().withMessage("clinicid must be number"),
    body("medicineid").isArray().withMessage(" medicineid Id must be number"),
    body("prescriptiondate").isDate().withMessage("Enter a valid date")
];

module.exports = prescriptionValidator;