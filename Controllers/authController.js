const { request, response, json } = require("express");
const mongoose = require("mongoose");
require("../Models/authModel");
const userSchema = mongoose.model("authModel");
const jwt = require("jsonwebtoken");

exports.register = async(request, response, next) => {
    try {
        const { fname, lname, age, telephone, gender, email, password, role } = request.body;
        const user = await userSchema.create({
            fname,
            lname,
            age,
            telephone,
            gender,
            email,
            password,
            role
        });
        response.status(200).json({ success: "Success Registration" });
    } catch (error) {
        next(error)
    }

};

exports.login = async(request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            response.status(400).json({ ErrorMessage: 'Please Enter Your Email and Password' })
        }
        const user = await userSchema.findOne({ email }).select('+password');
        if (!user) {
            response.status(401).json({ ErrorMessage: 'Invalid Email' })
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            response.status(401).json({ ErrorMessage: 'Invalid Password' })
        } else {
            let token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
            if (user.role == 'Doctor') {
                response.status(200).json({ success: "Doctor", token: token });
            } else if (user.role == 'Patient') {
                response.status(200).json({ success: "Patient", token: token });
            } else if (user.role == 'Employee') {
                response.status(200).json({ success: "Employee", token: token });
            } else if (user.role == 'Admin') {
                response.status(200).json({ success: "Admin", token: token });
            }
        }
    } catch (error) {
        next(error)
    }

};



// exports.myInfo = async (request,response,next)=>{
//     const user = await userSchema.findById(request.user.id);
//     request.status(200),json({Data:userSchema})
// }