const router = require("express").Router();

const Users = require("./userDb.js");

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

// GET /users
router.get("/", (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const userId = req.params.id;
  Users.getById(userId)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved" });
    });
});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  let id = req.params.id;

  Users.getById(id)
    .then(user => {
      console.log(user);
      if (user) {
        req.user = user;
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(error =>
      res.status(500).json({ message: "The user could not be retrieved" })
    );

  next();
}

function validateUser(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "missing user data" });
  }
  if (!req.params.name) {
    return res.status(400).json({ message: "missing required name field" });
  }

  next();
}

function validatePost(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "missing post data" });
  }
  if (!req.params.text) {
    return res.status(400).json({ message: "missing required text field" });
  }

  next();
}

module.exports = router;
