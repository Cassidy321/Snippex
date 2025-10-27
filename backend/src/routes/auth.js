const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(
        `http://localhost:3000/auth/callback?error=${error.message}`
      );
    }
  }
);

module.exports = router;
