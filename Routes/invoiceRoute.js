const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const controller = require("./../Controllers/invoiceController");
const validator = require("./../Middelwares/errorValidation");
const validatorAuth = require("../Middelwares/authValidation");
const invoiceValidator = require("./../Middelwares/invoiceValidator");
const router = express.Router();

router
    .route("/invoice")
    .get(validatorAuth.checkEmployee, controller.getAllInvoices)
    .post(invoiceValidator, validator, validatorAuth.checkEmployee, controller.addInvoice)
    .patch(body("id").isInt().withMessage("id should be integer"), validator, validatorAuth.checkEmployee, controller.updateInvoice);

router.delete("/invoice/:id", param("id").isInt().withMessage("id should be integer"), validator, validatorAuth.checkEmployee, controller.deleteInvoiceByID);

router.get("/invoice/:id", param("id").isInt().withMessage("id should be integer"), validator, validatorAuth.checkEmployee, controller.getInvoiceByID);

module.exports = router;