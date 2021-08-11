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
const port = process.env.PORT || 8080;

MongoClient.connect(process.env.REDDITCLONE_DB_URI, {
  useNewUrlParser: true
})
.catch(err => {
  console.error(err.stack);
  process.exit(1);
})

.then(async client => {
  await PostsDAO.initializeDB(client);
  await PostsCheckers.initializeDB(client);
  await UsersDAO.initializeDB(client);

  app.listen(port, () => {
    console.log(`CONNECTION SUCCESSFUL: Listening to the port ${port}`);
  })
})