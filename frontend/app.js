const API_URL = window.location.origin;

window.addEventListener("error", function(event) {
    console.error("MEDIA JS ERROR:", event.error || event.message);
    alert("خطای برنامه: " + (event.message || "خطای ناشناخته JavaScript"));
});

window.addEventListener("unhandledrejection", function(event) {
    console.error("MEDIA PROMISE ERROR:", event.reason);
    alert("خطای ورود: " + event.reason);
});


/* =========================
   ELEMENTS
========================= */

const authScreen = document.getElementById("authScreen");
const mainApp = document.getElementById("mainApp");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");

const registerName = document.getElementById("registerName");
const registerUsername = document.getElementById("registerUsername");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerPassword2 = document.getElementById("registerPassword2");
const registerButton = document.getElementById("registerButton");

const nameError = document.getElementById("nameError");
const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const ruleLength = document.getElementById("ruleLength");
const ruleUpper = document.getElementById("ruleUpper");
const ruleLower = document.getElementById("ruleLower");
const ruleNumber = document.getElementById("ruleNumber");
const ruleSymbol = document.getElementById("ruleSymbol");

const profileButton = document.getElementById("profileButton");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");

const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");

const logoutButton = document.getElementById("logoutButton");

const chatPage = document.getElementById("chatPage");
const backButton = document.getElementById("backButton");

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messages = document.getElementById("messages");

const emojiButton = document.getElementById("emojiButton");
const emojiPicker = document.getElementById("emojiPicker");
const emojiGrid = document.getElementById("emojiGrid");

const mediaButton = document.getElementById("mediaButton");
const fileButton = document.getElementById("fileButton");

const newChatButton = document.getElementById("newChatButton");
const chatTitle = document.getElementById("chatTitle");
const chatStatus = document.getElementById("chatStatus");

const accountSetting = document.getElementById("accountSetting");
const notificationSetting = document.getElementById("notificationSetting");
const privacySetting = document.getElementById("privacySetting");
const appearanceSetting = document.getElementById("appearanceSetting");
const aboutSetting = document.getElementById("aboutSetting");


/* =========================
   STATE
========================= */

let currentUser = null;


/* =========================
   LOCAL STORAGE
========================= */

function saveUser(user) {
    localStorage.setItem(
        "media_user",
        JSON.stringify(user)
    );
}

function getSavedUser() {
    try {
        return JSON.parse(
            localStorage.getItem("media_user")
        );
    } catch {
        return null;
    }
}

function clearUser() {
    localStorage.removeItem("media_user");
}


/* =========================
   AUTH SCREEN
========================= */

function showLoginScreen() {

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    clearErrors();
}


function showRegisterScreen() {

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    clearErrors();
}


showRegister.addEventListener(
    "click",
    showRegisterScreen
);

showLogin.addEventListener(
    "click",
    showLoginScreen
);


/* =========================
   ERRORS
========================= */

function clearErrors() {

    nameError.textContent = "";
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
}


function showError(element, text) {

    element.textContent = "✕ " + text;
}


/* =========================
   PASSWORD CHECK
========================= */

function checkPassword(password) {

    const rules = {

        length:
            password.length >= 8,

        upper:
            /[A-Z]/.test(password),

        lower:
            /[a-z]/.test(password),

        number:
            /[0-9]/.test(password),

        symbol:
            /[^A-Za-z0-9]/.test(password)

    };


    ruleLength.classList.toggle(
        "valid",
        rules.length
    );

    ruleUpper.classList.toggle(
        "valid",
        rules.upper
    );

    ruleLower.classList.toggle(
        "valid",
        rules.lower
    );

    ruleNumber.classList.toggle(
        "valid",
        rules.number
    );

    ruleSymbol.classList.toggle(
        "valid",
        rules.symbol
    );


    return Object.values(rules)
        .every(Boolean);
}


registerPassword.addEventListener(
    "input",
    () => {

        checkPassword(
            registerPassword.value
        );

        if (
            registerPassword2.value
        ) {
            checkPasswordMatch();
        }
    }
);


/* =========================
   PASSWORD MATCH
========================= */

