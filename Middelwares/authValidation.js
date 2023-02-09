const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

module.exports = (request, response, next) => {
    try {
        let token = request.get("authorization").split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        request.id = decoded.id;
        request.role = decoded.role;
        console.log(request.id);
        console.log(request.role);
    } catch (error) {
        error.status = 403;
        error.message = 'Not Authorized';
        next(error);
    }
    next();
}
module.exports.checkAdminPatient = (request, response, next) => {
    if (request.role == 'Admin' || request.role == 'Patient') {
        next();
    } else {
        let error = new Error(`Not Authorized to do this action`);
        error.status = 403;
        next(error);
    }
}


module.exports.checkAdminDoctor = (request, response, next) => {
    if (request.role == 'Doctor' || request.role == 'Admin') {
        next();
    } else {
        let error = new Error(`Not Authorized to do this action`);
        error.status = 403;
        next(error);
    }
}

module.exports.checkAdminEmployee = (request, response, next) => {
    if (request.role == 'Employee' || request.role == 'Admin') {
        next();
    } else {
        let error = new Error(`Not Authorized to do this action`);
        error.status = 403;
        next(error);
    }
}

module.exports.checkAdminDoctorEmployee = (request, response, next) => {
    if (request.role == 'Admin' || request.role == 'Employee' || request.role == 'Doctor') {
        next();
    } else {
        let error = new Error(`Not Authorized to do this action`);
        error.status = 403;
        next(error);
    }
}
module.exports.checkAdmin = (request, response, next) => {
    if (request.role == 'Admin') {
        next();
    } else {
        let error = new Error(`Not Authorized to do this action`);
        error.status = 403;
        next(error);
    }
}


module.exports.checkEmployee = (request, response, next) => {
    if (request.role == 'Employee') {
        next();
    } else {
        let error = new Error(`Not Authorized to do this action`);
        error.status = 403;
        next(error);
    }
}




// module.exports.checkPatient = (request, response, next) => {
//     if (request.role == 'Patient') {
//         next();
//     } else {
//         let error = new Error(`Not Authorized to do this action`);
//         error.status = 403;
//         next(error);
//     }
// }