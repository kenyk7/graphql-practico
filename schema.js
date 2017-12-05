// Schema
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

const comments = [
  { id: 1, text: 'Primer comentario', postId: 1 },
  { id: 2, text: 'Segundo comentario', postId: 1 },
  { id: 3, text: 'Tercer comentario', postId: 2 },
  { id: 4, text: 'Cuarto comentario', postId: 2 }
];

const posts = [
  { id: 1, title: 'Introduction to GraphQL', publish: true, content: '', type: 'PRIVATE' },
  { id: 2, title: 'Welcome to Apollo', publish: true, content: '', type: 'PUBLIC' },
  { id: 3, title: 'Advanced GraphQL', publish: true, content: '', type: 'PUBLIC' },
  { id: 4, title: 'Launchpad is Cool', publish: true, content: '', type: 'PUBLIC' }
];

const typeDefs = `
enum TYPE {
  PUBLIC
  PRIVATE
}

input postPayload {
  title: String!
  content: String!
  publish: Boolean!
  type: TYPE!
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
  posts: [Post]
  post(id: Int!): Post
  comments: [Comment]
  comment(id: Int!): Comment
  search(q: Int): [SearchResult]
}
type Mutation {
  postAdd(post: postPayload): Post
  postEdit(id: Int, post: postPayload): Post
  postDelete(id: Int): Post
}
`;

const resolvers = {
  Query: {
    posts: () => posts,
    post: (_, { id }) => find(posts, { id }),
    comments: () => comments,
    comment: (_, { id }) => find(comments, { id }),
    search: (rootValue, {q}) => {
      return [
        posts[q],
        comments[q]
      ]
    }
  },
  Mutation: {
    postAdd: (_, { post }) => {
    	const newPost = Object.assign({}, {id: 5}, post);
    	posts.push(newPost);
			return newPost;
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
  }
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});