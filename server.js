'use strict'
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const server = express();
require('dotenv').config();
server.use(express.json());
server.use(cors());
const PORT = process.env.PORT;

mongoose.connect(`${process.env.MONGODB_ATLAS}`, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: String,
    name: String,
    image: String,

});


const UserModel = mongoose.model("Product", UserSchema);

function seedData() {
    const dua = new UserModel({
        email: 'duajaradat164@gmail.com',
        name: 'kinder chocoholate',
        image: 'https://www.luluhypermarket.com/medias/25564-01.jpg-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wxNjkzODZ8aW1hZ2UvanBlZ3xpbWFnZXMvaDYxL2gzYi85MDgxMjY3OTEyNzM0LmpwZ3w2NThjODg3NmZkODJiMWIzYWQ5MTAxNzRmOTBjMjUxYTNhZTYzMjFjN2QyZTBjYzI3NzllOTBlOGFlMDFjOTJm',
    })
    dua.save();
}
// seedData();

class Photo {
    constructor(name, image) {
        this.name = name;
        this.image = image;
    }
}

//API
// get data from API 
server.get('/dataApi', getDataFromAPI);
async function getDataFromAPI(req, res) {
    let userData = await axios.get(`https://ltuc-asac-api.herokuapp.com/allChocolateData`);
    let data = userData.data.map(photo => {
        return new Photo(photo.title, photo.imageUrl)
    })
    console.log(data)
    res.status(200).send(data)
}

//  User , Database

// get myfav from database
//http://localhost:3003/myfav/:email
server.get('/myfav/:email ', getMyFav);

function getMyFav(req, res) {
    console.log('yyyyyyyyyyyyyyyyy')
    const userEmail = req.params.email;
    UserModel.find({ email: userEmail }, (err, data) => {
        if (err) {
            res.status(404).send("ERROR");
        } else {
            console.log(data);
            res.send(data)
        }
    })
}

server.post('/addtomyfav/:email ', addToMyFav);

function addToMyFav(req, res) {
    const userEmail = req.params.email;
    const { name, image } = req.body;
    const newUser = new UserModel({
        email: userEmail,
        name: name,
        iamge: image,
    })
    newUser.save();
    UserModel.find({ email: userEmail }, (err, data) => {
        if (err) {
            res.status(404).send("ERROR");
        } else {
            console.log(data);
            res.send(data)
        }
    })
}





//  http://localhost:3003/
server.get('/', function (req, res) {
    res.send('its working')
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})