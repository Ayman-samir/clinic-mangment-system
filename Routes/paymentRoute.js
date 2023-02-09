const express = require("express");
const paymentController = require("./../Controllers/paymentController");
const validatorAuth = require("../Middelwares/authValidation");
const validator = require("./../Middelwares/errorValidation");
const router = express.Router();

router.post("/smart_payment/:id", validator, validatorAuth.checkAdminPatient, paymentController.pay);
router.post("/cash_payment/:id", validator, validatorAuth.checkAdminPatient, paymentController.Cash);

module.exports = router;