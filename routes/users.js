const express =require('express')
const router = express.Router()
const catchAsync=require('../utils/catchAsync')
const passport = require('passport')
const user=require('../controllers/user')



router.route('/register')
    .get(user.registerGet)
    .post(catchAsync(user.registerPost))

router.route('/login')
    .get(user.loginGet)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.loginPost)

router.get('/logout',user.logout)



module.exports=router