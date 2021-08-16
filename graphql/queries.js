const { GraphQLList, GraphQLID } = require("graphql")
const { UserType, WishlistType, ProductType } = require("./types")
const { User, Wishlist, Product } = require("../models")

const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves list of users",
  resolve(parent, args) {
    return User.find()
  },
}

const user = {
  type: UserType,
  description: "Retrieves one user",
  args: { id: { type: GraphQLID } },

  resolve(parent, args) {
    return User.findById(args.id)
  },
}

const wishlists = {
  type: new GraphQLList(WishlistType),
  description: "Retrieves list of wishlists",
  resolve() {
    return Wishlist.find()
  },
}

const wishlist = {
  type: WishlistType,
  description: "Retrieves one wishlist",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return WishlistPost.findById(args.id)
  },
}
const products = {
  type: new GraphQLList(ProductType),
  description: "Retrieves list of products",
  resolve() {
    return Product.find()
  },
}

const product = {
  type: ProductType,
  description: "Retrieves one product",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return Product.findById(args.id)
  },
}

module.exports = { users, user, wishlists, wishlist, products, product }