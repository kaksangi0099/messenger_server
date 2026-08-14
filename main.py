from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from jose import jwt
import hashlib

app = FastAPI(title="My Messenger API")

SECRET_KEY = "my-super-secret-key-change-later"
ALGORITHM = "HS256"

users = {}


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


@app.get("/")
def home():
    return {
        "message": "Messenger server is running!"
    }


@app.post("/register")
def register(data: RegisterRequest):

    if data.username in users:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    users[data.username] = {
        "username": data.username,
        "password": hash_password(data.password)
    }

    return {
        "message": "Registration successful",
        "username": data.username
    }


@app.post("/login")
def login(data: LoginRequest):

    user = users.get(data.username)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if user["password"] != hash_password(data.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = jwt.encode(
        {"sub": data.username},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Login successful",
        "access_token": token
    }
