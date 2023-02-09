const express = require("express");
const medicineController = require("../Controllers/medicineController");
const { body, param, query } = require("express-validator");
const validator = require("../Middelwares/errorValidation");
const validatorAuth = require("../Middelwares/authValidation");
const router = express.Router();

router
  .route("/medicine")
  .get(validatorAuth.checkAdminDoctor,medicineController.getAllMedicine)
  .post(
    [
      body("name").isString().withMessage("name should be string"),
      body("type").isString().withMessage("Type Should Be String"),
      body("expireDate").isDate(),
      body("productionDate").isDate(),
      body("companyName")
        .isString()
        .withMessage("Company Name Should Be String"),
      body("price").isFloat().withMessage("Price Should Be Number"),
    ],
    validatorAuth.checkAdminDoctor,
    validator,
    medicineController.addMedicine
  )
  .put(validatorAuth.checkAdminDoctor,medicineController.updateMedicine)
  .delete(validatorAuth.checkAdminDoctor,medicineController.deleteMedicine);

router.get(
  "/medicine/:id",
  param("id").isInt().withMessage("Id Should Be Number"),
  validatorAuth.checkAdminDoctor,
  validator,
  medicineController.getMedicineBYID
);

module.exports = router;
