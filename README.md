# Graphql-práctico

# Front:

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

interface RequiredFields {
  id: ID!
}

type Post implements RequiredFields{
  id: ID!
  title: String!
  content: String!
  publish: Boolean!
  type: TYPE!
  comments: [Comment]
}

type Comment implements RequiredFields{
  id: ID!
  text: String!
  post: Post
}

union ResultadoBusqueda = Post | Comment

input postPayload {
  title: String!
  content: String!
  publish: Boolean!
  type: TYPE
}

type Query {
  posts: [Post]
  post(id: Int): Post
  comments: [Comment]
  comment(id: Int): Comment
  search(q: String): [ResultadoBusqueda]
}

type Mutation {
  postAdd(post: postPayload): Post
  postEdit(id: Int, post: postPayload): Post
  postDelete(id: Int): Post
}

# Frontend
# search inline fragment
query search($q: String!){
  search (q: "hola") {
    ... on Post{
      title
    }
    ... on Comment{
      text
    }
  }
}

```
