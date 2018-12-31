const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const models = require('express-cassandra');
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



models.setDirectory( __dirname + '/models').bind(
    {
        clientOptions: {
            contactPoints: ['127.0.0.1'],
            protocolOptions: { port: 9042 },
            keyspace: 'mykeyspace',
            queryOptions: {consistency: models.consistencies.one}
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe'
        }
    },
    function(err) {
        if(err) throw err;

        // You'll now have a `person` table in cassandra created against the model
        // schema you've defined earlier and you can now access the model instance
        // in `models.instance.Person` object containing supported orm operations.
    }
);


app.get('/findOneBook',function(req,resp){
models.instance.Book.findOne({id:parseInt(req.query.id)},function(err,result){
if(err){
console.log("error: ----> "+err);
resp.end("error: "+err);
}else{
    console.log("got the data:  "+result);
    resp.setHeader('Content-Type', 'application/json');
    resp.end(JSON.stringify(result));
}
});
});
app.post('/savebook',function(req,res){
    var book1 = new models.instance.Book({
        name: req.body.name,
        genre: req.body.genre,
        id: req.body.id,
        authorId:req.body.authorId
    });
    book1.save(function(err){
        if(err) {
            console.log(err);
            res.end("error: "+err);
        }
        console.log('Yuppiie!');
        res.end("success");
    });
    
});

app.post('/saveauthor',function(req,res){
var author = new models.instance.Author({
    name:req.body.name,
    age:req.body.age,
    id:req.body.id
});
author.save(function(err){
if(err){
console.log(err);
res.end("error: "+err);
}
console.log("yuppiie");
res.end("yuppiie");
});
});

app.use('/graphql', graphqlHTTP({
schema,
graphiql:true
}));


app.listen(7800,()=>{
    console.log("server listening to port 7800");
});