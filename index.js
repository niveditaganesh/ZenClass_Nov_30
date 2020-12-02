const express=require('express')
//const{findSourceMap}=require('module') -- syntax
const app=express();
const dotenv=require('dotenv');//for hiding the cloud dbURL string
const cors=require('cors');//to avoid blocking of data when tryin to fetch the details via api from frontend
const mongodb=require('mongodb')
const mongoClient=mongodb.MongoClient;
//dbURL--local
//const dbURL='mongodb://127.0.0.1:27017';
const dbURL= process.env.DB_URL ||'mongodb://127.0.0.1:27017'; //dbUrl can be either from local or from cloud
//dbURL --cloud =>replace <passwor> with connection pasword :::::is copied to.env
//const dbURL='mongodb+srv://training-db:<password>@cluster0.ohd0y.mongodb.net/<dbname>?retryWrites=true&w=majority'


const objectId=mongodb.ObjectID
app.use(express.json());//used instead of bodyparser
app.use(cors());//avctivating cors pavckage
dotenv.config();//activating dotenv
//connection pasword:: G0xkzKuZ5ZubrOGm
app.get('/',async(req,res)=>{
  try {
      let clientInfo=await mongoClient.connect(dbURL)
      let db=clientInfo.db("studentDetails");
      let data=await db.collection('users').find().toArray();
      res.status(200).json({data})
      clientInfo.close();
  } catch (error) {
      console.log(error)
      res.send(500)
  }
})
app.post('/add-user',async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentDetails");
        let data=await db.collection('users').insertOne(req.body);
        res.status(200).json({message:"user added"})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"can't create"})
    }
})
app.get('/get-user/:id',async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentDetails");
        let data=await db.collection('users').findOne({_id:objectId(req.params.id)});
        res.status(200).json({data})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.send(500)
    }
})

app.put('/update-user/:id',async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentDetails");
        let data=await db.collection('users').findOneAndUpdate({_id:objectId(req.params.id)},{$set:req.body});
        res.status(200).json({message:"user updated"})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.send(500)
    }
})

app.delete('/delete-user/:id',async(req,res)=>{
    try {
        let clientInfo=await mongoClient.connect(dbURL)
        let db=clientInfo.db("studentDetails");
        let data=await db.collection('users').deleteOne({_id:objectId(req.params.id)});
        res.status(200).json({message:"user deleted"})
        clientInfo.close();
    } catch (error) {
        console.log(error)
        res.send(500)
    }
})
app.listen(3000,()=>{
    console.log('Server Started')
})