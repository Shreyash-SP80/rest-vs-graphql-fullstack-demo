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
