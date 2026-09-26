# CampusConnect AI

AI-powered student management, performance analytics and placement preparation platform.

## Stack
- Backend: Java 17, Spring Boot, Spring Web, Spring Data JPA, MySQL
- Frontend: React + Vite
- AI service: Python + FastAPI + scikit-learn
- API communication: REST/JSON
- Version control: Git + GitHub

## Modules in this starter
- Student profile
- Attendance
- Marks
- Dashboard summary
- AI performance prediction
- Placement/skill tracking data model
- Clean separation of frontend/backend/AI service

## Run order

### 1. MySQL
Create a database:
```sql
CREATE DATABASE campusconnect;
```

### 2. Backend
Open `backend/campusconnect-api` in IntelliJ/VS Code.
Update `application.properties` with your MySQL username/password.

Run:
```bash
mvn spring-boot:run
```
Backend: `http://localhost:8080`

### 3. AI service
Open `ai-service`.
```bash
python -m venv venv
# Windows
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
AI: `http://localhost:8000`

### 4. Frontend
Open `frontend/campusconnect-ui`.
```bash
npm install
npm run dev
```
Frontend: `http://localhost:5173`

## First Git workflow
```bash
git init
git add .
git commit -m "Initial CampusConnect AI project"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```
