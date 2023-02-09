const { request, response } = require("express");
const mongoose = require("mongoose");
const { param } = require("./../Routes/medicineRouter");
require("./../Models/medicineModel");
const medicineSchema = mongoose.model("medicine");

exports.getAllMedicine = (request, response, next) => {
  let query;
  //copy request query
  const reqQuery = { ...request.queryt };
  //field to exclude
  const removeField = ["select", "sort"];
  //loop over removeField and delete the from reqQuery
  removeField.forEach((para) => delete reqQuery[param]);
  //create query String
  let queryStr = JSON.stringify(reqQuery);
  // create operator
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  //find resource
  query = medicineSchema.find(JSON.parse(queryStr));
  //select field
  if (request.query.select) {
    const fields = request.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //sort
  if (request.query.sort) {
    const sortBy = request.query.sort.split(",").join(" ");
    query = query.sort("_id");
  }
  medicineSchema
    .find()
    .then((data) => {
      response.status(200).json({ message: "All Medicine", data });
    })
    .catch((error) => {
      next(error);
    });
};
exports.addMedicine = async (request, response, next) => {
  let medicineObject = await new medicineSchema({
    name: request.body.name,
    type: request.body.type,
    expireDate: request.body.expireDate,
    productionDate: request.body.productionDate,
    companyName: request.body.companyName,
    price: request.body.price,
  });
  medicineObject
    .save()
    .then(() => {
      response.status(201).json({ message: "Add" });
    })
    .catch((error) => {
      next(error);
    });
};
exports.updateMedicine = (request, response, next) => {
  medicineSchema
    .updateOne(
      { _id: request.body.id },
      {
        $set: {
          name: request.body.name,
          type: request.body.type,
          expireDate: request.body.expireDate,
          productionDate: request.body.productionDate,
          companyName: request.body.companyName,
          price: request.body.price,
        },
      }
    )
    .then((data) => {
      if (data.modifiedCount == 0) throw new Error("medicine not found");
      response.status(200).json({ message: "update" });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteMedicine = (request, response) => {
  medicineSchema
    .findOneAndRemove({ _id: request.body.id })
    .then((result) => {
      if (!result) {
        response.status(400).json({ message: "not found" });
      } else {
        response.status(200).json({ message: "delete" });
      }
    })
    .catch((error) => {
      next(error);
    });
};
exports.getMedicineBYID = (request, response, next) => {
  response.status(201).json({ data: request.param.id });
};
