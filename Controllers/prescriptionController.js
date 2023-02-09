const { request, response } = require("express");
const { Result } = require("express-validator");
const mongoose = require("mongoose");
require("./../Models/prescriptionModel");
const prescriptionSchema = mongoose.model("prescription");

// export all data about prescription
exports.getAllPrescription = async(request, response, next) => {
    let sortBy,
        feilds,
        removeFields = ["select", "sort"],
        reqQuery = {...request.query }; //spread operator to get the data of the object
    // remove the filters from the query
    removeFields.forEach((param) => {
        delete reqQuery[param];
    });
    // including mongo operators
    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    // select
    if (request.query.select) {
        feilds = request.query.select.split(",").join(" ");
    }
    // sort
    if (request.query.sort) {
        feilds = request.query.sort.split(",").join(" ");
    } else {
        sortBy = request.body.id;
    }
    await prescriptionSchema
        .find(JSON.parse(queryString))
        .populate({ path: "doctorId", select: ["firstName", "lastName"] })
        .populate({ path: "patientId", select: ["lastName", "Fname", "Lname", "Age"] })
        .populate({ path: "clinicId", select: ["name", "department", "address", "telephoneNumber"] })
        .populate({ path: "medicineId", select: { name: 1 } })
        .select(feilds)
        .sort(sortBy)
        .then((result) => {
            response.status(200).json({ success: true, result });
        })
        .catch((error) => {
            next(error);
        });
};
// adding a new prescription
exports.addPrescription = async(request, response, next) => {
    let newPrescription = await new prescriptionSchema({
        doctorId: request.body.doctorid,
        patientId: request.body.patientid,
        clinicId: request.body.clinicid,
        medicineId: request.body.medicineid,
        prescriptionDate: request.body.prescriptiondate,
    });
    newPrescription
        .save()
        .then((result) => {
            response.status(201).json({ success: true, message: "Prescription has been added" });
        })
        .catch((error) => {
            next(error);
        });
};
//update prescription
exports.updatePrescription = (request, response, next) => {
    // prescriptionSchema
    //     .updateOne({ _id: request.body.id }, {
    //         $set: {
    //             doctorId: request.body.doctorid,
    //             patientId: request.body.patientid,
    //             clinicId: request.body.clinicid,
    //             medicineId:request.body.medicineid,
    //             prescriptionDate: request.body.prescriptiondate
    //         },
    //     })
    const { id } = request.body
    prescriptionSchema.findByIdAndUpdate(id, request.body, { new: true })
        .then(() => {
            response.status(200).json({ success: true, message: "Prescription has been updated" });
        })
        .catch((error) => {
            next(error);
        });
};

// delete prescription
exports.deletePrescription = (request, response, next) => {
    prescriptionSchema
        .deleteOne({ _id: request.params.id })
        .then((result) => {
            response
                .status(201)
                .json({ result, message: "Prescription has been deleted" });
        })
        .catch((error) => next(error));
};

// get prescription by id
exports.getPrescriptionById = (request, response, next) => {
    prescriptionSchema
        .findOne({ _id: request.params.id })
        .then((result) => {
            if (result != null) {
                response.status(200).json({ message: "Found", result });
            } else {
                next(new Error("Prescription doesn't exist"));
            }
        })
        .catch((error) => {
            next(error);
        });
};