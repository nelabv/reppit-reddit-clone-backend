// Connecting to the database
// This creates a server and initializes routes

import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import PostsDAO from "./dao/postsDAO.js";
import UsersDAO from "./dao/usersDAO.js";
import PostsCheckers from "./dao/postsDAO_checker_functions.js";
dotenv.config();

const MongoClient = mongodb.MongoClient;

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
  await PostsCheckers.initializeDB(client);
  await UsersDAO.initializeDB(client);

  app.listen(process.env.PORT || 5000, () => { // Specifying the routes made
    console.log(`Listening to the port ${port}`);
    // Now connected to the database
  })
})