function checkPasswordMatch() {

    if (
        registerPassword.value !==
        registerPassword2.value
    ) {

        showError(
            passwordError,
            "رمزهای عبور یکسان نیستند."
        );

        return false;
    }

    passwordError.textContent = "";

    return true;
}


registerPassword2.addEventListener(
    "input",
    checkPasswordMatch
);


/* =========================
   EMAIL CHECK
========================= */

function validGmail(email) {

    return /^[^\s@]+@gmail\.com$/i
        .test(email.trim());
}


/* =========================
   REGISTER
========================= */

registerButton.addEventListener(
    "click",
    async () => {

        clearErrors();

        const name =
            registerName.value.trim();

        const username =
            registerUsername.value.trim();

        const email =
            registerEmail.value.trim();

        const password =
            registerPassword.value;

        const password2 =
            registerPassword2.value;


        let valid = true;


        if (name.length < 2) {

            showError(
                nameError,
                "نام را درست وارد کنید."
            );

            valid = false;
        }


        if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {

            showError(
                usernameError,
                "نام کاربری باید ۳ تا ۲۰ کاراکتر انگلیسی باشد."
            );

            valid = false;
        }


        if (!validGmail(email)) {

            showError(
                emailError,
                "ایمیل باید با @gmail.com تمام شود."
            );

            valid = false;
        }


        if (!checkPassword(password)) {

            showError(
                passwordError,
                "رمز عبور همه شرایط بالا را ندارد."
            );

            valid = false;
        }


        if (password !== password2) {

            showError(
                passwordError,
                "تکرار رمز عبور درست نیست."
            );

            valid = false;
        }


        if (!valid) {
            return;
        }


        registerButton.disabled = true;
        registerButton.textContent =
            "در حال ساخت حساب...";


        try {

            const response =
                await fetch(
                    `${API_URL}/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            username,
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                showError(
                    emailError,
                    data.detail ||
                    "ثبت‌نام انجام نشد."
                );

                return;
            }


            alert(
                "حساب شما با موفقیت ساخته شد 💜"
            );

            loginUsername.value =
                username;

            loginPassword.value =
                password;

            showLoginScreen();

        } catch (error) {

            showError(
                emailError,
                "اتصال به سرور برقرار نشد."
            );

        } finally {

            registerButton.disabled =
                false;

            registerButton.textContent =
                "ساخت حساب";
        }

    }
);


/* =========================
   LOGIN
========================= */

loginButton.addEventListener(
    "click",
    async () => {

        const username =
            loginUsername.value.trim();

        const password =
            loginPassword.value;


        if (!username || !password) {

            alert(
                "نام کاربری و رمز عبور را وارد کنید."
            );

            return;
        }


        loginButton.disabled = true;

        loginButton.textContent =
            "در حال ورود...";


        try {

            const response =
                await fetch(
                    `${API_URL}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.detail ||
                    "ورود انجام نشد."
                );

                return;
            }


            currentUser = data.user;

            localStorage.setItem(
                "media_token",
                data.access_token
            );

            saveUser(data.user);

            openApplication();


        } catch (error) {

            alert(
                "سرور در دسترس نیست."
            );

        } finally {

            loginButton.disabled =
                false;

            loginButton.textContent =
                "ورود به مدیا";
        }

    }
);


/* =========================
   OPEN APP
========================= */

function openApplication() {

    authScreen.classList.add(
        "hidden"
    );

    mainApp.classList.remove(
        "hidden"
    );


    updateProfile();

    createEmojiPicker();

}


/* =========================
   PROFILE
========================= */

function updateProfile() {

    if (!currentUser) {
        return;
    }


    profileName.textContent =
        currentUser.name ||
        currentUser.username;


    profileUsername.textContent =
        "@" + (currentUser.username || "بدون نام کاربری");
}


/* =========================
   SETTINGS
========================= */

profileButton.addEventListener(
    "click",
    () => {

        settingsPanel.classList.add(
            "open"
        );
    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsPanel.classList.remove(
            "open"
        );
    }
);


/* =========================
   SETTINGS BUTTONS
========================= */

