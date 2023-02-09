const { request, response } = require("express");
const { body } = require("express-validator");
const mongoose = require("mongoose");
const { param } = require("./../Routes/ClinicRouter");
require("./../Models/ClinicModel");
const clinicSchema = mongoose.model("clinic");

exports.getAllClinic = (request, response, next) => {
    let query;
    // copy request query
    const reqQuery = {...request.query };
    // field to exclude
    const removeFields = ["select", "sort"];
    //loop over removeField and delete the from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // create query string
    let queryStr = JSON.stringify(reqQuery);
    //create operator ($gt,gte,lt,lte,in)
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    // find resource
    query = clinicSchema.find(JSON.parse(queryStr));
    //select field
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
    clinicSchema
        .find().populate({ path: "doctor", select: ["firstName", "lastName", "email", "age", "gender"] })
        .then((data) => {
            response.status(200).json({ message: "All Clinic", data });
        })
        .catch((error) => {
            next(error);
        });
};
exports.addClinic = async(request, response, next) => {
    let ClinicObject = await new clinicSchema({
        name: request.body.name,
        department: request.body.department,
        address: request.body.address,
        doctor: request.body.doctor,
        telephoneNumber: request.body.telephoneNumber,
    });
    ClinicObject.save()
        .then((data) => {
            response.status(201).json({ message: "add new clinic", data: data });
        })
        .catch((error) => {
            next(error);
        });
};
exports.updateClinic = (request, response, next) => {
    clinicSchema
        .updateOne({ _id: request.body.id }, {
            $set: {
                name: request.body.name,
                department: request.body.department,
                address: request.body.address,
                doctor: request.body.doctor,
                telephoneNumber: request.body.telephoneNumber,
            },
        })
        .then((data) => {
            if (data.modifiedCount == 0) throw new Error("clinic not found");
            response.status(200).json({ message: "update" });
        })
        .catch((error) => {
            next(error);
        });
};
exports.deleteClinic = (request, response) => {
    clinicSchema
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

exports.getClinicID = async(request, response, next) => {
    try {
        const { id } = request.params
        const clinic = await clinicSchema.findById(id).populate({ path: "doctor", select: ["firstName", "lastName", "email", "age", "gender"] })
        response.status(201).json({
            status: "successed",
            data: clinic
        });
    } catch (error) {
        next(error);
    }

};