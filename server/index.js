const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()


app.use(cors())
app.use(bodyParser.json())
dotenv.config()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const cloudSchema = new mongoose.Schema({
    name: String, 
    url: String,
  });

const blogModel = mongoose.model('Cloud', cloudSchema);

app.post(`/api/cloud`,async(req,res)=>{
    const {name,url} = req.body
    const newPost = new blogModel({
        name:name,
        url:url
    })
    await newPost.save()
    res.status(201).send({
        message:"Posted Successfully!!!",
        payload:newPost
    })
})

app.get(`/api/cloud`,async(req,res)=>{
    const{name}=req.query
    const getCloud = await blogModel.find()
    if(!name){
        res.status(200).send(getCloud)
    }
    else{
        const searched = getCloud.filter((item)=>
        item.name.toLowerCase().trim().includes(name.toLowerCase().trim())
        )
        res.status(200).send(searched)
    }
})

app.get('/api/cloud/:id',async(req,res)=>{
    const {id} = req.params
    const cloudID = await blogModel.findById(id)
    res.status(200).send(cloudID)
})

app.delete('/api/cloud/:id',async(req,res)=>{
    const id = req.params.id
    const cloudDelete = await blogModel.findByIdAndDelete(id)
    res.status(202).send(cloudDelete)
})

app.put(`/api/cloud/:id`,async(req,res)=>{
    const id = req.params.id
    const{name,url} = req.body
    const Update = {
         name : name,
         url : url,
    }
    await blogModel.findByIdAndUpdate(id,Update)
    res.status(200).send({
         message:`${Update.name} update is succesfully!`
     })
    })

PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


DB_PASSWORD = process.env.DB_PASSWORD
DB_CONNECTION = process.env.DB_CONNECTION
mongoose.connect(DB_CONNECTION.replace('<password>',DB_PASSWORD)).then(()=>{
    console.log("Mongodb Connected!!!")
});
