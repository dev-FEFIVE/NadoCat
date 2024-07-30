const conn = require("./mariadb");
const express = require("express");
const router = express.Router();
const app = express();

const getTestString = (req, res) => {
  let sql = "SELECT * FROM TestString";
  
  conn.query(sql, 
      (err, results) => {
          if (err) console.log(err);
          else {
              console.log(results);
          }
      }
  )
}


router.use(express.json());

router.get('', getTestString);

app.use("", router);

app.listen(3000);