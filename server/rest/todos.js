import { Router } from "express";
import Todo from "../models/Todo.js";

const router = Router();

// ✅ Utility: Convert MongoDB document to frontend-friendly object
const formatTodo = (item) => ({
  id: item._id.toString(),
  title: item.title,
  done: item.done,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

// ✅ GET /api/todos -> list all
router.get("/", async (req, res) => {
  const items = await Todo.find().sort({ createdAt: -1 });
  const formatted = items.map(formatTodo);
  res.json(formatted);
});

// router.get("/", async (req, res) => {
//   const items = await Todo.find().sort({ createdAt: -1 });
//   res.json(items);
// });


// ✅ POST /api/todos -> create
router.post("/", async (req, res) => {
  if (!req.body?.title) {
    return res.status(400).json({ error: "title required" });
  }

  const item = await Todo.create({ title: req.body.title });
  res.status(201).json(formatTodo(item));
});

// ✅ PATCH /api/todos/:id/toggle -> flip done
router.patch("/:id/toggle", async (req, res) => {
  try {
    const item = await Todo.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "not found" });
    }

    item.done = !item.done;
    await item.save();

    res.json(formatTodo(item));
  } catch (err) {
    console.error("REST toggle error:", err);
    res.status(500).json({ error: "toggle failed" });
  }
});

// ✅ DELETE /api/todos/:id -> remove
router.delete("/:id", async (req, res) => {
  try {
    const item = await Todo.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("REST delete error:", err);
    res.status(500).json({ error: "delete failed" });
  }
});

export default router;

