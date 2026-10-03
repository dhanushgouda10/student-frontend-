import { useEffect, useState } from "react";
import StudentList from "./StudentList";

const API_URL = "http://localhost:8080/student";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    course: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const studentData = {
      name: form.name,
      email: form.email,
      age: Number(form.age),
      course: form.course
    };
    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      showMessage(
        editingId ? "Student updated successfully" : "Student added successfully",
        "success"
      );
      handleCancel();
      fetchStudents();
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      age: student.age,
      course: student.course
    });
    setEditingId(student.id);
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", age: "", course: "" });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      showMessage("Student deleted successfully", "success");
      fetchStudents();
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <div className={`form-card ${editingId ? "editing" : ""}`}>
        <h2 className="form-title">
          {editingId ? "✏️ Edit Student" : "➕ Add Student"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="age"
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />
          <input
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Student" : "Add Student"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {messageType === "success" ? "✅ " : "❌ "}
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <StudentList
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
