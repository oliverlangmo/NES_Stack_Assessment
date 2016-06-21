var express =require('express');
var app = express();
var path =require('path');
var bodyParser=require('body-parser');
var pg=require('pg');
var urlencodedParser=bodyParser.urlencoded({extended: false});
var connectionString = 'postgres://localhost:5432/zoo_keeper';
var animalNum = require('../modules/animalNum');


app.listen(3000, 'localhost', function(){
  console.log('server is listening on 3000');
});

app.use(express.static('public'));

app.get('/', function(req,res){
  console.log('in base url');
  res.sendFile(path.resolve('views/index.html'));
});
app.post('/addAnimal', urlencodedParser, function(req, res){
  var quantity = animalNum(1,100);
  console.log( 'in POST addNew: ' + req.body.newAnimal + " quantity: " + quantity );
      pg.connect( connectionString, function( err, client, done ){
        if( err ) console.log( err );
        else client.query( 'INSERT INTO animals_in_zoo ( animal_type, animal_quantity ) VALUES ($1, $2)', [ req.body.newAnimal, quantity] );
        done();
      });
      
});
app.get('/getAnimals', function(req, res){
console.log('/get animals');
var results=[];
pg.connect( connectionString, function(err, client, done){
  var query = client.query('SELECT * from animals_in_zoo');
  query.on('row', function(row){
    results.push(row);
  });
  query.on('end', function() {
    done();
  return res.json(results);
        }); // end onEnd
});
});
