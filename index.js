const path = require("path")
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const route = require('./src/routes/route.js')
const db = require('./src/config/database/database.js')
const app = express();
const port = 3000;

// Connect MongoDB
db.connect('nodejs_dev')

// static file public
app.use(express.static(path.join(__dirname, "public")))

// Log action
app.use(morgan("combined"));

// template engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      div: (a, b) => a % b == 0,
    }
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "resources", "views"));

// route
route(app)

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
