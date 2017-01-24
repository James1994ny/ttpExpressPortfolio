var pg = require('pg');       //pg is requred to help link postgres
var express = require('express'); //express is to help link express

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//npm install body-parser --save
//npm install express --save
//npm install ejs --save
//npm install pg --save
//tables are in database: portfolio in postgres
app.set('view engine', 'ejs') //This is to link the html page to the sender
app.set('views', './views') //Make sure to create a views folder with the .ejs files in it
app.use(express.static(__dirname + '/public')); // References the CSS to the ejs files


//Homepage
app.get('/', function(req, res){      //Once node index.js is running. http://localhost:3000/ should return the page. hence the '/' which referres to just localhost:300 page
res.render('index')
  })

//projects page
app.get('/projects', function(req, res){      //Once node index.js is running. http://localhost:3000/ should return the page. hence the '/' which referres to just localhost:300 page
  pg.connect('postgres://postgres:12345@localhost:5432/portfolio', function(err, client, done){ //user name is postgres: and password is 12345  \conninfo on psql to get the username info. \password to change the password database is called test
          client.query('SELECT * FROM PROJECTS', function(err, result) {          //Selects * from the project table aka sql command
              res.render('projects',{ data: result.rows});                       //Links my projects.ejs file and shows data related to that file.
            console.log(result.row)
            done();
            pg.end();
          })
        })
      })





      // post a blog on about.ejs
      app.post('/about', function(req,res){  //Reads stuff from the locahost location /
        pg.connect('postgres://postgres:12345@localhost:5432/portfolio', function(err, client, done){ //Connects to the database
          client.query(`insert into post(title,body) values('${req.body.title}','${req.body.body}')` , function(err, result){  //inserts into the message table. Note the ${req.body.title etc is form the body-parser.
            //We referenced body parser above. It automatically looks into my views ejs folders and finds form names with "title" and "body" and adds it to my message table.
            console.log(err);
            res.redirect('/about');
            done();
            pg.end();
          })
        })
      })


      // retrives info on /about page
      app.get('/about', function(req, res){      //Once node index.js is running. http://localhost:3000/ should return the page. hence the '/' which referres to just localhost:300 page
        pg.connect('postgres://postgres:12345@localhost:5432/portfolio', function(err, client, done){ //user name is postgres: and password is 12345  \conninfo on psql to get the username info. \password to change the password database is called test
          client.query('SELECT * FROM POST', function(err, result) {          //Selects * from the jmztable aka sql command
            res.render('about', { data: result.rows});                       //Links my home.ejs file and shows data related to that file.
            console.log(result.rows)
            done();
            pg.end();

          })
        })
      })

//Click on title to pull up project info.
app.get('/projects/:id', function(req,res){  //Creates a page for http://localhost:3000/1 2 3 ....
    pg.connect('postgres://postgres:12345@localhost:5432/portfolio', function(err, client, done){ //Connects to the database
    var project_id = req.params.id //the req.params.id referes to the id value of /:id
    console.log(project_id)
    client.query(`select * from projects where id = '${project_id}'`, function(err,result){
      res.render('showProject', { data: result.rows[0]})
      console.log(result.rows);
      done();
      pg.end();
    })
  })
})

//Click on title to pull up about blog post info.
app.get('/about/:id', function(req,res){  //Creates a page for http://localhost:3000/1 2 3 ....
    pg.connect('postgres://postgres:12345@localhost:5432/portfolio', function(err, client, done){ //Connects to the database
    var post_id = req.params.id //the req.params.id referes to the id value of /:id
    console.log(post_id)
    client.query(`select * from post where id = '${post_id}'`, function(err,result){
      res.render('showPost', { data: result.rows[0]})
      console.log(result.rows);
      done();
      pg.end();
    })
  })
})







app.listen(3000, function(){  //When you upload to heroku, set app.listen(port,function...  )
  console.log("Listening on port 3000")
})
