import UsersDAO from "../dao/usersDAO.js";
import bcrypt from "bcrypt";

export default class UsersController {
  static async APIregisterUser(req, res) {
    try {
      bcrypt.hash(req.body.password, 10, async function(error, hash) {
        if (error) {
          console.error(`Error in hashing password: ${e}`);
        } else {
          const user = {
            username: req.body.username,
            password: hash
          }

          const response = await UsersDAO.registerUser(user);

          if(response > 0 ) {
            res.status(400).json({ 
              error: "Username already exists!"
            })
          } else {
            res.status(200).json({
              status: "User registered successfully!"
            })  
          }
        }
      })
    } catch (e) {
      console.error(`Error in UsersController APIlogin: ${e}`);
    }
  }

  static async APIlogin(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const databaseCall = await UsersDAO.login(username, password);

    return databaseCall;
  }
}