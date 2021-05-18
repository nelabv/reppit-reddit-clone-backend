// Connecting to the database
// This creates a server and initializes routes

import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import PostsDAO from "./dao/postsDAO.js";
dotenv.config();

const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

// vvvv This is where the connection occurs

MongoClient.connect(process.env.REDDITCLONE_DB_URI, {
  useNewUrlParser: true
})
.catch(err => {
  console.error(err.stack);
  process.exit(1);
})

// vvvv After successfully connecting to the database, start the server.
.then(async client => {
  // vvvv Immediately fetch data from the database once the connection has been established.
  await PostsDAO.initializeDB(client);

  app.listen(port, () => { // Specifying the routes made
    console.log(`Listening to the port ${port}`);
    // Now connected to the database
  })
})