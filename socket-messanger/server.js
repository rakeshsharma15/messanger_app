var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')



app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
mongoose.Promise = Promise

var Message = mongoose.model('Message',{
    name:String,
    messages:String
})

app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{
           res.send(messages)
    })
})

app.post('/messages',(req,res)=>{
    var messages = new Message(req.body)
    messages.save().then((err)=>{
    io.emit('message',req.body)
    res.sendStatus(200)
    })
   .catch((err)=>{
    sendStatus(500)
   }) 
})

io.on('connection',(socket)=>{
    console.log('a user connected')
})

mongoose.connect('mongodb://localhost:27017/chat',{useNewURLParser:true,useUnifiedTopology:true})
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',()=>{
    console.log('db connected')
})

http.listen(3000,()=>{
    console.log('listening to the port')
})