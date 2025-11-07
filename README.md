# REST API vs GraphQL — Concepts, Examples, Pros & Cons

This document explains **REST** and **GraphQL** in simple, practical terms with examples, when to use each, their strengths, weaknesses, and a side-by-side comparison.

---

## 🧠 Quick Idea

- **REST** = Many **fixed endpoints** (URLs). The **server** decides the shape of the response.
- **GraphQL** = **One endpoint**, the **client** describes the exact data shape it needs.

---

## 1) What is a REST API?

- **REST (Representational State Transfer)** is an architectural style that uses HTTP verbs and resource-based URLs.
- **REST API** is a common way of building APIs where you access data using fixed URLs (endpoints).


### How REST works (mental model)
```
    Client ── HTTP────> /users/42
    Server ── JSON────> { id, name, email, address, phone, ... }
```


- **Endpoint** represents a **resource** (e.g., `/users`, `/orders`, `/products`).
- **Verb** represents an **action** on that resource:
  - `GET` read, `POST` create, `PUT/PATCH` update, `DELETE` remove.


### REST API — Figure (Diagram)
```
       Client (Frontend)
            |
            |  GET /users/5
            v
     -----------------------
     |      REST Server     |
     | (Fixed Endpoints)    |
     -----------------------
            |
            v
       Returns Full User Data

```
### REST example endpoints
```
    GET /todos # list all todos
    GET /todos/5 # get a single todo
    POST /todos # create a todo
    PATCH /todos/5 # update a todo partially
    DELETE /todos/5 # delete a todo
```

### REST example request/response

**Request**
```
    GET /todos/5
```


**Response**
```json
    {
      "id": 5,
      "title": "Read docs",
      "done": false,
      "createdAt": "2025-11-07T08:00:00.000Z"
    }
```
### ✅ Strengths of REST (Advantages)

**1. Simple & familiar**  
Easy to learn and widely adopted across industries.

**2. Cache-friendly**  
`GET` endpoints can be cached by browsers and CDNs, improving performance.

**3. Clear semantics**  
HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) cleanly map to actions.

**4. Great tooling & ecosystem**  
Tools like **Postman**, **Insomnia**, **Swagger/OpenAPI**, **Hoppscotch** make REST easy to document, test, and maintain.

---

### ❌ Weaknesses of REST (Drawbacks)

**1. Over-fetching**  
Clients often receive more data than needed.  
**Example:**  
You only need `name` & `email`, but:
```
    GET /users/42
```
= returns name, email, phone, address, profile image, etc.

**2. Under-fetching**  
You might need multiple API calls to build one screen.

**Example (profile screen needs user + posts + followers):**
```
    GET /users/42
    GET /users/42/posts
    GET /users/42/followers
```

**3. Versioning pain**  
When the response structure changes, APIs often introduce:
```
    /api/v1/users
    /api/v2/users
```

**4. Tight coupling**  
Server controls what the response looks like.  
Clients must adapt to server changes.


## ✅ 2) What is GraphQL?

**GraphQL** is a query language for APIs.  
Unlike REST, the client asks **exactly for the fields it needs**, and the server returns **exactly that**.

---

## ✅ How GraphQL Works (Mental Model)
```
    Client ──POST /graphql──> { user(id:42){ name email } }

    Server ──JSON──────────> {
        "data": {
            "user": { "name": "Ana", "email": "a@b.com" }
        }
    }
```

### GraphQL — Figure (Diagram)
```
           Client
             |
             | POST /graphql
             | {
             |   user(id:5){ name email }
             | }
             v
     -----------------------
    |       GraphQL         |
    |   (Single Endpoint)   |
     -----------------------
             |
             v
       Returns Only Requested Fields

```

### Key Concepts

-  **Single endpoint** (commonly `/graphql`)
-  **Schema** defines types (e.g., `User`, `Todo`)
-  **Queries** → Read data  
-  **Mutations** → Write/update/delete data  
-  **Subscriptions** → Realtime updates (optional)

---

## ✅ GraphQL Query Example

