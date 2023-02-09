const express = require("express");
const reportsController = require("../Controllers/reportsController");
const { body, param, query } = require("express-validator");
const validator = require("./../Middelwares/errorValidation")
const validatorAuth = require("../Middelwares/authValidation");
const router = express.Router();

router.get("/report_Appointment", validator, validatorAuth.checkAdminEmployee, reportsController.getAllAppointments);
router.get("/report_Invoice", validator, validatorAuth.checkAdminEmployee, reportsController.getAllInvoices);
router.get("/report_Appointment/:id", validator, validatorAuth.checkAdminEmployee, reportsController.getAppointmentById);
router.get("/report_Invoice/:id", validator, validatorAuth.checkAdminEmployee, reportsController.getInvoiceById);
// router.delete("/reports/:id",reportsController.deleteReports);

module.exports = router;