accountSetting.addEventListener(
    "click",
    () => {

        alert(
            "بخش اطلاعات حساب در نسخه بعدی کامل می‌شود."
        );
    }
);


notificationSetting.addEventListener(
    "click",
    () => {

        alert(
            "تنظیمات اعلان‌ها آماده است."
        );
    }
);


privacySetting.addEventListener(
    "click",
    () => {

        alert(
            "تنظیمات حریم خصوصی مدیا."
        );
    }
);


appearanceSetting.addEventListener(
    "click",
    () => {

        alert(
            "تنظیمات ظاهر برنامه."
        );
    }
);


aboutSetting.addEventListener(
    "click",
    () => {

        const card =
            document.getElementById(
                "aboutCard"
            );

        card.scrollIntoView({
            behavior: "smooth"
        });
    }
);


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(
    "click",
    () => {

        clearUser();

        currentUser = null;

        settingsPanel.classList.remove(
            "open"
        );

        mainApp.classList.add(
            "hidden"
        );

        authScreen.classList.remove(
            "hidden"
        );

        showLoginScreen();
    }
);


/* =========================
   CHAT
========================= */

function openChat(
    title = "Media",
    status = "پشتیبانی رسمی برنامه"
) {

    chatTitle.textContent =
        title;

    chatStatus.textContent =
        status;


    chatPage.classList.add(
        "open"
    );
}


function closeChat() {

    chatPage.classList.remove(
        "open"
    );
}


backButton.addEventListener(
    "click",
    closeChat
);


newChatButton.addEventListener(
    "click",
    () => {

        openChat(
            "گفتگوی جدید",
            "آماده گفتگو"
        );

        messageInput.focus();
    }
);


/* =========================
   SEND MESSAGE
========================= */

function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) {
        return;
    }


    const bubble =
        document.createElement("div");


    bubble.style.maxWidth = "75%";
    bubble.style.width = "fit-content";
    bubble.style.margin = "8px 0 8px auto";
    bubble.style.padding = "11px 15px";
    bubble.style.borderRadius = "17px 17px 4px 17px";
    bubble.style.color = "white";
    bubble.style.background =
        "linear-gradient(135deg,#8b5cf6,#6d28d9)";
    bubble.style.lineHeight = "1.7";
    bubble.textContent = text;


    messages.appendChild(
        bubble
    );


    messageInput.value = "";

    messages.scrollTop =
        messages.scrollHeight;
}


sendButton.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);


/* =========================
   EMOJIS
========================= */

const emojis = [
    "😀","😃","😄","😁","😆","😅","😂","🤣",
    "😊","😇","🙂","🙃","😉","😌","😍","🥰",
    "😘","😗","😙","😚","😋","😛","😝","😜",
    "🤪","🤨","🧐","🤓","😎","🤩","🥳","😏",
    "😒","😞","😔","😟","😕","🙁","☹️","😣",
    "😖","😫","😩","🥺","😢","😭","😤","😠",
    "😡","🤬","🤯","😳","🥵","🥶","😱","😨",
    "😰","😥","😓","🤗","🤔","🫣","🤭","🤫",
    "🤥","😶","🫡","😐","😑","😬","🙄","😯",
    "😦","😧","😮","😲","🥱","😴","🤤","😪",
    "😵","🤐","🥴","🤢","🤮","🤧","😷","🤒",
    "🤕","🤑","🤠","😈","👿","👹","👺","🤡",
    "💩","👻","💀","☠️","👽","👾","🤖","🎃",

    "👋","🤚","🖐️","✋","🖖","👌","🤏","✌️",
    "🤞","🤟","🤘","🤙","👈","👉","👆","👇",
    "☝️","👍","👎","✊","👊","🤝","👏","🙌",
    "🫶","🙏","💪","🫵","👀","👁️","🧠","❤️",

    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼",
    "🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈",
    "🙉","🙊","🐔","🐧","🐦","🦄","🐝","🦋",
    "🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦀",

    "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇",
    "🍓","🫐","🍒","🍑","🥭","🍍","🥝","🍅",
    "🥑","🍔","🍕","🌭","🍟","🌮","🌯","🍿",
    "🍩","🍪","🎂","🍰","🍫","🍭","☕","🧃",

    "⚽","🏀","🏈","⚾","🎾","🏐","🏆","🥇",
    "🎮","🎯","🎲","🎸","🎹","🎤","🎧","🎬",

    "🚗","🚕","🚌","🚓","🚑","🚒","✈️","🚀",
    "🚲","🏍️","🚢","🚁","🏠","🏢","🌆","🌃",

    "⭐","🌟","✨","💫","🔥","💜","💙","💚",
    "💛","🧡","❤️","🩷","🖤","🤍","🤎","💔",
    "💯","✅","❌","⚡","💎","👑","🎁","🎉",
    "🎊","🔒","🔔","📌","❤️‍🔥"
];


