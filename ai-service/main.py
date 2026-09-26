from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestClassifier
import numpy as np

app = FastAPI(title="CampusConnect AI Service", version="1.0.0")

# Small demo model for local development.
# Replace this training data/model with your real dataset later.
X = np.array([
    [90, 8, 85, 90, 8, 0],
    [82, 6, 75, 80, 7, 0],
    [70, 4, 60, 65, 4, 1],
    [55, 2, 45, 50, 2, 2],
    [95, 9, 92, 95, 9, 0],
    [62, 3, 55, 58, 3, 2],
    [78, 5, 70, 72, 6, 1],
    [45, 1, 35, 40, 1, 3],
])
y = ["Good", "Good", "Average", "At Risk", "Good", "At Risk", "Average", "At Risk"]

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

class PredictionRequest(BaseModel):
    attendance: float = Field(ge=0, le=100)
    studyHours: float = Field(ge=0)
    quizScore: float = Field(ge=0, le=100)
    assignmentScore: float = Field(ge=0, le=100)
    loginFrequency: float = Field(ge=0)
    previousFailures: int = Field(ge=0)

@app.get("/health")
def health():
    return {"status": "UP"}

@app.post("/predict")
def predict(request: PredictionRequest):
    row = [[
        request.attendance,
        request.studyHours,
        request.quizScore,
        request.assignmentScore,
        request.loginFrequency,
        request.previousFailures
    ]]
    prediction = model.predict(row)[0]
    probabilities = model.predict_proba(row)[0]
    confidence = float(max(probabilities))

    return {
        "prediction": prediction,
        "confidence": round(confidence * 100, 2),
        "message": {
            "Good": "Current academic indicators look positive.",
            "Average": "Performance is moderate; consistent practice can improve it.",
            "At Risk": "Consider improving attendance, study consistency and assessment scores."
        }[prediction]
    }
