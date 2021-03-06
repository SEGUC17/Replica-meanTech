const Admin = require('../models/Admin');
const Company = require('../models/Company');
const companyController = require('../controllers/companyController');
const bcrypt = require('bcryptjs');

const adminController = {


    adminRegister: function (req, res) {
        const admin = new Admin({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            securityQuestion: req.body.securityQuestion,
            questionAnswer: req.body.questionAnswer,
        });
       bcrypt.genSalt(10, function (err, salt) {
           bcrypt.hash(admin.password, salt, function (err, hash) {
                //if (err) throw err;

                admin.password = hash;
                admin.save(function (err, admin) {
                    if (err) {
                        if (err.errors != null) {
                            if (err.errors.email) {
                                res.status(500).json({
                                    success: false,
                                    message: err.errors.email.message,
                                });
                            } else if (err.errors.username) {
                                res.status(500).json({
                                    success: false,
                                    message: err.errors.username.message,
                                });
                            }
                        } else {
                            res.status(500).json({
                                success: false,
                                message: 'Error registering data',
                            });
                        }
                    } else {
                        res.json({
                            success: true,
                            message: 'Admin registered.',
                        });
                    }
                });
           });
        });
    },

    getAdminByUsername: function (username, callback) {
        const query = {
            username: username,
        };
        Admin.findOne(query, callback);
    },


    comparePassword: function (candidatePassword, hash, callback) {
        bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
            if (err) throw err;
            callback(null, isMatch);
        });
    },

    unverifiedCompanies: function (req, res) {
        const verified = false;

        companyController.getUnverfiedCompanies(verified, function (err, Company) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json({
                    data: Company
                });
            }
        });
    },

    verifyCompanies: function (req, res) {
        const username = req.body.username;
        const verified = req.body.verified;

        companyController.getCompanyByUsername(username, verified, function (err, Company) {
            if (err) {
                res.status(500).json(err);
            } else {

                if (Company) {
                    Company.save(function (err, Company) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                msg: 'Company was not verified review the username given.'
                            });
                        } else {
                            res.json({
                                success: true,
                                msg: 'complete.'
                            });
                        }
                    });
                } else {
                    res.status(500).json({msg: 'Company not found review username'});
                }

            }
        });
    },

    deleteCompany: function (req, res) {
        const username = req.body.username;

        companyController.getCompanyAndRemove(username, function (err, Company) {
            if (Company) {
                if (err) {
                    res.status(500).json('something went wrong :|');
                } else {
                    res.json('Company deleted');
                }
            } else {
                res.status(500).json('Company not found.')
            }
        });
    },



    updatePassword: function (req, res) {
        let pass = "";

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.newPassword, salt, function (err, hash) {
                pass = hash;
                Admin.findOneAndUpdate({
                    username: req.decoded.username
                }, {
                    $set: {
                        "password": pass
                    }
                }, function (err, admin) {

                    if (err) {
                        res.status(500).json({
                            success: false,
                            msg: 'You are not allowed to change the password, update failed',
                        });
                    } else {

                        res.json({
                            success: true,
                            msg: 'The password has been updated successfully'
                        });

                        admin.markModified('Password ok');
                    }
                });
            });
        });
    },

    resetPassword: function (req, res) {
        let pass = "";

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.newPassword, salt, function (err, hash) {
                pass = hash;
                Admin.findOne({
                    username: req.body.username
                }, function (err, admin) {
                    if (err) res.status(500).json({
                        success: false,
                        message: 'Error'
                    });

                    if (!admin) {
                        res.status(404).json({
                            success: false,
                            message: 'Username not found',
                        });
                    } else if (admin) {
                        if (admin.questionAnswer != req.body.questionAnswer) {

                            res.status(401).json({
                                success: false,
                                message: 'Authentication failed. Wrong Security Answer.',
                            });
                        } else {
                            Admin.findOneAndUpdate({
                                username: req.body.username,
                            }, {
                                $set: {
                                    'password': pass,
                                },
                            }, function (err, admin) {
                                if (err) {
                                    res.status(500).json({
                                        success: false,
                                        msg: 'You are not allowed to change the password, update failed',
                                    });
                                } else {
                                    res.json({
                                        success: true,
                                        msg: 'The password has been updated successfully'
                                    });
                                    admin.markModified('Password reset ok');
                                }
                            });

                        };

                    }

                });
            })
        })

    },

};

module.exports = adminController;