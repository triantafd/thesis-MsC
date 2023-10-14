/** @format */

import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "thesis-common";

import { Password } from "../services/password";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("mpika mesa");
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    console.log("Invalid credentials");

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    console.log("Invalid passwordsMatch");
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    console.log("JWT KEY", process.env.JWT_KEY);

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    console.log("existingUser KEY", req, existingUser);
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
