import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema.js";
import todoRouter from "./rest/todos.js";

const app = express();
app.use(cors());
app.use(express.json());

// REST under /api
app.use("/api/todos", todoRouter);

// GraphQL under /graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // built-in IDE at http://localhost:4000/graphql
  })
);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to start", err);
    process.exit(1);
  }
})();
