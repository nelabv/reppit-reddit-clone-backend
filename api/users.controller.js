import UsersDAO from "../dao/usersDAO.js";
import bcrypt from "bcrypt";
import User from "../model/user.js";

export default class UsersController {
  static async APIregisterUser(req, res) {
    try {
      bcrypt.hash(req.body.password, 10, async function(error, hash) {
        if (error) {
          console.error(`Error in hashing password: ${e}`);
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

  static async APIsignIn(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    UsersDAO.validateUser(username, password).then(async function(result){
      if (result === false) {
        res.status(400).json({ error: "User not found!" });
      } else if (result === true) {
        const passwordValidity = await UsersDAO.validatePassword(username, password);
  
        if (passwordValidity === false) {
          res.status(400).json({
            error: "Incorrect password!"
          })
        } else if (passwordValidity === true) {
          const token = await UsersDAO.grantAccess(username);
          res.status(200).json({
            status: "success",
            token
          })

          
        }
      }
    })
  }
}