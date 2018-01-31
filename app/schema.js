// Schema
import { find, filter } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'
import pubsub from './pubsub'

const comments = [
  { id: 1, text: 'Primer comentario', postId: 1 },
  { id: 2, text: 'Segundo comentario', postId: 1 },
  { id: 3, text: 'Tercer comentario', postId: 2 },
  { id: 4, text: 'Cuarto comentario', postId: 2 }
]

const posts = [
  { id: 1, title: 'Introduction to GraphQL', publish: true, content: '', type: 'PRIVATE' },
  { id: 2, title: 'Welcome to Apollo', publish: true, content: '', type: 'PUBLIC' },
  { id: 3, title: 'Advanced GraphQL', publish: true, content: '', type: 'PUBLIC' },
  { id: 4, title: 'Launchpad is Cool', publish: true, content: '', type: 'PUBLIC' }
]

const typeDefs = `
enum TYPE {
  PUBLIC
  PRIVATE
}

input postPayload {
  title: String!
  content: String
  publish: Boolean
  type: TYPE
}

interface Node {
  id: ID!
}

union SearchResult = Post | Comment

type Post implements Node {
  id: ID!
  title: String!
  content: String!
  publish: Boolean!
  type: TYPE!
  comments: [Comment!]
}
type Comment implements Node {
  id: ID!
  text: String!
  post: Post
}

type Query {
  allPosts: [Post]
  post(id: Int!): Post
  allComments: [Comment]
  comment(id: Int!): Comment
  search(q: Int): [SearchResult]
}
type Mutation {
  createPost(post: postPayload): Post
  updatePost(id: Int, post: postPayload): Post
  deletePost(id: Int): Post
}

enum _ModelMutationType {
  CREATED
  UPDATED
  DELETED
}

type PostSubscriptionPayload {
  mutation: _ModelMutationType
  node: Post
  previousValues: Post
}
type Subscription {
  Post: PostSubscriptionPayload
}
`

const resolvers = {
  Query: {
    allPosts: () => posts,
    post: (_, { id }) => find(posts, { id }),
    allComments: () => comments,
    comment: (_, { id }) => find(comments, { id }),
    search: (rootValue, {q}) => {
      return [
        posts[q],
        comments[q]
      ]
    }
  },
  Mutation: {
    createPost: (_, { post }) => {
      const newId = posts[posts.length - 1].id + 1
      const newPost = Object.assign({}, {id: newId}, post)
      posts.push(newPost)
      pubsub.publish('postChange', { Post: {mutation: 'CREATED', node: newPost}})
      return newPost
    },
    updatePost: (_, { id, post }) => {
      const index = posts.findIndex((item) => item.id === id)
      let indexPost = posts[index]
      const newPost = Object.assign({}, indexPost, post)
      indexPost = newPost
      pubsub.publish('postChange', { Post: {mutation: 'UPDATED', node: newPost, previousValues: indexPost}})
      return newPost
    },
    deletePost: (_, { id }) => {
      const index = posts.findIndex((item) => item.id === id)
      const indexPost = posts[index]
      posts.splice(index, 1)
      pubsub.publish('postChange', { Post: {mutation: 'DELETED', node: null, previousValues: indexPost}})
      return indexPost
    }
  },
  Comment: {
    post: (comment) => find(posts, { id: comment.postId })
  },
  Post: {
    comments: (post) => filter(comments, { postId: post.id })
  },
  SearchResult: {
    __resolveType: (obj) => {
      if (obj.text) return 'Comment'
      return 'Post'
    }
  },
  Subscription: {
    Post: {
      subscribe: () => pubsub.asyncIterator('postChange')
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
