import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";
 
import Todo from "../models/Todo.js";

// ✅ Todo Type
const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    done: { type: new GraphQLNonNull(GraphQLBoolean) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// ✅ Query Type
const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    todos: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(TodoType))
      ),
      resolve: async () => {
        return await Todo.find().sort({ createdAt: -1 });
      },
    },
    todo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        return await Todo.findById(id);
      },
    },
  }),
});

// ✅ Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addTodo: {
      type: TodoType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { title }) => {
        return await Todo.create({ title });
      },
    },

    toggleTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        const item = await Todo.findById(id);
        if (!item) throw new Error("Todo not found");

        item.done = !item.done;
        return await item.save();
      },
    },

    deleteTodo: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        const result = await Todo.findByIdAndDelete(id);
        return !!result;
      },
    },
  }),
});

// ✅ Export schema
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

