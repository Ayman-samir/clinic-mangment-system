const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_51MYmKEKRu4D4e0ovwJk7CNhg3Lj1ov5Ox0SBPQIYwxCrXRimvxxi7APbLPIwV6tEDzMXOYbYAe3SY1qOnNrP4pap00DEe6ffec");
// const stripe = Stripe(process.env.STRIPE_KEY_SECRET);
const errorResponse = require("../Middelwares/errorValidation");

require("../Models/patientModel");
require("../Models/doctorsModel");
require("../Models/invoiceModel");

const { response } = require("express");

const patientSchema = mongoose.model("patientModel");
const doctorSchema = mongoose.model("doctors");
const prescriptionSchema = mongoose.model("prescription");
const invoiceSchema = mongoose.model("invoice");
console.log(stripe.token);
exports.pay = async(request, response, next) => {
    try {
        const prescription = await prescriptionSchema.findOne({ _id: request.params.id });
        const patientId = prescription.patientId;
        if (!patientId) {
            return next(new Error("patient doesn't exist", 404));
        }
        const doctorId = prescription.doctorId;
        if (!doctorId) {
            return next(new Error("doctor doesn't exist", 404));
        }
        const patient = await patientSchema.findOne({ _id: patientId });
        const doctor = await doctorSchema.findOne({ _id: doctorId });
        console.log(doctor)
        const number = request.body.number;
        const exp_month = request.body.exp_month;
        const exp_year = request.body.exp_year;
        const cvc = request.body.cvc;

        await stripe.tokens.create({
                card: {
                    number: number,
                    exp_month: exp_month,
                    exp_year: exp_year,
                    cvc: cvc,
                },
            },
            function(err, token) {
                if (err) return next(err);
                if (token) {
                    console.log(patient.Email);
                    stripe.customers
                        .create({
                            email: patient.Email,
                            source: token.id,
                            name: patient.Fname,
                        })
                        .then((customer) => {
                            return stripe.charges.create({
                                amount: doctor.vezeeta, // Charging Rs 25
                                currency: "USD",
                                customer: customer.id,
                            });
                        })
                        .then((charge) => {
                            console.log("helle");
                            let newInvoice = new invoiceSchema({
                                prescription: prescription._id,
                                invoiceDate: Date.now(),
                                invoiceTime: "11:00",
                                Status: "success",
                                receptionist: 1,
                                paymentMethod: "Credit Card",
                                totalPaid: doctor.vezeeta || 1200,
                            });
                            newInvoice
                                .save()
                                .then((result) => {
                                    response.status(201).json(result);
                                })
                                .catch((error) => next(error));
                        })
                        .catch((error) => {
                            let newInvoice = new invoiceSchema({
                                prescription: prescription._id,
                                invoiceDate: Date.now(),
                                invoiceTime: "11:00",
                                Status: "failed",
                                receptionist: 1,
                                paymentMethod: "Credit Card",
                                totalPaid: doctor.vezeeta || 1200,
                            });
                            newInvoice.save().then(() => {
                                next(error);
                            });
                        });
                }
            }
        );
    } catch (error) {
        next(error);
    }
};

exports.Cash = async(request, response, next) => {
    try {
        const prescription = await prescriptionSchema.findOne({ _id: request.params.id });
        const doctorId = prescription.doctorId;
        if (!doctorId) {
            return next(new Error("doctor doesn't exist", 404));
        }
        const doctor = await doctorSchema.findOne({ _id: doctorId });

        let newInvoice = new invoiceSchema({
            prescription: prescription._id,
            invoiceDate: Date.now(),
            invoiceTime: "11:00",
            Status: "success",
            receptionist: 1,
            paymentMethod: "Cash",
            totalPaid: doctor.vezeeta || 1200,
        });
        newInvoice
            .save()
            .then((result) => {
                response.status(201).json(result);
            })
            .catch((error) => next(error));
    } catch (error) {
        next(error);
    }
};