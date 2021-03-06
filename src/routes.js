const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const companyController = require('./controllers/companyController');
const eventController = require('./controllers/eventController');
const FAQController = require('./controllers/FAQController');
const serviceController = require('./controllers/serviceController');
const adminController = require('./controllers/adminController');
const loginController = require('./controllers/loginController');
const promotionController = require('./controllers/promotionController');
const clientController = require('./controllers/clientController');
const reviewController = require('./controllers/reviewController');
const stripe = require("stripe")("sk_test_iDQ4j6FIHxplL81qcqEtSWCU");
var config = require('../src/config/token');

router.get('/', function(req, res) {
    res.json({
        hello: 'world'
    });
});

router.post('/stripe', function(req, res) {
    stripe.customers.create({
            source: req.body.token
        })
        .then(customer =>
            stripe.charges.create({
                amount: req.body.amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            }))
        .then(charge => {
            res.json({
                error: null,
                data: charge
            });
        });
});

router.get('/company/profile', clientController.viewCompanyProfile);

router.post('/company', companyController.companySubscription);

router.get('/allEvents', eventController.getAllEvents);

router.get('/allServices', serviceController.getAllServices);

router.post('/adminRegister', adminController.adminRegister);

router.post('/adminLogin', loginController.adminLogin);

router.post('/updateEvents', eventController.updateEvents);

router.get('/companyEvents', eventController.getCompanyEvents);

router.get('/FAQView', FAQController.viewFAQs);

router.post('/register', clientController.register);

router.get('/companyLists', companyController.getCompanyList);
router.post('/clientLogin', loginController.clientLogin);

router.post('/companyLogin', loginController.companyLogin);

router.get('/getAllPromotions', promotionController.getAllPromotions);

router.post('/clientResetPassword', clientController.resetPassword);

router.post('/companyResetPassword', companyController.resetPassword);

router.post('/adminResetPassword', adminController.resetPassword);

router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token.',
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).send({
            success: false,
            message: 'No token provided.',
        });
    }
});

router.post('/faq', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            FAQController.askFAQ(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});

router.post('/faqa', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'admin') {
            FAQController.answerFAQ(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});

router.post('/review', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            reviewController.create(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});

router.post('/deleteR', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'admin') {
            reviewController.delete(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized',
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});

router.get('/viewProfile', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.viewProfile(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        })
    }
});

router.post('/updateProfile', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.updateProfile(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        })
    }
});

router.post('/deleteEvent', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            eventController.cancelEvent(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        })
    }
});

router.post('/event', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            eventController.createEvent(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.post('/clientUpdatePassword', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.updatePassword(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Couldn"t update password, internal server error',
        });
    }
});

router.post('/companyUpdatePassword', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            companyController.updatePassword(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'couldn"t update password, internal server error',
        });
    }
});

router.post('/adminUpdatePassword', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'admin') {
            adminController.updatePassword(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'couldn"t update password, internal server error',
        });
    }
});

router.post('/addToWishList', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.addToWishList(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.get('/unverifiedCompanies', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'admin') {
            adminController.unverifiedCompanies(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized.'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.post('/verifyCompanies', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'admin') {
            adminController.verifyCompanies(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized.'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.get('/viewCompanies', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'admin') {
            companyController.getCompanies(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized.'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.post('/deleteCompany', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'admin') {
            adminController.deleteCompany(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized.'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.post('/addToFavCompanies', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.addToFavCompanies(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.json(err);
    }
});

router.get('/viewMyReviews', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            companyController.viewReviews(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized.'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

router.post('/postPromotion1', function(req, res) {
    try {

        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            promotionController.postPromotion(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not post promotion',
        });
    }
});

router.post('/updatePromotion1', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            promotionController.updatePromotion(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not update promotion',
        });
    }
});

router.get('/viewPromotions1', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            promotionController.viewPromotions(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not view promotions',
        });
    }
});

router.post('/deletePromotion1', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            promotionController.deletePromotion(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not delete promotion',
        });
    }
});

router.get('/getCompanyEvents', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            eventController.getCompanyEvents(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'No events available for you',
        });
    }
});

router.post('/viewRatings', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            reviewController.viewRatings(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'No reviews available',
        });
    }
});

router.post('/updateEvents', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            res.json({
                success: true,
                msg: 'Company info updated successfully',
            });
            eventController.updateEvents(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not update event',
        });
    }
});

router.post('/createService', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            serviceController.createService(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not create service',
        });
    }
});

router.post('/updateService', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            serviceController.updateService(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not update service',
        });
    }
});

router.post('/deleteService', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            serviceController.deleteService(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not delete service',
        });
    }
});

router.get('/viewServices', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            serviceController.viewServices(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not view services',
        });
    }
});

router.get('/viewMyProfile', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'company') {
            companyController.viewMyProfile(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        })
    }
});
router.post('/bookEvent', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.addToBookedEvents(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/bookedEvents', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.myBookedEvents(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/bookedServices', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.myBookedServices(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/bookService', function(req, res) {
    try {
        const decodedPayload = req.decoded;
        if (decodedPayload.role === 'client') {
            clientController.addToBookedServices(req, res);
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
