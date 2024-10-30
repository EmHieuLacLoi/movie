const path = require("path")
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const route = require('./routes/route.js')
const db = require('./config/database/database.js')
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
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// route
route(app)

// const axios = require('axios');
// const BASE_URL = 'https://phimapi.com/v1/api/tim-kiem';

// app.get('/', async (req, res) => {
//   try {
//       const response = await axios.get(`${BASE_URL}`, {
//         params: {
//           keyword: 'doraemon',
//           limit: '10'
//         }
//       });

//       const movies = response.data;

//       // Render thông tin phim ra trang
//       res.send(`
//         <h1>Phim Mới Cập Nhật</h1>
//         <ul>
//             ${movies.data.items.map(movie => `
//                 <li>
//                     <strong>${movie.name}</strong> (Ngày phát hành: ${movie.slug})
//                     <p>${movie.origin_name}</p>
//                 </li>
//             `).join('')}
//         </ul>
//     `);
//   } catch (error) {
//       console.error('Error fetching movies:', error);
//       res.status(500).send('Error fetching movies.');
//   }
// });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
