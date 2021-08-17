const { WishlistType, ProductType } = require("./types");
const { User, Wishlist, Product } = require("../models");
const { GraphQLString } = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const register = {
  type: GraphQLString,
  description: "Register new user",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args, { res }) {
    const {username, email, password}= args;
    const passwordHashed = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: passwordHashed });
    await user.save().then((user) => {
      console.log(user);
      const token = createAccessToken({ id: user._id });
      res.cookie("accessToken", token, {
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30days    
      });  
    });
      return ("user created");
  },
};

const login = {
  type: GraphQLString,
  description: "Login user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args, { res }) {
    const user = await User.findOne({ email: args.email }).select("+password");
    const isMatch = await bcrypt.compare(args.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    console.log(user);
    const token = createAccessToken({ id: user._id });
    res.cookie("accessToken", token, {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30days
    });
    return token;
  },
};

const addWishlist = {
  type: WishlistType,
  description: "Create new blog wishlist",
  args: {
    title: { type: GraphQLString },
  },
  resolve(parent, args, { req, res }) {
    console.log(req);
    try {
      const token = req.cookies.accessToken;
      console.log(token);
      if (!token)
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const wishlist = new Wishlist({
        authorId: verified.id,
        title: args.title,
      });
      return wishlist.save();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ status: "error", message: "ERROR" });
    }
  },
};

const updateWishlist = {
  type: WishlistType,
  description: "Update wishlist",
  args: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
  },
  async resolve(parent, args, { req, res }) {
    try {
      const token = req.cookies.accessToken;
      console.log(token);
      if (!token)
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const wishlistUpdated = await Wishlist.findOneAndUpdate(
        {
          _id: args.id,
          authorId: verifiedUser._id,
        },
        { title: args.title, body: args.body },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!wishlistUpdated) {
        throw new Error("No wishlist with the given ID found for the author");
      }
      return wishlistUpdated;
    } catch (err) {
      console.log(err);
      return res.status(401).json({ status: "error", message: "ERROR" });
    }
   
  },
};

const deleteWishlist = {
  type: GraphQLString,
  description: "Delete wishlist",
  args: {
    wishlitId: { type: GraphQLString },
  },
  async resolve(parent, args, { req, res }) {

    try {
      const token = req.cookies.accessToken;
      console.log(token);
      if (!token)
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const wishlistDeleted = await Wishlist.findOneAndDelete({
      _id: args.wishlistId,
      authorId: verifiedUser._id,
    });
    if (!wishlistDeleted) {
      throw new Error("No wishlist with the given ID found for the author");
    }
    return "Wishlist deleted";
  } catch (err) {
    console.log(err);
    return res.status(401).json({ status: "error", message: "ERROR" });
  }
  },
};


const addProduct = {
  type: ProductType,
  description: "Create a new product ",
  args: {
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    currency: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    image: { type: GraphQLString },
    wishlistId: { type: GraphQLString },
  },
  resolve(parent, args, { req,res }) {
    try {
      const token = req.cookies.accessToken;
      console.log(token);
      if (!token)
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const product = new Product({
        userId: verified.id,
        wishlistId: args.wishlistId,
        name: args.name,
        price: args.price,
        currency: args.currency,
        description: args.description,
        status: args.status,
        image: args.image,
      });
      return product.save();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ status: "error", message: "ERROR" });
    }
  },
};

const updateProduct = {
  type: ProductType,
  description: "Update product",
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    currency: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    image: { type: GraphQLString },
  },
  async resolve(parent, args, { req, res }) {
    try {
      const token = req.cookies.accessToken;
      console.log(token);
      if (!token)
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const productUpdated = await Product.findOneAndUpdate(
      {
        _id: args.id,
        userId: verifiedUser._id,
      },
      { product: args.product },
      {
        new: true,
        runValidators: true,
      }
    
    );
    if (!productUpdated) {
      throw new Error("No product with the given ID found for the author");
    }
    return productUpdated;
  } catch (err) {
    console.log(err);
    return res.status(401).json({ status: "error", message: "ERROR" });
  }
  },
};

const deleteProduct = {
  type: GraphQLString,
  description: "Delete product",
  args: {
    productId: { type: GraphQLString },
  },
  async resolve(parent, args, {req, res }) {
    try {
      const token = req.cookies.accessToken;
      console.log(token);
      if (!token)
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      const verified = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const productDeleted = await Product.findOneAndDelete({
      _id: args.productId,
      userId: verifiedUser._id,
    });
    if (!productDeleted) {
      throw new Error("No wishlist with the given ID found for the author");
    }
    return "wishlist deleted";
  } catch (err) {
    console.log(err);
    return res.status(401).json({ status: "error", message: "ERROR" });
  }
  },
};

module.exports = {
  register,
  login,
  addWishlist,
  addProduct,
  updateWishlist,
  deleteWishlist,
  updateProduct,
  deleteProduct,
};
