const Mongoose= require('mongoose');
const campground = require('../models/campground');
const cities =require('./cities')
const {descriptors,area} = require('./title')


Mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('mongo connected')
})
.catch(err=>{
    console.log('error')
    console.log(err)
})

const seedDb = async ()=>{
    await campground.deleteMany({})
    for (let i=0; i<200;i++){
        
        const random1000=Math.floor(Math.random()*200)
        const priceRandom=Math.floor(Math.random()*1000)+100
        const camp = new campground ({author:'60ed74427519ce3cb8c5c4a0',location:`${cities.place[random1000].name},${cities.place[random1000].state}`,
        title:`${descriptors[Math.floor(Math.random()*descriptors.length)]} ${area[Math.floor(Math.random()*area.length)]}`,
        description:'Camping is an outdoor activity involving overnight stays away from home with or without a shelter, such as a tent or a recreational vehicle.',
        price:priceRandom,
        geometry:{
            type:"Point",
            coordinates:[cities.place[random1000].lon,cities.place[random1000].lat]
        },
        images: [
            {
              url: 'https://res.cloudinary.com/jay1912/image/upload/v1626338398/YelpCamp/zoskpto58tbysrav2yos.jpg',
              filename: 'YelpCamp/zoskpto58tbysrav2yos'
            },
            {
              url: 'https://res.cloudinary.com/jay1912/image/upload/v1626338400/YelpCamp/sym21zxnw4ah0sg6bueh.jpg',
              filename: 'YelpCamp/sym21zxnw4ah0sg6bueh'
            }
        ],

    })
    await camp.save()
    }
}
seedDb().then(()=>
Mongoose.connection.close())  