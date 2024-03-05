import { useEffect, useRef, useState } from "react";

import "./App.css";

type Todo = {
  id: number;
  name: string;
  is_completed: boolean;
};

type Filter = "all" | "active" | "completed";

const API_URL = "http://localhost:3001";

const _fetch = async (endpoint: string, method: "GET" | "POST" | "PATCH" | "DELETE", body?: BodyInit) => {
  const res = await fetch(API_URL + endpoint, {
    body,
    method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();

  return data;
};

const App = () => {
  const [editTodo, setEditTodo] = useState<Todo>();
  const editTodoRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [todoInput, setTodoInput] = useState("");
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isCompletedAll, setIsCompletedAll] = useState(false);

  const addTodo = async () => {
    if (!todoInput) return;

    await _fetch("/add-todo", "POST", JSON.stringify({ name: todoInput }));

    setTodoInput("");
    fetchTodos();
  };

  const clearCompleted = async () => {
    await _fetch("/clear-completed", "POST");

    fetchTodos();
  };

  const fetchTodos = async () => {
    const data = await _fetch("/todos", "GET");
    setTodoList(data.todos);
    setIsCompletedAll(data.todos.every((todo: Todo) => todo.is_completed));
  };

  const removeTodo = async (id: number) => {
    await _fetch(`/delete-todo/${id}`, "DELETE");

    fetchTodos();
  };

  const toggleAll = async () => {
    await _fetch("/toggle-all", "POST", JSON.stringify({ is_completed: !isCompletedAll }));
    setIsCompletedAll(prevState => !prevState);

    fetchTodos();
  };

  const toggleTodo = async (todo: Todo) => {
    const body = { ...todo, is_completed: !todo.is_completed };

    await _fetch(`/update-todo/${todo.id}`, "PATCH", JSON.stringify(body));

    fetchTodos();
  };

  const updateFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const updateTodo = async (todo: Todo) => {
    if (!editTodoRef.current?.value) return;

    const body = { ...todo, name: editTodoRef.current.value };

    await _fetch(`/update-todo/${todo.id}`, "PATCH", JSON.stringify(body));

    setEditTodo(undefined);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="container">
      <h1 className="title">todos</h1>
      <div style={{ position: "relative" }}>
        <button
          style={{ position: "absolute", height: "100%", padding: "10px", color: isCompletedAll ? "red" : "black" }}
          onClick={toggleAll}
        >
          v
        </button>
        <input
          type="text"
          placeholder="What needs to be done?"
          onKeyDown={e => e.code === "Enter" && addTodo()}
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "10px 0px" }}>
        {todoList.map(todo => {
          if (filter === "active" && todo.is_completed) return null;

          if (filter === "completed" && !todo.is_completed) return null;

          if (editTodo?.id === todo.id) {
            return (
              <div key={todo.id}>
                <input
                  type="text"
                  defaultValue={todo.name}
                  ref={editTodoRef}
                  onKeyDown={e => e.code === "Enter" && updateTodo(todo)}
                />
              </div>
            );
          }

          return (
            <div
              key={todo.id}
              onDoubleClick={() => setEditTodo(todo)}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  name={todo.name}
                  id={todo.name}
                  onChange={() => toggleTodo(todo)}
                />
                <span style={{ textDecorationLine: todo.is_completed ? "line-through" : "none" }}>{todo.name}</span>
              </div>
              <button onClick={() => removeTodo(todo.id)}>X</button>
            </div>
          );
        })}
      </div>
      {todoList.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0px" }}>
          <span>{`${todoList.length} ${todoList.length > 1 ? "items" : "item"} left!`}</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ fontWeight: filter === "all" ? "bold" : "normal" }} onClick={() => updateFilter("all")}>
              All
            </button>
            <button
              style={{ fontWeight: filter === "active" ? "bold" : "normal" }}
              onClick={() => updateFilter("active")}
            >
              Active
            </button>
            <button
              style={{ fontWeight: filter === "completed" ? "bold" : "normal" }}
              onClick={() => updateFilter("completed")}
            >
              Completed
            </button>
          </div>
          <button onClick={clearCompleted}>Clear completed</button>
        </div>
      )}
    </div>
  );
};

export default App;
