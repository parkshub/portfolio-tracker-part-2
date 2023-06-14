const express = require('express')
const jwt = require("jsonwebtoken") 
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/authMiddleware')

router.post('/registerUser', userController.registerUser)
router.post('/loginUser', userController.loginUser)
router.get('/getUser', auth, userController.getUser)

router.get('/validate-token', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.sendStatus(200);
    });
})

module.exports = router