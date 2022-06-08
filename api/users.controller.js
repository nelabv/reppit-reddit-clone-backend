import UsersDAO from "../dao/usersDAO.js";
import bcrypt from "bcrypt";
import User from "../model/user.js";

export default class UsersController {
  static async APIfetchUserInformation(req, res, next){
    const username = req.params.username;

    try {
      const user = await UsersDAO.fetchUserInformation(username);

      res.status(200).json(user);
    } catch(error) {
      res.status(400).json({
        error
      })
    }
  }

  static async APIregisterUser(req, res) {
    try {
      bcrypt.hash(req.body.password, 10, async function(error, hash) {
        if (error) {
          res.status(400).json({ 
            status: "Error in hashing password!",
            error
          })
        } else {
          const user = new User({
            username: req.body.username,
            password: hash,
            dateCreated: new Date()
          });

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

    UsersDAO.validateUser(username, password).then(async function(result){
      if (!result) {
        res.status(400).json({ 
          status: "not found",
          error: "User not found/registered!" });
      } else if (result) {
        const passwordValidity = await UsersDAO.validatePassword(username, password);
  
        if (!passwordValidity) {
          res.status(400).json({
            status: "incorrect",
            error: "Incorrect password!"
          })
        } else if (passwordValidity) {
          const token = await UsersDAO.grantAccess(username);

          res.status(200).json({
            status: "success",
            token,
            username
          })
        }
      }
    })
  }
}