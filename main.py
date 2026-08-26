import os
import re
import hashlib
import secrets
import sqlite3
from pathlib import Path
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, UploadFile, File, Header
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from jose import jwt


# =========================
# CONFIG
# =========================

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MEDIA_DIR = DATA_DIR / "media"

DATA_DIR.mkdir(exist_ok=True)
MEDIA_DIR.mkdir(exist_ok=True)

DB_FILE = DATA_DIR / "media.db"

SECRET_KEY = "R0Jb7g8QYNt9n-BJdBarhuvGlpvi4bBHzJTXm3qYcpj3LKQ6CnQzZe0hQ5qfqWMpE8mvNaP0GUBWnNfRmH7m8w"

ALGORITHM = "HS256"

OWNER_USERNAME = "media_1234"
OWNER_EMAIL = "tarachat45@gmail.com"

# این مقدار را بعداً بهتر است از Environment Variable بگیری.
OWNER_PASSWORD = os.getenv(
    "MEDIA_OWNER_PASSWORD",
    "NSMP1389"
)


# =========================
# APP
# =========================

app = FastAPI(
    title="Media Messenger API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/media",
    StaticFiles(directory=str(MEDIA_DIR)),
    name="media"
)

app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "frontend")),
    name="static"
)


# =========================
# DATABASE
# =========================

def db():
    connection = sqlite3.connect(DB_FILE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():

    connection = db()

    connection.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        premium_level INTEGER NOT NULL DEFAULT 0,
        blocked INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        text TEXT,
        media_url TEXT,
        media_type TEXT,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
        user_id INTEGER PRIMARY KEY,
        avatar_url TEXT,
        bio TEXT DEFAULT '',
        show_email INTEGER NOT NULL DEFAULT 0,
        last_seen TEXT,
        is_online INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS blocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        block_type TEXT NOT NULL,
        block_until TEXT,
        created_at TEXT NOT NULL
    );
    """)

    connection.commit()
    connection.close()


init_db()


# =========================
# PASSWORD
# =========================

def hash_password(password: str) -> str:

    salt = secrets.token_hex(16)

    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        120000
    ).hex()

    return f"{salt}${digest}"


def verify_password(
    password: str,
    stored: str
) -> bool:

    try:

        salt, old_hash = stored.split("$", 1)

        new_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            120000
        ).hex()

        return secrets.compare_digest(
            new_hash,
            old_hash
        )

    except Exception:
        return False


# =========================
# VALIDATION
# =========================

def valid_username(username: str):

    return bool(
        re.fullmatch(
            r"[A-Za-z0-9_]{3,20}",
            username
        )
    )


def valid_email(email: str):

    return bool(
        re.fullmatch(
            r"[^@\s]+@gmail\.com",
            email,
            re.IGNORECASE
        )
    )


def valid_password(password: str):

    return (
        len(password) >= 8
        and bool(re.search(r"[A-Z]", password))
        and bool(re.search(r"[a-z]", password))
        and bool(re.search(r"[0-9]", password))
        and bool(re.search(r"[^A-Za-z0-9]", password))
    )


# =========================
# MODELS
# =========================

class RegisterRequest(BaseModel):

    name: str
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):

    username: str
    password: str


class PremiumRequest(BaseModel):

    username: str
    level: int


# =========================
# OWNER
# =========================

def ensure_owner():

    connection = db()

    user = connection.execute(
        """
        SELECT id
        FROM users
        WHERE username = ?
        """,
        (OWNER_USERNAME,)
    ).fetchone()

    if not user:

        connection.execute(
            """
            INSERT INTO users
            (
                name,
                username,
                email,
                password,
                role,
                premium_level,
                blocked,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "مدیا",
                OWNER_USERNAME,
                OWNER_EMAIL,
                hash_password(OWNER_PASSWORD),
                "owner",
                6,
                0,
                datetime.now(
                    timezone.utc
                ).isoformat()
            )
        )

        connection.commit()

    connection.close()


ensure_owner()


# =========================
# TOKEN
# =========================

