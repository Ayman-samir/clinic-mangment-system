const { body, query, param, validationResult } = require("express-validator");
let invoiceValidator = [
  body("prescription").isInt().withMessage("prescription ref should be number"),
  body("invoiceDate").isDate().withMessage("Invalid date format"),
  body("invoiceTime").custom((value) => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
      throw new Error("Invalid time format");
    }
    return true;
  }),
  body("Status").isIn(["failed", "success"]).withMessage("Status should be either failed or success"),
  body("receptionist").isInt().withMessage("receptionist ref should be number"),
  body("paymentMethod").isIn(["Cash", "Credit Card", "Insurance Card"]).withMessage("payment method should be  Cash, Credit Card or Insurance Card"),
  body("totalPaid").isInt(),
];

module.exports = invoiceValidator;
