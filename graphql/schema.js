// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql")

// Import queries
const {users, user, wishlists, wishlist, products, product } = require("./queries")

// Import mutations
const {
  register,
  login,
  addWishlist,
  addProduct,
  updateWishlist,
  deleteWishlist,
  updateProduct,
  deleteProduct,
} = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: { users, user, wishlists, wishlist, products, product},
})

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
   register,
    login,
    addWishlist,
    addProduct,
    updateWishlist,
    deleteWishlist,
    updateProduct,
    deleteProduct,
  },
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})