def create_token(user):

    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user["id"]),
        "username": user["username"],
        "role": user["role"],
        "exp": now + timedelta(days=30)
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    authorization: str | None
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="ورود لازم است."
        )

    if not authorization.startswith(
        "Bearer "
    ):
        raise HTTPException(
            status_code=401,
            detail="توکن نامعتبر است."
        )

    token = authorization[7:]

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = int(
            payload["sub"]
        )

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="جلسه شما منقضی شده است."
        )

    connection = db()

    user = connection.execute(
        """
        SELECT *
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    ).fetchone()

    connection.close()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="کاربر پیدا نشد."
        )

    # =========================
    # BLOCK CHECK
    # =========================

    if user["role"] != "owner":

        connection = db()

        block = connection.execute(
            """
            SELECT
                block_type,
                block_until
            FROM blocks
            WHERE user_id = ?
            """,
            (user["id"],)
        ).fetchone()

        if block:

            block_until = block["block_until"]

            if (
                block["block_type"] == "permanent"
                or
                (
                    block_until
                    and datetime.fromisoformat(
                        block_until
                    ) > datetime.now(timezone.utc)
                )
            ):

                connection.close()

                if block["block_type"] == "permanent":
                    detail = "این حساب برای همیشه مسدود شده است."
                elif block["block_type"] == "6_months":
                    detail = "این حساب به مدت ۶ ماه مسدود شده است."
                else:
                    detail = "این حساب به مدت ۱ ماه مسدود شده است."

                raise HTTPException(
                    status_code=403,
                    detail=detail
                )

            # block expired
            connection.execute(
                """
                DELETE FROM blocks
                WHERE user_id = ?
                """,
                (user["id"],)
            )

            connection.execute(
                """
                UPDATE users
                SET blocked = 0
                WHERE id = ?
                """,
                (user["id"],)
            )

            connection.commit()

        connection.close()

    return user


def require_owner(
    authorization: str | None
):

    user = get_current_user(
        authorization
    )

    if user["role"] != "owner":

        raise HTTPException(
            status_code=403,
            detail="فقط مالک برنامه به این بخش دسترسی دارد."
        )

    return user



# =========================
# PROFILE API
# =========================

class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    bio: str | None = None
    show_email: bool | None = None


def ensure_profile(user_id: int):

    connection = db()

    connection.execute(
        """
        INSERT OR IGNORE INTO profiles
        (
            user_id,
            avatar_url,
            bio,
            show_email,
            last_seen,
            is_online
        )
        VALUES (?, NULL, '', 0, ?, 0)
        """,
        (
            user_id,
            datetime.now(timezone.utc).isoformat()
        )
    )

    connection.commit()
    connection.close()


def profile_public_data(user):

    connection = db()

    profile = connection.execute(
        """
        SELECT
            avatar_url,
            bio,
            show_email,
            last_seen,
            is_online
        FROM profiles
        WHERE user_id = ?
        """,
        (user["id"],)
    ).fetchone()

    connection.close()

    if not profile:
        return {
            "avatar_url": None,
            "bio": "",
            "email": None,
            "last_seen": None,
            "is_online": False
        }

    return {
        "avatar_url": profile["avatar_url"],
        "bio": profile["bio"] or "",
        "email": (
            user["email"]
            if profile["show_email"]
            else None
        ),
        "last_seen": profile["last_seen"],
        "is_online": bool(profile["is_online"])
    }


@app.get("/profile/{username}")
def get_profile(
    username: str,
    authorization: str | None = Header(default=None)
):

    get_current_user(authorization)

    connection = db()

    user = connection.execute(
        """
        SELECT
            id,
            name,
            username,
            email,
            role,
            premium_level,
            blocked
        FROM users
        WHERE username = ?
        """,
        (username,)
    ).fetchone()

    connection.close()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="کاربر پیدا نشد."
        )

    ensure_profile(user["id"])

    profile = profile_public_data(user)

    return {
        "id": user["id"],
        "name": user["name"],
        "username": user["username"],
        "role": user["role"],
        "premium_level": user["premium_level"],
        **profile
    }


@app.put("/profile")
def update_profile(
    data: ProfileUpdateRequest,
    authorization: str | None = Header(default=None)
):

    user = get_current_user(authorization)

    name = (
        data.name.strip()
        if data.name is not None
        else None
    )

    bio = (
        data.bio.strip()
        if data.bio is not None
        else None
    )

    if name is not None and len(name) < 2:
        raise HTTPException(
            status_code=400,
            detail="نام باید حداقل ۲ کاراکتر باشد."
        )

    if bio is not None and len(bio) > 160:
        raise HTTPException(
            status_code=400,
            detail="متن معرفی نمی‌تواند بیشتر از ۱۶۰ کاراکتر باشد."
        )

    ensure_profile(user["id"])

    connection = db()

    if name is not None:
        connection.execute(
            """
            UPDATE users
            SET name = ?
            WHERE id = ?
            """,
            (name, user["id"])
        )

    if bio is not None:
        connection.execute(
            """
            UPDATE profiles
            SET bio = ?
            WHERE user_id = ?
            """,
            (bio, user["id"])
        )

    if data.show_email is not None:
        connection.execute(
            """
            UPDATE profiles
            SET show_email = ?
            WHERE user_id = ?
            """,
            (
                1 if data.show_email else 0,
                user["id"]
            )
        )

    connection.execute(
        """
        UPDATE profiles
        SET last_seen = ?,
            is_online = 1
        WHERE user_id = ?
        """,
        (
            datetime.now(timezone.utc).isoformat(),
            user["id"]
        )
    )

    connection.commit()

    updated_user = connection.execute(
        """
        SELECT
            id,
            name,
            username,
            email,
            role,
            premium_level
        FROM users
        WHERE id = ?
        """,
        (user["id"],)
    ).fetchone()

    connection.close()

    return {
        "message": "پروفایل بروزرسانی شد.",
        "user": dict(updated_user),
        "profile": profile_public_data(updated_user)
    }


@app.post("/presence")
def update_presence(
    online: bool = True,
    authorization: str | None = Header(default=None)
):

    user = get_current_user(authorization)

    ensure_profile(user["id"])

    now = datetime.now(timezone.utc).isoformat()

    connection = db()

    connection.execute(
        """
        UPDATE profiles
        SET is_online = ?,
            last_seen = ?
        WHERE user_id = ?
        """,
        (
            1 if online else 0,
            now,
            user["id"]
        )
    )

    connection.commit()
    connection.close()

    return {
        "online": bool(online),
        "last_seen": now
    }


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return FileResponse(
        BASE_DIR / "frontend" / "index.html"
    )


# =========================
# REGISTER
# =========================

@app.post("/register")
def register(
    data: RegisterRequest
):

    name = data.name.strip()
    username = data.username.strip()
    email = data.email.strip().lower()
    password = data.password

    if len(name) < 2:

        raise HTTPException(
            status_code=400,
            detail="نام وارد شده معتبر نیست."
        )

    if not valid_username(username):

        raise HTTPException(
            status_code=400,
            detail="نام کاربری باید ۳ تا ۲۰ کاراکتر انگلیسی باشد."
        )

    if not valid_email(email):

        raise HTTPException(
            status_code=400,
            detail="ایمیل باید با gmail.com تمام شود."
        )

    if not valid_password(password):

        raise HTTPException(
            status_code=400,
            detail=(
                "رمز باید حداقل ۸ کاراکتر، "
                "حرف بزرگ، حرف کوچک، عدد و نماد داشته باشد."
            )
        )

    connection = db()

    existing = connection.execute(
        """
        SELECT id
        FROM users
        WHERE username = ?
           OR email = ?
        """,
        (username, email)
    ).fetchone()

    if existing:

        connection.close()

        raise HTTPException(
            status_code=400,
            detail="نام کاربری یا ایمیل قبلاً استفاده شده است."
        )

    cursor = connection.execute(
        """
        INSERT INTO users
        (
            name,
            username,
            email,
            password,
            role,
            premium_level,
            blocked,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            name,
            username,
            email,
            hash_password(password),
            "user",
            0,
            0,
            datetime.now(
                timezone.utc
            ).isoformat()
        )
    )

    connection.commit()

    user_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Registration successful",
        "user": {
            "id": user_id,
            "name": name,
            "username": username,
            "email": email,
            "role": "user",
            "premium_level": 0
        }
    }


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(
    data: LoginRequest
):

    connection = db()

    user = connection.execute(
        """
        SELECT *
        FROM users
        WHERE username = ?
        """,
        (data.username.strip(),)
    ).fetchone()

    connection.close()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="نام کاربری یا رمز عبور اشتباه است."
        )

    if user["blocked"]:

        raise HTTPException(
            status_code=403,
            detail="این حساب توسط مالک برنامه مسدود شده است."
        )

    if not verify_password(
        data.password,
        user["password"]
    ):

        raise HTTPException(
            status_code=401,
            detail="نام کاربری یا رمز عبور اشتباه است."
        )

    token = create_token(user)

    return {
        "message": "Login successful",
        "access_token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "premium_level": user["premium_level"]
        }
    }


