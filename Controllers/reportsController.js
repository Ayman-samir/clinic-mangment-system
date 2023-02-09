const { request, response } = require("express");
const mongoose = require("mongoose");

const appointmentSchema = mongoose.model("Appointment");
const invoiceSchema = mongoose.model("invoice");

exports.getAllAppointments = (request, response, next) => {
  let query;
  //copy requset query
  const reqQuery = { ...request.query };
  //field to exclude
  const removeField = ["select", "sort"];
  //loop over removeField and delete the from reqQuery
  removeField.forEach((param) => delete reqQuery[param]);
  //create query string
  let queryStr = JSON.stringify(reqQuery);
  //create operator
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  query = appointmentSchema.find(JSON.parse(queryStr));
  if (request.query.select) {
    const fields = request.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //sort
  if (request.query.sort) {
    const sortBy = request.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("_id");
  }
  appointmentSchema
    .find()
    .populate({ path: "doctor" })
    .populate({ path: "patient" })
    .populate({ path: "clinic" })
    .then((data) => {
      response.status(200).json({ message: "Get All Appointments", data });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllInvoices = (request, response, next) => {
  let query;
  //copy requset query
  const reqQuery = { ...request.query };
  //field to exclude
  const removeField = ["select", "sort"];
  //loop over removeField and delete the from reqQuery
  removeField.forEach((param) => delete reqQuery[param]);
  //create query string
  let queryStr = JSON.stringify(reqQuery);
  //create operator
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  query = invoiceSchema.find(JSON.parse(queryStr));
  if (request.query.select) {
    const fields = request.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //sort
  if (request.query.sort) {
    const sortBy = request.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("_id");
  }
  invoiceSchema
    .find()
    .populate({ path: "prescription" })
    .populate({ path: "receptionist" })
    .then((data) => {
      response.status(200).json({ message: "Get All Invoices", data });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getInvoiceById = (request, response, next) => {
  invoiceSchema
    .findOne({ _id: request.params.id })
    .populate({ path: "prescription" })
    .populate({ path: "receptionist" })
    .then((data) => {
      if (data != null) {
        console.log(data.prescription[0].clinicId);
        response.status(200).json(data);
      } else {
        next(new Error("invoice doesn't Exist"));
      }
    })
    .catch((error) => next(error));
};

exports.getAppointmentById = (request, response, next) => {
  appointmentSchema
    .findOne({ _id: request.params.id })
    .populate({ path: "doctor" })
    .populate({ path: "patient" })
    .populate({ path: "clinic" })
    .then((data) => {
      if (data != null) {
        response.status(200).json(data);
      } else {
        next(new Error("Appointment doesn't Exist"));
      }
    })
    .catch((error) => next(error));
};
