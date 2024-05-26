const appHandler = require("../../../utils/appHandler");
const User = require("../../../models/blog/user");
const Post = require("../../../models/blog/post");

const getPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
};

const createPostCtrl = async (req, res, next) => {
  const {title, content} = req.body;

  if (!title || !content) {
    return res.json(next(appHandler("Please provide all fields", 400)));
  }

  try {
    const user = await User.findById(req.session.userAuth);

    const newPost = await Post.create({
      title,
      content,
      user: user._id
    });

    user.posts.push(newPost._id);
    await user.save();

    res.redirect("/blog/post/"+newPost._id);

  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
}

const getPostCtrl = async (req, res, next) => {
  const {id} = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.json(next(appHandler("Post not found", 404)));
    }

    res.json(post);
  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
}

const deletePostCtrl = async (req, res, next) => {
  const {id} = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.json(next(appHandler("Post not found", 404)));
    }

    await post.remove();

    res.json(post);
  } catch (error) {
    res.json(next(appHandler(error.message, 500)));
  }
};

module.exports = {
  getPostsCtrl,
  createPostCtrl,
  getPostCtrl,
  deletePostCtrl
};