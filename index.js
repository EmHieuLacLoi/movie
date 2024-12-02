const path = require("path")
const express = require("express");
const morgan = require("morgan");
const methodOverride = require('method-override')
const handlebars = require("express-handlebars");
const route = require('./src/routes/route.js')
const db = require('./src/config/database/database.js')
const app = express();
const port = 3000;

// Middleware setup - IMPORTANT: Place these BEFORE your routes
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

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
      limit: function (arr, limit) {
        if (!Array.isArray(arr)) return [];
        return arr.slice(0, limit);
      },
      json: function(context) {
        return JSON.stringify(context);
      },
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