function createEmojiPicker() {

    emojiGrid.innerHTML = "";


    emojis.forEach(
        emoji => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.textContent =
                emoji;

            button.addEventListener(
                "click",
                () => {

                    messageInput.value +=
                        emoji;

                    messageInput.focus();
                }
            );

            emojiGrid.appendChild(
                button
            );
        }
    );
}


emojiButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        emojiPicker.classList.toggle(
            "hidden"
        );
    }
);


document.addEventListener(
    "click",
    event => {

        if (
            !emojiPicker.contains(
                event.target
            ) &&
            event.target !== emojiButton
        ) {

            emojiPicker.classList.add(
                "hidden"
            );
        }
    }
);


/* =========================
   MEDIA / FILE
========================= */

mediaButton.addEventListener(
    "click",
    () => {

        const input =
            document.createElement(
                "input"
            );

        input.type = "file";

        input.accept =
            "image/*,video/*";

        input.click();
    }
);


fileButton.addEventListener(
    "click",
    () => {

        const input =
            document.createElement(
                "input"
            );

        input.type = "file";

        input.click();
    }
);


/* =========================
   STARTUP
========================= */

const savedUser =
    getSavedUser();


if (
    savedUser &&
    savedUser.username &&
    savedUser.name
) {

    currentUser =
        savedUser;

    openApplication();

} else {

    clearUser();

    authScreen.classList.remove(
        "hidden"
    );

    mainApp.classList.add(
        "hidden"
    );

    showLoginScreen();
}

/* =========================
   REAL SEARCH + USER PROFILE
========================= */

const realSearchInput =
    document.getElementById("searchInput");

const realChatList =
    document.getElementById("chatList");

const userProfileModal =
    document.getElementById("userProfileModal");

const userProfileClose =
    document.getElementById("userProfileClose");

const userProfileAvatar =
    document.getElementById("userProfileAvatar");

const userProfileName =
    document.getElementById("userProfileName");

const userProfileUsername =
    document.getElementById("userProfileUsername");

const userProfileStatus =
    document.getElementById("userProfileStatus");

const userProfileBio =
    document.getElementById("userProfileBio");

const userProfileEmailRow =
    document.getElementById("userProfileEmailRow");

const userProfileEmail =
    document.getElementById("userProfileEmail");

const userProfileMessage =
    document.getElementById("userProfileMessage");

let selectedProfile = null;

function getToken() {
    return localStorage.getItem("media_token");
}


/* =========================
   SEARCH
========================= */

let searchTimer = null;

if (realSearchInput) {

    realSearchInput.addEventListener(
        "input",
        () => {

            clearTimeout(searchTimer);

            const q =
                realSearchInput.value.trim();

            if (!q) {

                restoreEmptyChatList();

                return;
            }

            searchTimer = setTimeout(
                () => searchUsers(q),
                250
            );
        }
    );
}


