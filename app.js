const db = require('./lib/db');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('views', './views');
app.set('view engine', 'jade')
app.use(bodyParser.json());
app.use(express.static('./static'));

app.use("/entry", function(req, res, next) {
  var key = process.env.KEY || require("./config/local").key;
  if (req.get("key") === key) {
    next();
  } else {
    res.json({ error:true, message:'Missing/wrong key' });
  }
});

app.post("/entry", async function (req, res) {
  if (!req.body.text) {
    return res.json({ error:true, message:'text missing' });
  }
  await db.postEntry(req.body);
  return res.json({ error:false, message:'inserted' });
});

app.get("/entry", async function (req, res) {
  return res.json(await db.getEntry({}, 50));
});

app.get("/", function (req, res) {
  res.render("app");
});

app.listen(process.env.PORT || 8080, async function () {
  console.log("Server started");
});
