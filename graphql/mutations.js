const { WishlistType, ProductType } = require("./types")

const { User, Wishlist, Product } = require("../models")
const { GraphQLString } = require("graphql")

const { createJwtToken } = require("../tools/auth")

const register = {
  type: GraphQLString,
  description: "Register new user",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
   
  },
  async resolve(parent, args) {
    const { username, email, password, displayName } = args
    const user = new User({ username, email, password })

    await user.save()
        const token = createJwtToken(user)
        return token
  
  },
}

const login = {
  type: GraphQLString,
  description: "Login user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await User.findOne({ email: args.email }).select("+password")
    console.log(user)
    if (!user || args.password !== user.password) {
      throw new Error("Invalid credentials")
    }

    const token = createJwtToken(user)
    return token
  },
}

const addWishlist = {
  type: WishlistType,
  description: "Create new blog wishlist",
  args: {
    title: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    console.log("Verified User: ", verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthorized")
    }

    const wishlist = new Wishlist({
      authorId: verifiedUser._id,
      title: args.title,
    })

    return wishlist.save()
  },
}

const updateWishlist = {
  type: WishlistType,
  description: "Update wishlist",
  args: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
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
    )

    if (!wishlistUpdated) {
      throw new Error("No wishlist with the given ID found for the author")
    }

    return wishlistUpdated
  },
}

const deleteWishlist = {
  type: GraphQLString,
  description: "Delete wishlist",
  args: {
    wishlitId: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log(verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const wishlistDeleted = await Wishlist.findOneAndDelete({
      _id: args.wishlistId,
      authorId: verifiedUser._id,
    })
    if (!wishlistDeleted) {
      throw new Error("No wishlist with the given ID found for the author")
    }

    return "Wishlist deleted"
  },
}

const addProduct = {
  type: ProductType,
  description: "Create a new product ",
  args: {
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    currency: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    image: { type: GraphQLString},
    wishlistId: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    const product = new Product({
      userId: verifiedUser._id,
      wishlistId: args.wishlistId,
      name: args.name,
      price: args.price,
      currency: args.currency,
      description: args.description,
      status: args.status,
      image: args.image,
    })
    return product.save()
  },
}

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
    image: { type: GraphQLString},
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
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
    )

    if (!productUpdated) {
      throw new Error("No product with the given ID found for the author")
    }

    return productUpdated
  },
}

const deleteProduct = {
  type: GraphQLString,
  description: "Delete product",
  args: {
    productId: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log(verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const productDeleted = await Product.findOneAndDelete({
      _id: args.productId,
      userId: verifiedUser._id,
    })
    if (!producttDeleted) {
      throw new Error("No wishlist with the given ID found for the author")
    }

    return "wishlist deleted"
  },
}

module.exports = {
  register,
  login,
  addWishlist,
  addProduct,
  updateWishlist,
  deleteWishlist,
  updateProduct,
  deleteProduct,
}