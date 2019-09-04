const router = require("express").Router();

const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

// POST /users
router.post("/", validateUser, (req, res) => {
  const user = req.body;

  Users.insert(user)
    .then(user => res.status(201).json(user))
    .catch(error =>
      res
        .status(500)
        .json({ error: "The user could not be posted to the database" })
    );
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const newPost = req.body;
  console.log(req.user);
  newPost.user_id = req.user.id;
  console.log(req.body);

  Posts.insert(newPost)
    .then(post => res.status(201).json(post))
    .catch(error =>
      res
        .status(500)
        .json({ error: "The post could not be posted to the database" })
    );
});

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

router.get("/:id/posts", validateUserId, (req, res) => {
  const userId = req.params.id;

  Posts.getById(userId)
    .then(posts => res.status(200).json(posts))
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user's posts could not be retrieved" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const userId = req.params.id;

  Users.remove(userId)
    .then(user => res.status(200).json(user))
    .catch(error =>
      res
        .status(500)
        .json({ error: "The user information could not be deleted" })
    );
});

router.put("/:id", validateUserId, (req, res) => {
  const userId = req.params.id;
  const changes = req.body;

  if (!changes.name) {
    return res
      .status(400)
      .json({ error: "Please provide a name for the user." });
  }

  Users.update(userId, changes)
    .then(updated => res.status(200).json(updated))
    .catch(error =>
      res.status(500).json({ error: "The user could not be updated" })
    );
});

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
  if (!req.body.name) {
    console.log(req.body);
    return res.status(400).json({ message: "missing required name field" });
  }

  req.user = req.body;

  next();
}

function validatePost(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "missing post data" });
  }
  if (!req.body.text) {
    return res.status(400).json({ message: "missing required text field" });
  }

  next();
}

module.exports = router;