### **Query**
```graphql
    {
      user(id: 42) {
        name
        email
        posts(limit: 2) {
          title
        }
      }
    }
```
#### Response
```
    {
      "data": {
        "user": {
          "name": "Ana",
          "email": "a@b.com",
          "posts": [
            { "title": "Hello GraphQL" },
            { "title": "REST vs GraphQL" }
          ]
        }
      }
    }
```

##  GraphQL Mutation Example

### Mutation
```graphql
    mutation AddTodo($title: String!) {
      addTodo(title: $title) {
        id
        title
        done
      }
    }
```
#### Variables
```
    { "title": "Ship feature" }
```

## Strengths of GraphQL (Advantages)

**1. No over-fetching**
  Ask only for the fields you need — nothing more.

**2. No under-fetching**
  Fetch related objects in one single round trip.

**3. Typed schema**
  Strong contracts and a self-documenting API (SDL).

**4. Faster product iteration**
  Add new fields without breaking existing clients.

**5. Great for mobile / slow networks**
  Smaller payloads and fewer network calls.

---

## Weaknesses of GraphQL (Drawbacks)

**1. Caching is harder**
  Everything uses POST /graphql, so HTTP caching does not work naturally.  
  (Client caching tools like Apollo/Relay are required.)

**2. More complex**
  Requires schema, resolvers, type system, and tooling — higher learning curve.

**3. Query cost issues**
  Clients can request very deep or expensive queries.  
  Requires:
  - depth limits  
  - query complexity rules  
  - pagination  

**4. Monitoring and rate-limiting are tricky**
  Harder compared to REST because everything goes through a single endpoint;  
  you cannot rate-limit easily by path or resource.


## 3) Practical Examples Side-by-Side

### Scenario A: Get a user’s name and email

#### REST
```
    GET /users/42
```

Returns the full user object, even fields you might not need.

#### GraphQL
```graphql
    { 
      user(id: 42) { 
        name 
        email 
      } 
    }
```
= Returns exactly name and email only.

## Scenario B: Profile page needs user + first 3 posts + followers count

### REST (requires multiple requests)
```
    GET /users/42
    GET /users/42/posts?limit=3
    GET /users/42/followers/count
```


### GraphQL (single request)
```graphql
    {
      user(id: 42) {
        name
        posts(limit: 3) { title }
        followersCount
      }
    }
```
 = One request returns everything.

## 4) Performance & Payloads

REST can be faster when the response fits a stable, well-defined resource that can be cached easily  
(example: product pages cached on CDNs).

GraphQL is better when the UI requires data from multiple sources or many small pieces of data.  
It reduces over-fetching and under-fetching, especially useful on mobile networks.


---

## 5) Error Handling

### REST
Uses HTTP status codes such as:
- 200 OK  
- 400 Bad Request  
- 404 Not Found  
- 500 Server Error  

### GraphQL
Always responds with 200 OK at the HTTP layer, and places errors inside the "errors" field:

```json
    {
      "data": {},
      "errors": []
    }
```
Internal errors can be mapped to HTTP codes, but many implementations do not.

## 6) Security & Governance

### REST
- Secures endpoints using JWT, OAuth, or sessions
- Rate limiting by route (/login, /users, /posts)
- Role-based access control on different paths

### GraphQL
- Authorization per resolver or per field
- Add query depth limits and complexity limits
- Use pagination to prevent expensive or deep queries
- Use persisted queries and allow-lists for production
- Field-level access control


---

## 7) When to Choose What?

### Choose REST when:
- Your data fits clean, resource-like endpoints
- You want easy CDN/browser caching for GET requests
- Simpler applications or teams familiar with REST
- Public APIs that must remain predictable and stable

### Choose GraphQL when:
- Screens need composed or nested data from many sources
- You want to eliminate over-fetching and under-fetching
- Mobile or bandwidth-limited clients need optimized payloads
- Faster product iteration without versioning (/v1, /v2)
- You want a strongly typed schema as a contract


---

## 8) Common Myths (Clearing Up)

"GraphQL is always faster."  
Not always. It reduces round trips, but complex queries may cost more on the server.

"REST cannot be flexible."  
REST can support features like field filtering (?fields=name,email) and custom endpoints,  
but these often re-create GraphQL concepts.

"GraphQL replaces REST."  
They coexist.  
Many companies use REST for public endpoints and GraphQL for internal/mobile apps.

