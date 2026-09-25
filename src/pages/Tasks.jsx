
import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load tasks");
        return;
      }

      setTasks(data.tasks);
    } catch (error) {
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            status: "pending",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create task");
        return;
      }

      setTasks((currentTasks) => [...currentTasks, data.task]);

      setTitle("");
      setDescription("");
    } catch (error) {
      setError("Unable to connect to the server");
    } finally {
      setCreating(false);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setError("");
  };

  const updateTask = async (taskId, status) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? data.task : task
        )
      );

      setEditingTask(null);
    } catch (error) {
      setError("Unable to connect to the server");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      setError("Unable to connect to the server");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
  <h1 className="text-3xl font-bold text-gray-900">
    My Tasks
  </h1>

  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }}
    className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
  >
    Logout
  </button>
</div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        
        <form
          onSubmit={createTask}
          className="mt-6 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Create a Task
          </h2>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Task description"
            rows="3"
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          />

          <button
            type="submit"
            disabled={creating}
            className="mt-4 rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Add Task"}
          </button>
        </form>

        
        {tasks.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-8 shadow">
            <p className="text-gray-500">
              No tasks found.
            </p>
          </div>
        )}

        
        <div className="mt-6 space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              {editingTask === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) =>
                      setEditTitle(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />

                  <textarea
                    value={editDescription}
                    onChange={(event) =>
                      setEditDescription(event.target.value)
                    }
                    rows="3"
                    className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        updateTask(task.id, task.status)
                      }
                      className="rounded-lg bg-pink-600 px-4 py-2 text-white"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingTask(null)}
                      className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">
                    {task.title}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {task.description}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    Status: {task.status}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => startEditing(task)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        updateTask(
                          task.id,
                          task.status === "pending"
                            ? "completed"
                            : "pending"
                        )
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 text-white"
                    >
                      {task.status === "pending"
                        ? "Complete"
                        : "Mark Pending"}
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
