import UsersDAO from "../dao/usersDAO.js";
import bcrypt from "bcrypt";
import { response } from "express";

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

  static async APIauthenticate(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const databaseResponse = await UsersDAO.checkUser(username, password);

    if (databaseResponse === false) {
      res.status(400).json({
        error: "User not found!"
      })
    } else { 
      const passwordValidity = await UsersDAO.checkPassword(username, password);
      
      if (passwordValidity === false) {
        res.status(400).json({
          error: "Password incorrect!"
        })
      } else {
        res.status(200).json({
          status: "Logged in!"
        })
      }
    }
  }
}