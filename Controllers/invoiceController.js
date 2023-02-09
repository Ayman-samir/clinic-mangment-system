const mongoose = require("mongoose");

require("../Models/invoiceModel");

const InvoiceSchema = mongoose.model("invoice");

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
  query = InvoiceSchema.find(JSON.parse(queryStr));
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

  InvoiceSchema.find()
    .populate({ path: "prescription" })
    .populate({ path: "receptionist" })

    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
exports.addInvoice = (request, response, next) => {
  let newInvoice = new InvoiceSchema({
    _id: request.body.id,
    prescription: request.body.prescription,
    invoiceDate: request.body.invoiceDate,
    invoiceTime: request.body.invoiceTime,
    Status: request.body.Status,
    receptionist: request.body.receptionist,
    paymentMethod: request.body.paymentMethod,
    totalPaid: request.body.totalPaid,
  });
  newInvoice
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
};

exports.updateInvoice = (request, response, next) => {
  InvoiceSchema.updateOne(
    {
      _id: request.body.id,
    },
    {
      $set: {
        prescription: request.body.prescription,
        invoiceDate: request.body.invoiceDate,
        invoiceTime: request.body.invoiceTime,
        Status: request.body.Status,
        receptionist: request.body.receptionist,
        paymentMethod: request.body.paymentMethod,
        totalPaid: request.body.totalPaid,
      },
    }
  )
    .then((result) => {
      if (result.matchedCount != 0) {
        response.status(200).json({ message: "updated" });
      } else {
        next(new Error("invoice doesn't Exist"));
      }
    })
    .catch((error) => next(error));
};

exports.getInvoiceByID = (request, response, next) => {
  InvoiceSchema.findOne({ _id: request.params.id })
    .populate({ path: "prescription" })
    .populate({ path: "receptionist" })
    .then((data) => {
      if (data != null) {
        response.status(200).json(data);
      } else {
        next(new Error("invoice doesn't Exist"));
      }
    })
    .catch((error) => next(error));
};

exports.deleteInvoiceByID = (request, response, next) => {
  InvoiceSchema.findByIdAndDelete({ _id: request.params.id })
    .then((data) => {
      if (data != null) {
        response.status(200).json({ message: "deleted" });
      } else {
        next(new Error("invoice doesn't Exist"));
      }
    })
    .catch((error) => next(error));
};