# =========================
# ME
# =========================

@app.get("/me")
def me(
    authorization: str | None = Header(
        default=None
    )
):

    user = get_current_user(
        authorization
    )

    return {
        "id": user["id"],
        "name": user["name"],
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
        "premium_level": user["premium_level"],
        "blocked": bool(user["blocked"])
    }


# =========================
# OWNER - USERS
# =========================

@app.get("/owner/users")
def owner_users(
    authorization: str | None = Header(
        default=None
    )
):

    require_owner(
        authorization
    )

    connection = db()

    users = connection.execute(
        """
        SELECT
            id,
            name,
            username,
            email,
            role,
            premium_level,
            blocked,
            created_at
        FROM users
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return {
        "users": [
            dict(user)
            for user in users
        ]
    }


# =========================
# OWNER - PREMIUM
# =========================

@app.post("/owner/premium")
def set_premium(
    data: PremiumRequest,
    authorization: str | None = Header(
        default=None
    )
):

    require_owner(
        authorization
    )

    if data.level not in [0, 1, 3, 6]:

        raise HTTPException(
            status_code=400,
            detail="سطح ویژه باید ۰، ۱، ۳ یا ۶ باشد."
        )

    connection = db()

    result = connection.execute(
        """
        UPDATE users
        SET premium_level = ?
        WHERE username = ?
        """,
        (
            data.level,
            data.username
        )
    )

    connection.commit()

    connection.close()

    if result.rowcount == 0:

        raise HTTPException(
            status_code=404,
            detail="کاربر پیدا نشد."
        )

    return {
        "message": "Premium updated",
        "username": data.username,
        "premium_level": data.level
    }


# =========================
# OWNER - BLOCK
# =========================

@app.post("/owner/block/{username}")
def block_user(
    username: str,
    authorization: str | None = Header(
        default=None
    )
):

    owner = require_owner(
        authorization
    )

    if username == owner["username"]:

        raise HTTPException(
            status_code=400,
            detail="مالک نمی‌تواند خودش را مسدود کند."
        )

    connection = db()

    result = connection.execute(
        """
        UPDATE users
        SET blocked = 1
        WHERE username = ?
        """,
        (username,)
    )

    connection.commit()

    connection.close()

    if result.rowcount == 0:

        raise HTTPException(
            status_code=404,
            detail="کاربر پیدا نشد."
        )

    return {
        "message": "Account blocked",
        "username": username
    }


# =========================
# OWNER - UNBLOCK
# =========================

@app.post("/owner/unblock/{username}")
def unblock_user(
    username: str,
    authorization: str | None = Header(
        default=None
    )
):

    require_owner(
        authorization
    )

    connection = db()

    result = connection.execute(
        """
        UPDATE users
        SET blocked = 0
        WHERE username = ?
        """,
        (username,)
    )

    connection.commit()

    connection.close()

    if result.rowcount == 0:

        raise HTTPException(
            status_code=404,
            detail="کاربر پیدا نشد."
        )

    return {
        "message": "Account unblocked",
        "username": username
    }


# =========================
# UPLOAD MEDIA
# =========================

@app.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    authorization: str | None = Header(
        default=None
    )
):

    user = get_current_user(
        authorization
    )

    filename = file.filename or ""

    extension = Path(
        filename
    ).suffix.lower()

    allowed_images = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    }

    allowed_videos = {
        ".mp4",
        ".webm",
        ".mov",
        ".mkv"
    }

    if extension not in (
        allowed_images |
        allowed_videos
    ):

        raise HTTPException(
            status_code=400,
            detail="فرمت فایل پشتیبانی نمی‌شود."
        )

    if extension in allowed_images:

        media_type = "image"

    else:

        media_type = "video"

    safe_name = (
        f"{user['id']}_"
        f"{secrets.token_hex(12)}"
        f"{extension}"
    )

    target = MEDIA_DIR / safe_name

    with target.open("wb") as output:

        while True:

            chunk = await file.read(
                1024 * 1024
            )

            if not chunk:
                break

            output.write(chunk)

    return {
        "message": "Upload successful",
        "url": f"/media/{safe_name}",
        "type": media_type,
        "filename": filename
    }


# =========================
# SEND MESSAGE
# =========================

@app.post("/messages")
async def send_message(
    receiver_username: str,
    text: str = "",
    media_url: str | None = None,
    media_type: str | None = None,
    authorization: str | None = Header(
        default=None
    )
):

    sender = get_current_user(
        authorization
    )

    connection = db()

    receiver = connection.execute(
        """
        SELECT *
        FROM users
        WHERE username = ?
        """,
        (receiver_username,)
    ).fetchone()

    if not receiver:

        connection.close()

        raise HTTPException(
            status_code=404,
            detail="کاربر پیدا نشد."
        )

    if receiver["blocked"]:

        connection.close()

        raise HTTPException(
            status_code=403,
            detail="این حساب در دسترس نیست."
        )

    if not text.strip() and not media_url:

        connection.close()

        raise HTTPException(
            status_code=400,
            detail="پیام خالی است."
        )

    cursor = connection.execute(
        """
        INSERT INTO messages
        (
            sender_id,
            receiver_id,
            text,
            media_url,
            media_type,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            sender["id"],
            receiver["id"],
            text.strip(),
            media_url,
            media_type,
            datetime.now(
                timezone.utc
            ).isoformat()
        )
    )

    connection.commit()

    message_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Message sent",
        "id": message_id
    }