async function searchUsers(q) {

    if (!currentUser) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/users/search?q=${encodeURIComponent(q)}`,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + getToken()
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            console.error(data);

            return;
        }

        renderSearchResults(
            data.users || []
        );

    } catch (error) {

        console.error(
            "Search error:",
            error
        );
    }
}


function renderSearchResults(users) {

    if (!realChatList) {
        return;
    }

    realChatList.innerHTML = "";

    if (!users.length) {

        realChatList.innerHTML = `
            <div class="empty-chat-list">
                <div class="empty-list-icon">🔎</div>
                <strong>کاربری پیدا نشد</strong>
                <span>نام یا نام کاربری دیگری امتحان کنید.</span>
            </div>
        `;

        return;
    }

    users.forEach(user => {

        const item =
            document.createElement("button");

        item.type = "button";

        item.className =
            "chat-item real-search-user";

        item.innerHTML = `
            <div class="chat-avatar">
                ${user.role === "owner" ? "👑" : "👤"}
            </div>

            <div class="chat-item-info">
                <strong>
                    ${escapeHtml(user.name)}
                </strong>

                <span>
                    @${escapeHtml(user.username)}
                </span>
            </div>
        `;

        item.addEventListener(
            "click",
            () => openUserProfile(
                user.username
            )
        );

        realChatList.appendChild(item);
    });
}


function restoreEmptyChatList() {

    if (!realChatList) {
        return;
    }

    realChatList.innerHTML = `
        <div class="empty-chat-list">
            <div class="empty-list-icon">💬</div>
            <strong>هنوز گفتگویی ندارید</strong>
            <span>یک گفتگوی جدید شروع کنید.</span>
        </div>
    `;
}


/* =========================
   PROFILE
========================= */

async function openUserProfile(username) {

    try {

        const response =
            await fetch(
                `${API_URL}/profile/${encodeURIComponent(username)}`,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + getToken()
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.detail ||
                "پروفایل قابل دریافت نیست."
            );

            return;
        }

        selectedProfile = data;

        userProfileName.textContent =
            data.name || "کاربر مدیا";

        userProfileUsername.textContent =
            "@" + (data.username || "");

        userProfileBio.textContent =
            data.bio ||
            "هنوز چیزی درباره خودش ننوشته است.";

        if (data.avatar_url) {

            userProfileAvatar.src =
                data.avatar_url;

        } else {

            userProfileAvatar.src =
                createDefaultAvatar(
                    data.name
                );
        }

        if (data.is_online) {

            userProfileStatus.textContent =
                "🟢 آنلاین";

        } else if (data.last_seen) {

            userProfileStatus.textContent =
                "آخرین بازدید: " +
                formatLastSeen(
                    data.last_seen
                );

        } else {

            userProfileStatus.textContent =
                "آخرین بازدید مشخص نیست";
        }

        if (data.email) {

            userProfileEmail.textContent =
                data.email;

            userProfileEmailRow.classList.remove(
                "hidden"
            );

        } else {

            userProfileEmailRow.classList.add(
                "hidden"
            );
        }

        userProfileModal.classList.add(
            "open"
        );

    } catch (error) {

        console.error(error);

        alert(
            "ارتباط با سرور برقرار نشد."
        );
    }
}


function closeUserProfile() {

    if (userProfileModal) {

        userProfileModal.classList.remove(
            "open"
        );
    }
}


if (userProfileClose) {

    userProfileClose.addEventListener(
        "click",
        closeUserProfile
    );
}


if (userProfileModal) {

    userProfileModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                userProfileModal
            ) {
                closeUserProfile();
            }
        }
    );
}


if (userProfileMessage) {

    userProfileMessage.addEventListener(
        "click",
        () => {

            if (!selectedProfile) {
                return;
            }

            closeUserProfile();

            openChat(
                selectedProfile.name,
                "@" +
                selectedProfile.username
            );

            if (realSearchInput) {
                realSearchInput.value = "";
            }
        }
    );
}


/* =========================
   HELPERS
========================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function createDefaultAvatar(name) {

    const letter =
        String(name || "م")
            .trim()
            .charAt(0)
            .toUpperCase();

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="200"
             height="200"
             viewBox="0 0 200 200">

            <rect
                width="200"
                height="200"
                rx="100"
                fill="#7c3aed"
            />

            <text
                x="100"
                y="120"
                text-anchor="middle"
                font-size="90"
                fill="white"
                font-family="Arial"
            >${escapeHtml(letter)}</text>

        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
}


function formatLastSeen(dateString) {

    try {

        const date =
            new Date(dateString);

        return date.toLocaleString(
            "fa-IR",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );

    } catch {

        return "نامشخص";
    }
}

