# Architecture

```text
React Frontend :5173
       |
       | REST/JSON
       v
Spring Boot API :8080 -------- MySQL :3306
       |
       | REST/JSON
       v
Python AI Service :8000
```

## Responsibilities

Frontend:
- UI
- routing
- forms
- dashboards
- API calls

Spring Boot:
- business logic
- validation
- persistence
- REST APIs
- AI-service integration

MySQL:
- students
- attendance
- marks
- skills
- placement data

AI service:
- accepts academic features
- returns a performance prediction
- can later be replaced with a trained production model
