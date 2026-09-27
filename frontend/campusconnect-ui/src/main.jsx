import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import api from "./api";
import Login from "./Login";
import "./styles.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "CSE",
    yearOfStudy: 4,
    cgpa: 0
  });

  const [prediction, setPrediction] = useState(null);

  const [aiForm, setAiForm] = useState({
    attendance: 80,
    studyHours: 5,
    quizScore: 75,
    assignmentScore: 80,
    loginFrequency: 6,
    previousFailures: 0
  });

  const isStudent = user?.role === "STUDENT";
  const isFaculty = user?.role === "FACULTY";
  const isAdmin = user?.role === "ADMIN";

  async function load() {
    try {
      // Students API - available to authenticated users
      const studentResponse = await api.get("/students");
      setStudents(studentResponse.data);

      // Dashboard summary is currently for FACULTY and ADMIN
      if (isFaculty || isAdmin) {
        const dashboardResponse = await api.get("/dashboard/summary");
        setSummary(dashboardResponse.data);
      } else {
        setSummary({});
      }

    } catch (error) {
      console.error("Failed to load dashboard:", error);

      // If token is invalid/expired, log the user out
      if (error.response?.status === 401) {
        logout();
      }
    }
  }

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  function handleLogin(data) {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setStudents([]);
    setSummary({});
    setPrediction(null);
  }

  async function addStudent(e) {
    e.preventDefault();

    try {
      await api.post("/students", {
        ...form,
        yearOfStudy: Number(form.yearOfStudy),
        cgpa: Number(form.cgpa)
      });

      setForm({
        name: "",
        email: "",
        department: "CSE",
        yearOfStudy: 4,
        cgpa: 0
      });

      await load();

    } catch (error) {
      console.error("Failed to add student:", error);

      if (error.response?.status === 403) {
        alert("You do not have permission to add students.");
      } else {
        alert("Failed to add student.");
      }
    }
  }

  async function predict(e) {
    e.preventDefault();

    try {
      const response = await api.post("/ai/predict", {
        ...aiForm,
        attendance: Number(aiForm.attendance),
        studyHours: Number(aiForm.studyHours),
        quizScore: Number(aiForm.quizScore),
        assignmentScore: Number(aiForm.assignmentScore),
        loginFrequency: Number(aiForm.loginFrequency),
        previousFailures: Number(aiForm.previousFailures)
      });

      setPrediction(response.data);

    } catch (error) {

    console.error("AI prediction failed:", error);

    if (error.response?.status === 401) {

        logout();

    } else if (error.response?.status === 403) {

        alert("You do not have permission to use AI prediction.");

    } else if (error.response?.data?.message) {

        alert(error.response.data.message);

    } else {

        alert("AI prediction failed. Check that the Python AI service is running.");

    }
}
  }

  // Not logged in → show Login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">

      <header>
        <div>
          <p className="eyebrow">CAMPUSCONNECT</p>

          <h1>Student Intelligence Dashboard</h1>

          <p className="muted">
            Management • Analytics • AI • Placement Preparation
          </p>

          <p>
            Logged in as: <strong>{user.name}</strong>{" "}
            ({user.role})
          </p>
        </div>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </header>

      {/* Dashboard summary - Faculty/Admin only */}
      {(isFaculty || isAdmin) && (
        <section className="cards">
          <div className="card">
            <span>Students</span>
            <strong>{summary.totalStudents ?? 0}</strong>
          </div>

          <div className="card">
            <span>Attendance records</span>
            <strong>{summary.totalAttendanceRecords ?? 0}</strong>
          </div>

          <div className="card">
            <span>Mark records</span>
            <strong>{summary.totalMarkRecords ?? 0}</strong>
          </div>
        </section>
      )}

      <main className="grid">

        {/* Add Student - Faculty/Admin only */}
        {(isFaculty || isAdmin) && (
          <section className="panel">

            <h2>Add Student</h2>

            <form onSubmit={addStudent} className="form">

              {["name", "email", "department", "yearOfStudy", "cgpa"].map(
                (key) => (
                  <label key={key}>
                    {key}

                    <input
                      type={
                        key === "yearOfStudy" || key === "cgpa"
                          ? "number"
                          : "text"
                      }
                      value={form[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: e.target.value
                        })
                      }
                      required={key === "name" || key === "email"}
                    />
                  </label>
                )
              )}

              <button type="submit">
                Add Student
              </button>

            </form>

          </section>
        )}

        {/* AI Prediction - All authenticated users */}
        <section className="panel">

          <h2>AI Performance Prediction</h2>

          <form onSubmit={predict} className="form">

            {Object.keys(aiForm).map((key) => (
              <label key={key}>
                {key}

                <input
                  type="number"
                  step="0.1"
                  value={aiForm[key]}
                  onChange={(e) =>
                    setAiForm({
                      ...aiForm,
                      [key]: e.target.value
                    })
                  }
                />
              </label>
            ))}

            <button type="submit">
              Predict
            </button>

          </form>

          {prediction && (
            <div className="prediction">

              <strong>
                {prediction.prediction}
              </strong>

              <span>
                Confidence: {prediction.confidence}%
              </span>

              <p>
                {prediction.message}
              </p>

            </div>
          )}

        </section>

      </main>

      {/* Student list */}
      <section className="panel">

        <h2>Students</h2>

        {isStudent && (
          <p className="muted">
            You are logged in as a Student.
          </p>
        )}

        <div className="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>CGPA</th>
              </tr>
            </thead>

            <tbody>

              {students.map((s) => (
                <tr key={s.id}>

                  <td>{s.name}</td>

                  <td>{s.email}</td>

                  <td>{s.department}</td>

                  <td>{s.yearOfStudy}</td>

                  <td>{s.cgpa}</td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);