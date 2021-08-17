const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require("graphql");

const { User, Wishlist, Product } = require("../models");

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  })
});

const ProductType = new GraphQLObjectType({
  name: "ProductType",
  description: "Product type",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    currency: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    image: { type: GraphQLString },
    userId: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.authorId);
      }
    },
    wishlistId: {
      type: GraphQLString
    }
  })
});

const WishlistType = new GraphQLObjectType({
  name: "WishlistType",
  description: "Wishlist type",
  fields: () => ({
    id: { type: GraphQLID },
    tite: { type: GraphQLString },
    authorId: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      }
    }
  })
});

module.exports = { UserType, WishlistType, ProductType };