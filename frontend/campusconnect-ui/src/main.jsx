import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./styles.css";

const API = "http://localhost:8080/api";

function App() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({});
  const [form, setForm] = useState({
    name: "", email: "", department: "CSE", yearOfStudy: 4, cgpa: 0
  });
  const [prediction, setPrediction] = useState(null);
  const [aiForm, setAiForm] = useState({
    attendance: 80, studyHours: 5, quizScore: 75,
    assignmentScore: 80, loginFrequency: 6, previousFailures: 0
  });

  async function load() {
    const [s, d] = await Promise.all([
      axios.get(`${API}/students`),
      axios.get(`${API}/dashboard/summary`)
    ]);
    setStudents(s.data);
    setSummary(d.data);
  }

  useEffect(() => { load().catch(console.error); }, []);

  async function addStudent(e) {
    e.preventDefault();
    await axios.post(`${API}/students`, {
      ...form,
      yearOfStudy: Number(form.yearOfStudy),
      cgpa: Number(form.cgpa)
    });
    setForm({name:"", email:"", department:"CSE", yearOfStudy:4, cgpa:0});
    load();
  }

  async function predict(e) {
    e.preventDefault();
    const res = await axios.post(`${API}/ai/predict`, {
      ...aiForm,
      attendance: Number(aiForm.attendance),
      studyHours: Number(aiForm.studyHours),
      quizScore: Number(aiForm.quizScore),
      assignmentScore: Number(aiForm.assignmentScore),
      loginFrequency: Number(aiForm.loginFrequency),
      previousFailures: Number(aiForm.previousFailures)
    });
    setPrediction(res.data);
  }

  return (
    <div className="app">
      <header>
        <div>
          <p className="eyebrow">CAMPUSCONNECT</p>
          <h1>Student Intelligence Dashboard</h1>
          <p className="muted">Management • Analytics • AI • Placement Preparation</p>
        </div>
      </header>

      <section className="cards">
        <div className="card"><span>Students</span><strong>{summary.totalStudents ?? 0}</strong></div>
        <div className="card"><span>Attendance records</span><strong>{summary.totalAttendanceRecords ?? 0}</strong></div>
        <div className="card"><span>Mark records</span><strong>{summary.totalMarkRecords ?? 0}</strong></div>
      </section>

      <main className="grid">
        <section className="panel">
          <h2>Add Student</h2>
          <form onSubmit={addStudent} className="form">
            {["name","email","department","yearOfStudy","cgpa"].map(key => (
              <label key={key}>
                {key}
                <input
                  type={key === "yearOfStudy" || key === "cgpa" ? "number" : "text"}
                  value={form[key]}
                  onChange={e => setForm({...form, [key]: e.target.value})}
                  required={key === "name" || key === "email"}
                />
              </label>
            ))}
            <button>Add Student</button>
          </form>
        </section>

        <section className="panel">
          <h2>AI Performance Prediction</h2>
          <form onSubmit={predict} className="form">
            {Object.keys(aiForm).map(key => (
              <label key={key}>
                {key}
                <input
                  type="number"
                  step="0.1"
                  value={aiForm[key]}
                  onChange={e => setAiForm({...aiForm, [key]: e.target.value})}
                />
              </label>
            ))}
            <button>Predict</button>
          </form>
          {prediction && (
            <div className="prediction">
              <strong>{prediction.prediction}</strong>
              <span>Confidence: {prediction.confidence}%</span>
              <p>{prediction.message}</p>
            </div>
          )}
        </section>
      </main>

      <section className="panel">
        <h2>Students</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Department</th><th>Year</th><th>CGPA</th></tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td><td>{s.email}</td><td>{s.department}</td>
                  <td>{s.yearOfStudy}</td><td>{s.cgpa}</td>
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
