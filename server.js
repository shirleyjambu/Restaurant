var express = require("express");
var path = require("path");
var connection = require("./db/connection");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Views
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/html/all.html"));
});

app.get("/makeReservation", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/html/addTable.html"));
});


// API Calls
app.get("/api/all", function(req, res) {
  connection.query("SELECT * FROM tables", function(err, dbTables) {
    if(err){res.json(err)}
    res.json(dbTables);
  });
});

app.get("/api/tables", function(req, res) {
  connection.query("SELECT * FROM tables where isWaiting = '0'", function(err, dbTables) {
    if(err){res.json(err)}
    res.json(dbTables);
  });
});

app.get("/api/waitlist", function(req, res) {
  connection.query("SELECT * FROM tables where isWaiting = '1'", function(err, dbTables) {
    if(err){res.json(err)}
    res.json(dbTables);
  });
});

// Make Reservation
app.post("/api/reserve", function(req, res) {
  console.log("In reservation");
  console.log("req.body:before", req.body);
  var isWaiting = 0;
  connection.query("select count(*) as count from tables where isWaiting = 0",function(err,result){
    if(err) throw err;
    if(result[0].count > 5){
      isWaiting = 1;
    };

    // Insert into table after setting the isWaiting Value
    req.body.isWaiting = isWaiting;
    console.log("req.body:after", req.body);
    connection.query("INSERT INTO tables SET ?", req.body, function(err, result) {
      if (err) throw err;

      res.json(result);
    });
  });
  
});

//Delete Table
app.post("/api/delete", function(req, res) {
  console.log("In delete");
  console.log("req.body:before", req.body.tableId);
  connection.query("delete from tables where ?",[{id:req.body.tableId}],function(err,result){
    if(err) throw err;
    res.json(result);
  });
});

/*app.get("/add", function(req, res) {
  res.sendFile(path.join(__dirname, "add.html"));
});

app.get("/all", function(req, res) {
  res.sendFile(path.join(__dirname, "all.html"));
});


app.get("/api/characters/:character", function(req, res) {

  connection.query("SELECT * FROM characters WHERE name = ? LIMIT 1", [req.params.character], function(err, dbCharacter) {
    if (err) throw err;

    if (dbCharacter[0]) {
      res.json(dbCharacter[0]);
    } else {
      res.json(null);
    }
  });
});

*/

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


