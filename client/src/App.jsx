import { useEffect, useMemo, useState } from "react";

const api = {
  async listREST() {
    const r = await fetch("/api/todos");
    if (!r.ok) throw new Error("REST list failed");
    return r.json();
  },
  async addREST(title) {
    const r = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!r.ok) throw new Error("REST add failed");
    return r.json();
  },
  async toggleREST(id) {
    const r = await fetch(`/api/todos/${id}/toggle`, { method: "PATCH" });
    if (!r.ok) throw new Error("REST toggle failed");
    return r.json();
  },
  async deleteREST(id) {
    const r = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("REST delete failed");
    return true;
  },

  async listGQL() {
    const r = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ todos { id title done } }" }),
    });
    const json = await r.json();
    if (json.errors) throw new Error(json.errors[0]?.message || "GQL list failed");
    return json.data.todos;
  },
  async addGQL(title) {
    const r = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          "mutation($title:String!){ addTodo(title:$title){ id title done } }",
        variables: { title },
      }),
    });
    const json = await r.json();
    if (json.errors) throw new Error(json.errors[0]?.message || "GQL add failed");
    return json.data.addTodo;
  },
  async toggleGQL(id) {
    const r = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          "mutation($id:ID!){ toggleTodo(id:$id){ id title done } }",
        variables: { id },
      }),
    });
    const json = await r.json();
    if (json.errors) throw new Error(json.errors[0]?.message || "GQL toggle failed");
    return json.data.toggleTodo;
  },
  async deleteGQL(id) {
    const r = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "mutation($id:ID!){ deleteTodo(id:$id) }",
        variables: { id },
      }),
    });
    const json = await r.json();
    if (json.errors) throw new Error(json.errors[0]?.message || "GQL delete failed");
    return json.data.deleteTodo;
  },
};

export default function App() {
  const [mode, setMode] = useState("REST");
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const useGQL = mode === "GraphQL";

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = useGQL ? await api.listGQL() : await api.listREST();
      setItems(data);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [mode]);

  const add = async () => {
    if (!text.trim()) return;
    try {
      const created = useGQL ? await api.addGQL(text) : await api.addREST(text);
      setItems((prev) => [created, ...prev]);
      setText("");
    } catch (e) {
      setError(e.message || "Failed to add");
    }
  };

  const toggle = async (id) => {
    try {
      const updated = useGQL ? await api.toggleGQL(id) : await api.toggleREST(id);
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e) {
      setError(e.message || "Failed to toggle");
    }
  };

  const del = async (id) => {
    try {
      if (useGQL) {
        const ok = await api.deleteGQL(id);
        if (!ok) throw new Error("Delete failed");
      } else {
        await api.deleteREST(id);
      }
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(e.message || "Failed to delete");
    }
  };

  const badge = useMemo(
    () => (
      <span
        style={{
          fontSize: 12,
          padding: "4px 10px",
          borderRadius: 12,
          background: useGQL ? "#234" : "#243",
          border: "1px solid #444",
          color: "#9fd",
        }}
      >
        {useGQL ? "GraphQL" : "REST"} mode
      </span>
    ),
    [useGQL]
  );

  return (
    <div
      style={{
        maxWidth: 820,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#111",
        color: "#eee",
        borderRadius: 16,
        border: "1px solid #222",
      }}
    >
      <h1 style={{ marginBottom: 4, fontSize: 36 }}>REST vs GraphQL Demo</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>
        Same data, two API styles. Toggle to see differences.
      </p>

      {/* Toggle Buttons */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
        <button
          onClick={() => setMode("REST")}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #333",
            background: mode === "REST" ? "#333" : "#222",
            color: "#eee",
            cursor: "pointer",
          }}
        >
          REST
        </button>

        <button
          onClick={() => setMode("GraphQL")}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #333",
            background: mode === "GraphQL" ? "#333" : "#222",
            color: "#eee",
            cursor: "pointer",
          }}
        >
          GraphQL
        </button>

        {badge}
      </div>

      {/* Input + Add */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo…"
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "#eee",
          }}
        />
        <button
          onClick={add}
          style={{
            padding: "12px 20px",
            borderRadius: 10,
            background: "#4b8",
            color: "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "tomato" }}>{error}</div>}

      {/* Todo List */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 12,
        }}
      >
        {items.map((t) => (
          <li
            key={t.id}
            style={{
              padding: 16,
              border: "1px solid #333",
              borderRadius: 12,
              background: "#181818",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label style={{ display: "flex", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!!t.done}
                onChange={() => toggle(t.id)}
              />
              <span
                style={{
                  textDecoration: t.done ? "line-through" : "none",
                  opacity: t.done ? 0.6 : 1,
                }}
              >
                {t.title}
              </span>
            </label>

            <button
              onClick={() => del(t.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "#400",
                border: "1px solid #800",
                color: "#faa",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "30px 0", borderColor: "#333" }} />

      {/* TOGGLE #1: See example network calls */}
      <details style={{ marginBottom: 12 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>
          See example network calls
        </summary>
        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
          <section style={{ padding: 12, background: "#0f0f0f", border: "1px solid #222", borderRadius: 10 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>REST — Create Todo</h3>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
{`POST /api/todos
Body:
{ "title": "Learn GraphQL" }

Response 201:
{
  "id": "67b9842e4aa1c82bbc0fb2f2",
  "title": "Learn GraphQL",
  "done": false
}`}
            </pre>
          </section>

          <section style={{ padding: 12, background: "#0f0f0f", border: "1px solid #222", borderRadius: 10 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>REST — Toggle Todo</h3>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
{`PATCH /api/todos/:id/toggle
Response 200:
{
  "id": "67b9842e4aa1c82bbc0fb2f1",
  "title": "Coding",
  "done": true
}`}
            </pre>
            <h4 style={{ margin: "12px 0 6px", opacity: 0.9 }}>cURL</h4>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
{`curl -X PATCH http://localhost:4000/api/todos/67b9842e4aa1c82bbc0fb2f1/toggle`}
            </pre>
          </section>

          <section style={{ padding: 12, background: "#0f0f0f", border: "1px solid #222", borderRadius: 10 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>GraphQL — List Todos</h3>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
{`POST /graphql
Body:
{
  "query": "{ todos { id title done } }"
}

Response:
{
  "data": {
    "todos": [
      { "id": "67b9...", "title": "Coding", "done": false }
    ]
  }
}`}
            </pre>
          </section>
        </div>
      </details>

      {/* TOGGLE #2: How it works */}
      <details>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>
          How it works
        </summary>
        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
          <section style={{ padding: 12, background: "#0f0f0f", border: "1px solid #222", borderRadius: 10 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>End-to-end flow</h3>
            <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>React calls <code>/api/todos</code> (REST) or <code>/graphql</code> (GraphQL) based on the toggle.</li>
              <li>Express routes (REST) or GraphQL resolvers use Mongoose to read/write in MongoDB.</li>
              <li>In REST responses, Mongo’s <code>_id</code> is converted to <code>id</code> so the UI can toggle/delete.</li>
              <li>The UI updates local state after each successful response.</li>
            </ol>
          </section>

          <section style={{ padding: 12, background: "#0f0f0f", border: "1px solid #222", borderRadius: 10 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Debug tips</h3>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>DevTools → Network tab: watch REST vs GraphQL requests when you toggle.</li>
              <li>If requests fail, check the backend terminal logs.</li>
              <li>Make sure your Vite proxy forwards <code>/api</code> and <code>/graphql</code> to <code>http://localhost:4000</code>.</li>
            </ul>
          </section>
        </div>
      </details>
    </div>
  );
}
