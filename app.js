const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
let coom='';

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const mongoUrl = 'mongodb://localhost:27017/03-server';
let mongo;

function ConnectOne(){
    MongoClient
    .connect(mongoUrl, { useNewUrlParser: true })
    .then(function(client) {
        mongo = client.db();
    })};
ConnectOne();
app.get('/', function Index(req, res) {
    ConnectOne();
    mongo
        .collection('tasks')
        .find().toArray()
        .then(function(tasks) {

            res.render('task', { name: 'Система керування задачами',tasks:tasks });
        });

});
app.get('/new',function (req,res) {
    ConnectOne();
    res.render('new');
} );
app.post('/new', function(req, res) {

    mongo
        .collection('tasks')
        .insertOne({
            name: ` ${req.body.name}`,

        })//new task
        .then(function() {
            res.redirect('/');
        });

});
app.get("/:id/delete", function(req, res) {
    console.log(req.body.name);
    mongo
        .collection('tasks')
        .deleteOne({ _id: ObjectId(req.params.id)})
        .then(function() {
            res.redirect('/');
        });

});
app.get(`/:id`,function (req,res) {
    ConnectOne();
    const ObjectId = mongodb.ObjectId;

    mongo
        .collection('tasks')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(function(task) {
                 res.render('show', {task});

        });

});
app.get(`/:id/update`,function (req,res) {
    ConnectOne();


    mongo
        .collection('tasks')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(function(task) {
                 res.render('update', {task});


        });

});
app.get("/:id/updateOne", function(req, res) {
    console.log(req.body.name);
    mongo
        .collection('tasks')
        .updateOne({ name: req.body.name }, { name: req.body.nameChange })
        .then(function() {
            res.redirect('/');
        });

});

app.listen(3000);
