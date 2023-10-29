/** @format */

import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "thesis-common";

import { createSingleImageRouter } from "./routes/new";
import { showSingleImageRouter } from "./routes/show";
import { indexSingleImageRouter } from "./routes/index";
import { deleteAllImagesRouter } from "./routes/deleteAll";
import { deleteSingleImageRouter } from "./routes/delete";

import cors from "cors";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Enable credentials (cookies) in CORS
};

const app = express();
app.use(cors(corsOptions));
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    name: "session",
    signed: false,
    secure: process.env.NODE_ENV === "test",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(currentUser);

app.use(createSingleImageRouter);
app.use(showSingleImageRouter);
app.use(indexSingleImageRouter);
app.use(deleteAllImagesRouter);
app.use(deleteSingleImageRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
