const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,

    GraphQLList,
  } = require("graphql")
  
  const { User, Wishlist, Product } = require("../models")
  
  const UserType = new GraphQLObjectType({
    name: "User",
    description: "User type",
    fields: () => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      displayName: { type: GraphQLString },
    }),
  })
  
  const WishlistType = new GraphQLObjectType({
    name: "Wishlist",
    description: "Wishlist type",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      price: { type: GraphQLString },
      currency: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString },
      image: { type: GraphQLString },
      author: {
        type: UserType,
        resolve(parent, args) {
          return User.findById(parent.authorId)
        },
      },
      Product: {
        type: GraphQLList(ProductType),
        resolve(parent, args) {
          return Product.find({ wishlistId: parent.id })
        },
      },
    }),
  })
  
  const ProductType = new GraphQLObjectType({
    name: "Product",
    description: "Productt type",
    fields: () => ({
      id: { type: GraphQLID },
      product: { type: GraphQLString },
      user: {
        type: UserType,
        resolve(parent, args) {
          return User.findById(parent.userId)
        },
      },
      wishlist: {
        type: WishlistType,
        resolve(parent, args) {
          return Wishlist.findById(parent.wishlistId)
        },
      },
    }),
  })
  
  module.exports = { UserType, WishlistType, ProductType }