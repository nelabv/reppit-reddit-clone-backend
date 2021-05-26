import UsersDAO from "../dao/usersDAO.js";
import bcrypt from "bcrypt";

export default class UsersController {
  static async APIregisterUser(req, res){
    try {
      bcrypt.hash(req.body.password, 10, async function(error, hash) {
        if (error) {
          console.error(`Error in hashing password: ${e}`);
        } else {
          const user = {
            username: req.body.username,
            password: hash
          }

          const registerRequest = await UsersDAO.registerUser(user);
          res.json({
            status: "User registered!"
          })
        }
    });
    } catch(e) {
      console.error(`Error in UsersController APIregisterUser: ${e}`);
    }
  }
}