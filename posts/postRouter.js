const router = require("express").Router();

const Posts = require("../posts/postDb.js");

//GET /posts
router.get("/", (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved" });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  const postId = req.params.id;
  Posts.getById(postId)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  const postId = req.params.id;

  Posts.remove(postId)
    .then(post => res.status(200).json(post))
    .catch(error =>
      res
        .status(500)
        .json({ error: "The post information could not be deleted" })
    );
});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {
  let id = req.params.id;

  Posts.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
      } else {
        res.status(400).json({ message: "invalid post id" });
      }
    })
    .catch(error =>
      res.status(500).json({ message: "The post could not be retrieved" })
    );

  next();
}

module.exports = router;
