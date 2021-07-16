const {cloudinary}=require('../cloudinary')
const Campground = require('../models/campground')
const mapBoxToken=process.env.MAPBOX_TOKEN
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder=mbxGeocoding({accessToken:mapBoxToken})

module.exports.index=async (req,res)=>{
    const campground= await Campground.find()
    res.render('campground/index',{campground})  
}

module.exports.newGet=(req,res)=>{
    res.render('campground/new')
}

module.exports.newPost=async (req,res,next)=>{
    const geodata=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    
    const camp=new Campground(req.body.campground)
    camp.geometry=geodata.body.features[0].geometry
    camp.images=req.files.map(f=>({url:f.path, filename:f.filename}))
    camp.author=req.user
    await camp.save()
    console
    console.log(camp)
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campground/${camp._id}/`)
}

module.exports.showPage=async (req,res)=>{
    const {id}=req.params
    const camp=await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
    console.log(camp)
    if(!camp){
        req.flash('error','Cannot find that campground')
        res.redirect('/campground')
    }
    res.render('campground/show',{camp})
}

module.exports.editGet=async (req,res)=>{
    const {id}=req.params
    const camp=await Campground.findById(id)
    if(!camp){
        req.flash('error','Cannot find that campground')
        return res.redirect('/campground')
    }
    console.log(camp)
    res.render('campground/edit',{camp})
}

module.exports.editPut=async (req,res)=>{
    const info=req.body
    const {id}=req.params
    const camp= await Campground.findByIdAndUpdate(id,info.campground)
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}))
    camp.images.push(...imgs)
    await camp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        console.log(camp)
    }
    req.flash('success','Successfully updated the campground')
    res.redirect(`/campground/${id}`)
}

module.exports.del=async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted the campground')
    res.redirect('/campground')
}