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
let activeChatUsername = null;


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


if (showRegister) showRegister.addEventListener(
    "click",
    showRegisterScreen
);

if (showLogin) showLogin.addEventListener(
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


if (registerPassword) registerPassword.addEventListener(
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


if (registerPassword2) registerPassword2.addEventListener(
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

if (registerButton) registerButton.addEventListener(
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

if (loginButton) loginButton.addEventListener(
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

if (profileButton && settingsPanel) {
    profileButton.addEventListener(
        "click",
        () => {
            settingsPanel.classList.add(
                "open"
            );
        }
    );
}


if (closeSettings) closeSettings.addEventListener(
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

if (accountSetting) accountSetting.addEventListener(
    "click",
    () => {

        alert(
            "بخش اطلاعات حساب در نسخه بعدی کامل می‌شود."
        );
    }
);


if (notificationSetting) notificationSetting.addEventListener(
    "click",
    () => {

        alert(
            "تنظیمات اعلان‌ها آماده است."
        );
    }
);


if (privacySetting) privacySetting.addEventListener(
    "click",
    () => {

        alert(
            "تنظیمات حریم خصوصی مدیا."
        );
    }
);


if (appearanceSetting) appearanceSetting.addEventListener(
    "click",
    () => {

        alert(
            "تنظیمات ظاهر برنامه."
        );
    }
);


if (aboutSetting) aboutSetting.addEventListener(
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

if (logoutButton) logoutButton.addEventListener(
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

    activeChatUsername = null;

    if (messageInput) {
        messageInput.value = "";
    }
}


if (backButton) backButton.addEventListener(
    "click",
    closeChat
);


/* =========================
   REAL CHAT / SEND MESSAGE
========================= */

async function loadChatMessages(username) {

    if (!username || !currentUser) {
        return;
    }

    activeChatUsername = username;

    // Always open the chat page
    openChat(
        username,
        "@" + username
    );

    // Close settings/profile overlays if open
    if (settingsPanel) {
        settingsPanel.classList.remove("open");
    }

    if (userProfileModal) {
        userProfileModal.classList.remove("open");
        userProfileModal.classList.remove("show");
    }

    // Update chat header
    if (chatTitle) {
        chatTitle.textContent =
            activeChatUsername;
    }

    if (chatStatus) {
        chatStatus.textContent =
            "در حال اتصال...";
    }

    messages.innerHTML = `
        <div style="text-align:center;padding:20px;color:#999;">
            در حال دریافت پیام‌ها...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}/messages/${encodeURIComponent(username)}`,
            {
                headers: {
                    "Authorization": "Bearer " + getToken()
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            messages.innerHTML = "";
            alert(data.detail || "پیام‌ها دریافت نشدند.");
            return;
        }

        messages.innerHTML = "";

        (data.messages || []).forEach(renderMessage);

        messages.scrollTop = messages.scrollHeight;

    } catch (error) {

        console.error("Load messages error:", error);

        messages.innerHTML = `
            <div style="text-align:center;padding:20px;color:#999;">
                اتصال به سرور برقرار نشد.
            </div>
        `;
    }
}


function renderMessage(message) {

    const bubble = document.createElement("div");

    const mine =
        Number(message.sender_id) === Number(currentUser.id);

    bubble.style.maxWidth = "75%";
    bubble.style.width = "fit-content";
    bubble.style.margin = mine
        ? "8px 0 8px auto"
        : "8px auto 8px 0";
    bubble.style.padding = "10px 14px";
    bubble.style.borderRadius = mine
        ? "17px 17px 4px 17px"
        : "17px 17px 17px 4px";
    bubble.style.lineHeight = "1.7";
    bubble.style.wordBreak = "break-word";

    if (mine) {
        bubble.style.color = "white";
        bubble.style.background =
            "linear-gradient(135deg,#8b5cf6,#6d28d9)";
    } else {
        bubble.style.color = "#222";
        bubble.style.background = "#eeeeee";
    }

    if (message.text) {

        const text = document.createElement("div");
        text.textContent = message.text;
        bubble.appendChild(text);
    }

    if (message.media_url) {

        const url = message.media_url.startsWith("http")
            ? message.media_url
            : API_URL + message.media_url;

        if (message.media_type === "image") {

            const img = document.createElement("img");

            img.src = url;
            img.style.maxWidth = "240px";
            img.style.maxHeight = "320px";
            img.style.borderRadius = "12px";
            img.style.display = "block";
            img.style.marginTop = message.text ? "8px" : "0";

            bubble.appendChild(img);

        } else if (message.media_type === "video") {

            const video = document.createElement("video");

            video.src = url;
            video.controls = true;
            video.style.maxWidth = "260px";
            video.style.borderRadius = "12px";
            video.style.display = "block";
            video.style.marginTop = message.text ? "8px" : "0";

            bubble.appendChild(video);
        }
    }

    const time = document.createElement("div");

    time.textContent = formatLastSeen(message.created_at);

    time.style.fontSize = "10px";
    time.style.opacity = "0.65";
    time.style.marginTop = "3px";

    bubble.appendChild(time);

    messages.appendChild(bubble);
}


async function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) {
        return;
    }

    if (!activeChatUsername) {

        alert("اول یک کاربر را برای گفتگو انتخاب کنید.");

        return;
    }

    const oldText = messageInput.value;

    sendButton.disabled = true;

    try {

        const params = new URLSearchParams();

        params.set(
            "receiver_username",
            activeChatUsername
        );

        params.set("text", text);

        const response = await fetch(
            `${API_URL}/messages?${params.toString()}`,
            {
                method: "POST",

                headers: {
                    "Authorization": "Bearer " + getToken()
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.detail ||
                "پیام ارسال نشد."
            );

            return;
        }

        messageInput.value = "";

        await loadChatMessages(activeChatUsername);

    } catch (error) {

        console.error("Send message error:", error);

        messageInput.value = oldText;

        alert("ارتباط با سرور برقرار نشد.");

    } finally {

        sendButton.disabled = false;

        messageInput.focus();
    }
}


if (sendButton) sendButton.addEventListener(
    "click",
    sendMessage
);


if (messageInput) messageInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

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

    if (!emojiGrid) {
        console.warn("Emoji grid not found");
        return;
    }

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


if (emojiButton) emojiButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        if (emojiPicker) {
            emojiPicker.classList.toggle(
                "hidden"
            );
        }
    }
);


document.addEventListener(
    "click",
    event => {

        if (
            emojiPicker &&
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

if (mediaButton) mediaButton.addEventListener(
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


if (fileButton) fileButton.addEventListener(
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

function runUserSearch() {
    if (!realSearchInput) {
        console.error("SEARCH: searchInput not found");
        return;
    }

    const q = realSearchInput.value.trim();

    clearTimeout(searchTimer);

    if (!q) {
        restoreEmptyChatList();
        return;
    }

    searchUsers(q);
}

if (realSearchInput) {

    realSearchInput.addEventListener(
        "input",
        () => {
            clearTimeout(searchTimer);

            searchTimer = setTimeout(
                runUserSearch,
                250
            );
        }
    );

    realSearchInput.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                event.preventDefault();
                runUserSearch();
            }
        }
    );
}

async function searchUsers(q) {



    console.log("SEARCH START:", q);

    const token = getToken();

    if (!token) {
        console.error("SEARCH STOP: token is missing");
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

        console.log("SEARCH RESULT:", data.users);

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

    const list = document.getElementById("chatList");

    if (!list) {
        console.error("SEARCH: chatList not found");
        return;
    }

    list.innerHTML = "";

    if (!Array.isArray(users) || users.length === 0) {
        list.innerHTML = `
            <div class="empty-chat-list">
                <div class="empty-list-icon">🔎</div>
                <strong>کاربری پیدا نشد</strong>
                <span>نام یا نام کاربری دیگری امتحان کنید.</span>
            </div>
        `;
        return;
    }

    users.forEach(user => {

        const item = document.createElement("button");

        item.type = "button";
        item.className = "chat-item real-search-user";

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";

        if (user.role === "owner") {
            avatar.textContent = "👑";
        } else {
            const firstLetter =
                (user.name || user.username || "ک").trim().charAt(0);

            avatar.textContent = firstLetter.toUpperCase();
        }

        const info = document.createElement("div");
        info.className = "chat-item-info";

        const name = document.createElement("strong");
        name.className = "search-user-name";
        name.textContent =
            user.name || user.username || "کاربر";

        const username = document.createElement("span");
        username.className = "search-user-username";
        username.textContent =
            "@" + (user.username || "");

        info.appendChild(name);
        info.appendChild(username);

        item.appendChild(avatar);
        item.appendChild(info);

        item.addEventListener("click", async () => {

            const usernameValue = user.username;

            if (!usernameValue) {
                return;
            }

            // بستن نتایج جستجو
            if (realSearchInput) {
                realSearchInput.value = "";
            }

            // باز کردن چت
            if (typeof loadChatMessages === "function") {
                await loadChatMessages(usernameValue);
            }

        });

        list.appendChild(item);
    });

    console.log("SEARCH DISPLAYED:", users.length);
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

    if (userProfileClose) userProfileClose.addEventListener(
        "click",
        closeUserProfile
    );
}


if (userProfileModal) {

    if (userProfileModal) userProfileModal.addEventListener(
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

    if (userProfileMessage) userProfileMessage.addEventListener(
        "click",
        () => {

            if (!selectedProfile) {
                return;
            }

            closeUserProfile();

            activeChatUsername = selectedProfile.username;

            openChat(
                selectedProfile.name,
                "@" +
                selectedProfile.username
            );

            if (realSearchInput) {
                realSearchInput.value = "";
            }

            loadChatMessages(
                selectedProfile.username
            );
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


/* =========================
   FINAL SEARCH HOOK
========================= */

window.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("searchInput");
    const list = document.getElementById("chatList");

    console.log("FINAL SEARCH HOOK:", !!input, !!list);

    if (!input || !list) {
        console.error("FINAL SEARCH: elements missing");
        return;
    }

    input.addEventListener("keydown", async (event) => {

        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();

        const q = input.value.trim();

        console.log("FINAL SEARCH ENTER:", q);

        if (!q) {
            return;
        }

        const token = localStorage.getItem("media_token");

        if (!token) {
            console.error("FINAL SEARCH: token missing");
            return;
        }

        try {

            const response = await fetch(
                `${window.location.origin}/users/search?q=${encodeURIComponent(q)}`,
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const data = await response.json();

            console.log("FINAL SEARCH RESULT:", data);

            list.innerHTML = "";

            if (!response.ok || !data.users || !data.users.length) {

                list.innerHTML = `
                    <div class="empty-chat-list">
                        <div class="empty-list-icon">🔎</div>
                        <strong>کاربری پیدا نشد</strong>
                        <span>نام یا نام کاربری دیگری امتحان کنید.</span>
                    </div>
                `;

                return;
            }

            data.users.forEach(user => {

                const item = document.createElement("button");

                item.type = "button";
                item.className = "chat-item real-search-user";

                item.innerHTML = `
                    <div class="chat-avatar">
                        ${user.role === "owner" ? "👑" : "👤"}
                    </div>
                    <div class="chat-item-info">
                        <strong></strong>
                        <span></span>
                    </div>
                `;

                item.querySelector("strong").textContent =
                    user.name || user.username;

                item.querySelector("span").textContent =
                    "@" + user.username;

                list.appendChild(item);
            });

        } catch (error) {

            console.error("FINAL SEARCH ERROR:", error);
        }
    });
});
