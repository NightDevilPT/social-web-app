# API Documentation

## File: src\app\api\comment\route.ts
- **GET**: Get all comments for a specific post
- **POST**: Create a new comment for a specific post

## File: src\app\api\comment\[id]\route.ts
- **POST** : Update a comment by comment id
- **DELETE**: Delete a comment by comment id

## File: src\app\api\likes\route.ts
- **GET /likes**: Returns a list of likes for a specific post which is identified by the `isActive:true` parameter.
- **POST /likes**: Creates a new like or Update an existing like for a specific post which is identified by the `isActive:true` parameter.

## File: src\app\api\posts\my-posts\route.ts
- **GET /my-posts**: Retrieves a list of posts created by the authenticated user.

## File: src\app\api\posts\route.ts
- **GET /posts**: Retrieves a list of posts.
- **POST /posts**: Creates a new post.

## File: src\app\api\posts\[id]\route.ts
- **GET**: `GET /posts/:id`
- **PUT**: `PUT /posts/:id`
- **DELETE**: `DELETE /posts/:id`

## File: src\app\api\users\login\route.ts
- POST : User Login

## File: src\app\api\users\route.ts
- POST : User signup
