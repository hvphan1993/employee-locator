const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require("./db/connection");
const apiRoutes = require("./routes/apiRoutes");
const inquirerPrompts = require("./lib/prompts");

// Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Use apiRoutes
// app.use("/api", apiRoutes);

// Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
