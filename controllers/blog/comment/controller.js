const appHandler = require("../../../utils/appHandler");
const User = require("../../../models/blog/user");
const Post = require("../../../models/blog/post");
const Comment = require("../../../models/blog/comment");

const createCommentCtrl = async (req, res, next) => {
  const {content} = req.body;

  if (!content) {
    res.redirect("/blog")
  }

  try {
    const user = await User.findById(req.session.userAuth);
    const post = await Post.findById(req.params.id);

    const comment = await Comment.create({
      content,
      user: user._id,
      post: post._id
    });

    post.comments.push(comment._id);
    await post.save({valitadeBeforeSave: false});

    res.redirect(`/blog/post/${post._id}`)

  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
};

module.exports = createCommentCtrl;
