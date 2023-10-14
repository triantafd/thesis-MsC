import express from "express";

const router = express.Router();

router.options("/api/users/signout", (req, res) => {
  res.sendStatus(200); 
});

router.post("/api/users/signout", (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