# =========================
# GET CHAT
# =========================

@app.get("/messages/{username}")
def get_messages(
    username: str,
    authorization: str | None = Header(
        default=None
    )
):

    user = get_current_user(
        authorization
    )

    connection = db()

    other = connection.execute(
        """
        SELECT id
        FROM users
        WHERE username = ?
        """,
        (username,)
    ).fetchone()

    if not other:

        connection.close()

        raise HTTPException(
            status_code=404,
            detail="کاربر پیدا نشد."
        )

    rows = connection.execute(
        """
        SELECT
            id,
            sender_id,
            receiver_id,
            text,
            media_url,
            media_type,
            created_at
        FROM messages
        WHERE
            (
                sender_id = ?
                AND receiver_id = ?
            )
            OR
            (
                sender_id = ?
                AND receiver_id = ?
            )
        ORDER BY id ASC
        """,
        (
            user["id"],
            other["id"],
            other["id"],
            user["id"]
        )
    ).fetchall()

    connection.close()

    return {
        "messages": [
            dict(row)
            for row in rows
        ]
    }


@app.get("/app")
def app_page():
    return FileResponse(BASE_DIR / "frontend" / "index.html")


# =========================
# SEARCH USERS
# =========================

@app.get("/users/search")
def search_users(
    q: str,
    authorization: str | None = Header(default=None)
):
    current = get_current_user(authorization)

    q = q.strip()

    if not q:
        return {"users": []}

    connection = db()

    rows = connection.execute(
        """
        SELECT
            id,
            name,
            username,
            role,
            premium_level
        FROM users
        WHERE
            username LIKE ?
            OR name LIKE ?
        ORDER BY
            CASE
                WHEN username = ? THEN 0
                WHEN name = ? THEN 1
                ELSE 2
            END,
            id ASC
        LIMIT 20
        """,
        (
            f"%{q}%",
            f"%{q}%",
            q,
            q
        )
    ).fetchall()

    connection.close()

    return {
        "users": [
            {
                "id": row["id"],
                "name": row["name"],
                "username": row["username"],
                "role": row["role"],
                "premium_level": row["premium_level"]
            }
            for row in rows
            if row["id"] != current["id"]
        ]
    }
