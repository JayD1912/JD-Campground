const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campground')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})



router.get('/', catchAsync(campgrounds.index))

router.route('/new')
    .get(isLoggedIn, campgrounds.newGet)
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.newPost))


router.get('/:id', catchAsync(campgrounds.showPage))


router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.editGet))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.editPut))

router.delete('/:id/delete', isLoggedIn, isAuthor, catchAsync(campgrounds.del))

module.exports = router