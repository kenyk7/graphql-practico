# Graphql-práctico



## Front:

## Simple query
```gql
query allPosts {
  allPosts{
    id
    title
    comments{
      text
    }
  }
}
```

## Query parameters
```gql
query getPost ($id: ID!) {
  Post (id: $id){
    id
    title
    comments{
      text
    }
  }
}
```

## Fragments y Aliases
```gql
# fragments
fragment fieldsPosts on Post{
  id
  title
  comments{
    text
  }
}
query allPosts {
  allPosts{
    ...fieldsPosts
  }
}

# multiple query only request
query allData {
  allPosts{
    ...fieldsPosts
  },
  allComments{
    id
    text
  },
  allUsers{
    id
    email
  }
}

# Aliases
query getPost ($id: ID!) {
  Post (id: $id){
    ...fieldsPosts
  }
}

# query vars
{
  "id": "cj3kjyjw8092b0113u8biacd0"
}

```

## Directives
```gql
query allPosts ($withComments: Boolean!){
  allPosts{
    id
    title
    # @include | @skip
    comments @include (if: $withComments) {
      text
    }
  }
}

# query vars
{
  "withComments": true
}
```

## Mutations
```gql
# fragment
fragment fieldsPosts on Post{
  id
  title
  content
}

# created
mutation addPost ($title: String!, $content: String!) {
  createPost(
    title: $title,
    content: $content
  ) {
    ...fieldsPosts
  }
}

# update
mutation updatePost ($idUpdate: ID!) {
  updatePost(
    id: $idUpdate,
    title: "new post: update 2",
    content: "description post"
  ) {
    ...fieldsPosts
  }
}

# delete
mutation deletePost {
  deletePost (id: "cjashe2he719s01081sgvi2u2") {
    ...fieldsPosts
  }
}

# query vars

{
  "idUpdate": "cjash38906tin0114i8vhomjf",
  "title": "new post",
  "content": "description post"
}

```

## Subscriptions
```gql
subscription {
  Post{
    mutation
    node {
      ...fieldsPosts
    }
    previousValues {
      id
    }
  }
}

fragment fieldsPosts on Post{
  id
  title
  comments{
    text
  }
}
```

# Back:

## Run this project
First check the package.json to verify the engines support

```sh
> yarn || npm install
> yarn start || npm start
```

Open in your browser: http://localhost:8080/graphiql and test with:

Test online demo: https://launchpad.graphql.com/r9l0wlqk5n
Or In Zeit now demo: https://k7-graphql-practical.now.sh/ide

```gql
# Welcome to GraphiQL
fragment fieldPost on Post {
  id
  title
  content
  publish
  type
  comments{
    id
  }
}

query allPosts{
  posts{
    ...fieldPost
  }
}

query getPost2 {
  post2: post (id: 2) {
    ...fieldPost
  }
}

query allComments{
  comments{
    id
    text
    post{
      id
      title
    }
  }
}

mutation addPost {
  postAdd (
    post: {
      title: "New post test",
      content: "",
      publish: false,
      type: PUBLIC
    }
  ) {
    id
    title
  }
}

# inline fragment
query search {
  search (q: 1) {
    __typename
    ... on Post{
      title
    }
    ... on Comment{
      text
    }
  }
}

```

### Explicación teórica

```gql
# Schema: conjunto de types
## Types
### Scalars(nativos): Int, Float, String, Boolean, ID
### Objects: Entidades
### Enum: select
### Interfaces: implementar campos obligatorios
### Union: Buscador fb

# Modificadores de tipo:
## String, String!, [String], [String]!, [String!]!

# Código
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
```

# Otros temas

Authorization, Pagination, Caching
