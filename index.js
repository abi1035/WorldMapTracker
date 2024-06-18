import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

var countriesVisited=[]
var countryCode=[]

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "*****",
  host: "*****",
  database: "****",
  password: "******",
  port: 5432,
});

db.connect();


db.query("SELECT country_code FROM visited_countries", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    countriesVisited = res.rows;
  }
  // db.end();
});


  

app.get("/", async (req, res) => {
  //Write your code here.
  // console.log(countriesVisited);
  // var country_code=countriesVisited[0];
  // console.log(country_code);
  // console.log(countriesVisited)
  await countryLoop();
  
  var totalVisited=countriesVisited.length;
  res.render("index.ejs",{countries:countryCode, total:totalVisited})
});

async function countryLoop(){
  countriesVisited.forEach(i=>{
    countryCode.push(i.country_code);
    
  }
  )
  console.log(countryCode);
  }
// Adding New countries
  app.post("/add", async (req,res)=>{
    var input=req.body.country;
    console.log(input);
    try{
    var result= await db.query( "SELECT country_code FROM countries WHERE country_name = $1", [input])
    // console.log(result.rows);
    if(result.rows[0].country_code!=0){
      db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",[result.rows[0].country_code,])
      // countryCode.push(result.rows[0].country_code)
      // console.log(result.rows[0]);
      countriesVisited.push(result.rows[0]);
    }else if (err) {
    console.error("Error executing query", err.stack);
    };
    res.redirect("/");
// Basically this checks to see if the country exists against the table, if it doesnt exist we catch that error here
  } catch(err){
    console.log(err);
    const countries = await countryLoop();
    res.render("index.ejs", {
      countries: countries,
      total: countriesVisited.length,
      error: "Country name does not exist, try again.",
    });
  }
  })

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
