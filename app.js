var express = require('express')
var hbs = require('hbs')
//liên kết đường dẫn
var app= express()
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partial')
//kết nối mongodb 
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://tienhq456:123456789a@cluster0.xkq2s.mongodb.net/test';  
//trang chủ
app.get('/', async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("web");
    let results = await dbo.collection("tienhq").find({}).toArray();
    res.render('index',{model:results})
})
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/insert',(req,res)=>{
    res.render('insert')
})


app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let newProduct =  {
        name : nameInput,
        price: priceInput,
        color: colorInput
    }
        let client= await MongoClient.connect(url);
        let dbo = client.db("web");
        await dbo.collection("tienhq").insertOne(newProduct);
        res.redirect('/')
    }
    
)

app.get('/delete', async (req,res)=>{
    //id: string from URL
    let id = req.query.id;
    //convert id from URL to MongoDB' id
    let ObjectID = require('mongodb').ObjectID(id);
    //the conditon to delete
    let condition = {'_id': ObjectID}
    let client= await MongoClient.connect(url);
    let dbo = client.db("web");
    await dbo.collection("tienhq").deleteOne(condition);
    res.redirect('/');

})



const PORT = process.env.PORT || 3000;
app.listen(PORT)
console.log('Server is running')