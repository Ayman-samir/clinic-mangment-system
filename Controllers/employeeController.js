const { error } = require("console");
const { request, response } = require("express");
const { Result } = require("express-validator");
const mongoose = require("mongoose");
require("../Models/employeeModel");
const employeeSchema = mongoose.model("employee");
const jwt = require("jsonwebtoken");

//image multer ...................
const multer = require("multer")
    //const sharp = require("sharp")// this pakage for resize image to fit
const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname }-${Date.now()}.${ext}`);
    }
});
//const storage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
exports.uploadEmployeeImg = upload.single("image");

// export all data about employee
exports.getAllEmployees = async(request, response, next) => {
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
    await employeeSchema
        .find(JSON.parse(queryString)).populate({ path: "clinicId" })
        .select(feilds)
        .sort(sortBy)
        .then((result) => {
            response.status(200).json({ success: true, result });
        })
        .catch((error) => {
            next(error);
        });
};

//adding a new Employee
exports.addEmployee = async(request, response, next) => {
    let newEmployee = await new employeeSchema({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        empAge: request.body.empAge,
        empGender: request.body.empGender,
        empEmail: request.body.empEmail,
        empPassword: request.body.empPassword,
        empImage: request.body.empImage,
        empSalary: request.body.empSalary,
        empPhone: request.body.empPhone,
        clinicId: request.body.clinicid,
        role: request.body.role,
        address: {
            city: request.body.address.city,
            building: request.body.address.building,
            street: request.body.address.street
        },
    });
    newEmployee
        .save()
        .then(() => {
            response.status(201).json({ success: true, message: "Employee has been added" });
        })
        .catch((error) => {
            next(error);
        });
};

// update employee
exports.updateEmployee = (request, response, next) => {

    if (!request.file) return next();
    console.log(request.file)
        //     //console.log(req.body)

    request.body.image = request.file.filename
        // employeeSchema
        //     .updateOne({ _id: request.params.id }, {
        //         $set: {
        //             firstName: request.body.firstName,
        //             lastName: request.body.lastName,
        //             empAge: request.body.empAge,
        //             empGender: request.body.empGender,
        //             empEmail: request.body.empEmail,
        //             empPassword: request.body.empPassword,
        //             empImage: request.body.empImage,
        //             empSalary: request.body.empSalary,
        //             empPhone: request.body.empPhone,
        //             clinicId: request.body.clinicid,
        //             address: {
        //                 city: request.body.address.city,
        //                 building: request.body.address.building,
        //                 street: request.body.address.street
        //             },
        //         },
        //     })
    const { id } = request.params
    employeeSchema.findByIdAndUpdate(id, request.body, { new: true })
        .then(() => {
            response.status(200).json({ success: true, message: "Employee has been updated" });
        })
        .catch((error) => next(error));
};

// delete employee
exports.deleteEmployee = (request, response, next) => {
    employeeSchema
        .deleteOne({ _id: request.params.id })
        .then(() => {
            response.status(201).json({ success: true, message: "Employee has been deleted" });
        })
        .catch((error) => next(error));
};

// get employee by id
exports.getEmployeeById = (request, response, next) => {
    employeeSchema
        .findOne({ _id: request.params.id })
        .then((result) => {
            if (result != null) {
                response.status(200).json({ message: "Found", result });
            } else {
                next(new Error("Employee doesn't exist"));
            }
        })
        .catch((error) => next(error));
};

// upload image 
exports.uploadImage = (request, response, next) => {
        const Image = employeeSchema.findById(request.param.id);
        if (!Image) {
            console.log("not an image");
            next(error);
        }
        if (!request.files) {
            error.message = "Please, upload Image";
            error.status = 400;
            next(error);
        }
        const file = request.files.File;
        console.log("file", file);
        // validation to make sure that the uploaded file is an image 
        if (!file.mimetype.startsWith("image")) {
            error.message = "Not an image please, upload a valid image";
            error.status = 400;
            console.log("Not an image");
            next(error);
        }
        if (!file.size > process.env.FILE_SIZE) {
            error.message = `Upload a vaild size, less than ${process.env.FILE_SIZE}`; // size =  1MB
            error.status = 400;
            next(error);
        }
        // accessing the file.mv 
        file.mv(`${process.env.FILE_PATH_UPLOAD}/${file.name}`, async(error) => {
            if (error) {
                error.message = "Problem with file upload";
                error.status = 500;
                next(error);
            }
            await employeeSchema.findByIdAndUpdate(request.params.id, {
                empImage: file.name
            });
            response.status(200).json({ success: true, data: file.name });
        });

    }
    // exports.login = async(request,response,next)=>{
    //   const {empEmail,empPassword} = request.body;
    //   if(!empEmail || !empPassword)
    //   {
    //       response.status(400).json({ErrorMessage:'Please Enter Your Email and Password'})
    //   }
    //   const user = await userSchema.findOne({email}).select('+password');
    //   if(!user)
    //   {
    //       response.status(401).json({ErrorMessage:'Invalid Email'})
    //   }
    //   const isMatch = await user.comparePassword(empPassword);
    //   if(!isMatch)
    //   {
    //       response.status(401).json({ErrorMessage:'Invalid Password'})
    //   }
    //   else
    //   {
    //       let token= jwt.sign({id:user._id,role:user.role},process.env.SECRET_KEY,{expiresIn:"1h"});

//        if(user.role=='Employee')
//       {
//           response.status(200).json({success:"Employee",token:token});
//       }  
//       else
//       {
//           response.status(403).json({success:"failed"});
//       }
//   }
// };