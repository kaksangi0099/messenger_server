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
const chatHeaderAvatar =
    document.getElementById("chatHeaderAvatar");

/* =========================
   CHAT HEADER PROFILE
========================= */

const chatHeaderInfo =
    document.querySelector(".chat-header-info");

function openActiveChatProfile() {

    if (!activeChatUsername) {
        return;
    }

    openUserProfile(activeChatUsername);
}

if (chatHeaderAvatar) {
    chatHeaderAvatar.addEventListener(
        "click",
        openActiveChatProfile
    );
}

if (chatHeaderInfo) {
    chatHeaderInfo.style.cursor = "pointer";

    chatHeaderInfo.addEventListener(
        "click",
        openActiveChatProfile
    );
}


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

    // بارگذاری گفتگوهای قبلی بعد از آماده شدن کامل رابط
    setTimeout(() => {
        if (typeof loadRecentChats === "function") {
            loadRecentChats();
        }
    }, 0);

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




if (notificationSetting) notificationSetting.addEventListener(
    "click",
    () => {

        alert(
            "تنظیمات اعلان‌ها آماده است."
        );
    }
);


const privacyOverlay =
    document.getElementById("privacyOverlay");

const closePrivacy =
    document.getElementById("closePrivacy");

function openPrivacyPanel() {

    if (!privacyOverlay) {
        return;
    }

    privacyOverlay.classList.add("open");

    loadPrivacySettings();
}

function closePrivacyPanel() {

    if (!privacyOverlay) {
        return;
    }

    privacyOverlay.classList.remove("open");
}

if (privacySetting) {
    privacySetting.addEventListener(
        "click",
        () => {
            openPrivacyPanel();

            setTimeout(() => {
                if (typeof openMediaPrivacy === "function") {
                    openMediaPrivacy();
                }
            }, 0);
        }
    );
}

if (closePrivacy) {
    closePrivacy.addEventListener(
        "click",
        closePrivacyPanel
    );
}

if (privacyOverlay) {
    privacyOverlay.addEventListener(
        "click",
        event => {
            if (event.target === privacyOverlay) {
                closePrivacyPanel();
            }
        }
    );
}

function getPrivacyKey() {

    if (currentUser && currentUser.username) {
        return "media_privacy_" + currentUser.username;
    }

    return "media_privacy_default";
}

function loadPrivacySettings() {

    const saved = JSON.parse(
        localStorage.getItem(getPrivacyKey()) || "{}"
    );

    document
        .querySelectorAll("[data-privacy]")
        .forEach(select => {

            const key =
                select.dataset.privacy;

            if (saved[key]) {
                select.value = saved[key];
            }
        });
}

document
    .querySelectorAll("[data-privacy]")
    .forEach(select => {

        select.addEventListener(
            "change",
            () => {

                const key =
                    getPrivacyKey();

                const saved =
                    JSON.parse(
                        localStorage.getItem(key) || "{}"
                    );

                saved[select.dataset.privacy] =
                    select.value;

                localStorage.setItem(
                    key,
                    JSON.stringify(saved)
                );

                const status =
                    document.getElementById(
                        "privacySaveStatus"
                    );

                if (status) {
                    status.textContent =
                        "✓ تنظیمات ذخیره شد";
                }
            }
        );
    });



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

    if (activeChatUsername === "media_1234") {
        chatTitle.innerHTML =
            '<span class="royal-crown">♛</span>' +
            '<span class="royal-name">Медиа Поддержка</span>' +
            '<span class="royal-crown">♛</span>';
        chatTitle.classList.add("royal-support-name");
    } else {
        chatTitle.textContent = title;
        chatTitle.classList.remove("royal-support-name");
    }

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

    // باز کردن چت
    openChat(
        username,
        "در حال دریافت پیام‌ها..."
    );

    // بستن پنل‌های اضافی
    if (settingsPanel) {
        settingsPanel.classList.remove("open");
    }

    if (userProfileModal) {
        userProfileModal.classList.remove("open");
        userProfileModal.classList.remove("show");
    }

    // نمایش موقت پیام‌ها
    if (messages) {
        messages.innerHTML = `
            <div style="text-align:center;padding:20px;color:#999;">
                در حال دریافت پیام‌ها...
            </div>
        `;
    }

    /*
     * =========================
     * PROFILE
     * =========================
     *
     * خراب شدن پروفایل نباید
     * جلوی دریافت پیام‌ها را بگیرد.
     */

    try {

        const profileResponse = await fetch(
            `${API_URL}/profile/${encodeURIComponent(username)}`,
            {
                headers: {
                    "Authorization": "Bearer " + getToken()
                }
            }
        );

        if (profileResponse.ok) {

            const profile = await profileResponse.json();

            // عکس هدر
            if (chatHeaderAvatar) {

                chatHeaderAvatar.innerHTML = "";

                if (profile.avatar_url) {

                    const avatarImg =
                        document.createElement("img");

                    avatarImg.src =
                        profile.avatar_url.startsWith("http")
                            ? profile.avatar_url
                            : API_URL + profile.avatar_url;

                    avatarImg.alt =
                        profile.name ||
                        profile.username ||
                        "کاربر";

                    avatarImg.style.width = "100%";
                    avatarImg.style.height = "100%";
                    avatarImg.style.objectFit = "cover";
                    avatarImg.style.borderRadius = "50%";

                    chatHeaderAvatar.appendChild(
                        avatarImg
                    );

                } else {

                    chatHeaderAvatar.textContent =
                        createDefaultAvatar(
                            profile.name ||
                            profile.username ||
                            "کاربر"
                        );
                }
            }

            // نام
            if (chatTitle) {
                chatTitle.textContent =
                    profile.name ||
                    profile.username ||
                    username;
            }

            // وضعیت
            if (chatStatus) {

                if (profile.is_online) {

                    chatStatus.textContent =
                        "🟢 آنلاین";

                } else if (profile.last_seen) {

                    chatStatus.textContent =
                        "آخرین بازدید: " +
                        formatLastSeen(profile.last_seen);

                } else {

                    chatStatus.textContent =
                        "آخرین بازدید مشخص نیست";
                }
            }

        } else {

            console.warn(
                "Profile unavailable:",
                profileResponse.status
            );

            if (chatTitle) {
                chatTitle.textContent = username;
            }

            if (chatStatus) {
                chatStatus.textContent =
                    "@" + username;
            }
        }

    } catch (profileError) {

        console.warn(
            "Profile request failed, loading messages anyway:",
            profileError
        );

        if (chatTitle) {
            chatTitle.textContent = username;
        }

        if (chatStatus) {
            chatStatus.textContent =
                "@" + username;
        }
    }


    /*
     * =========================
     * MESSAGES
     * =========================
     *
     * این قسمت مستقل از پروفایل است.
     */

    try {

        const token = getToken();

        if (!token) {

            throw new Error(
                "NO_TOKEN"
            );
        }

        const response = await fetch(
            `${API_URL}/messages/${encodeURIComponent(username)}`,
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const data = await response.json();

        console.log("MESSAGES API STATUS:", response.status);
        console.log("MESSAGES API DATA:", data);

        if (!response.ok) {

            console.error(
                "Messages API error:",
                response.status,
                data
            );

            if (messages) {
                messages.innerHTML = `
                    <div style="text-align:center;padding:20px;color:#999;">
                        ${escapeHtml(
                            data.detail ||
                            "پیام‌ها دریافت نشدند."
                        )}
                    </div>
                `;
            }

            return;
        }

        if (messages) {

            messages.innerHTML = "";

            const chatMessages =
                data.messages || [];

            if (chatMessages.length === 0) {

                messages.innerHTML = `
                    <div style="text-align:center;padding:30px;color:#999;">
                        هنوز پیامی وجود ندارد 💜
                    </div>
                `;

            } else {

                chatMessages.forEach(
                    renderMessage
                );

                messages.scrollTop =
                    messages.scrollHeight;
            }
        }

    } catch (error) {

        console.error(
            "Load messages error:",
            error
        );

        if (chatStatus) {
            chatStatus.textContent =
                "خطا در اتصال";
        }

        if (messages) {
            messages.innerHTML = `
                <div style="text-align:center;padding:20px;color:#999;">
                    اتصال به سرور برقرار نشد.
                </div>
            `;
        }
    }
}

function formatFileSize(bytes) {

    const size = Number(bytes || 0);

    if (size < 1024) {
        return size + " B";
    }

    if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + " KB";
    }

    if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(1) + " MB";
    }

    return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}


function renderMessage(message) {

    const bubble = document.createElement("div");

    bubble.className = "message-bubble";

    const mine =
        Number(message.sender_id) === Number(currentUser.id);

    bubble.style.maxWidth = "78%";
    bubble.style.width = "fit-content";
    bubble.style.margin = mine
        ? "6px 8px 6px auto"
        : "6px auto 6px 8px";

    bubble.style.padding = "9px 11px";
    bubble.style.borderRadius = mine
        ? "18px 18px 5px 18px"
        : "18px 18px 18px 5px";

    bubble.style.lineHeight = "1.55";
    bubble.style.wordBreak = "break-word";
    bubble.style.boxShadow = "0 1px 2px rgba(0,0,0,.08)";

    if (mine) {

        bubble.style.color = "#ffffff";
        bubble.style.background =
            "linear-gradient(135deg,#8b5cf6,#6d28d9)";

    } else {

        bubble.style.color = "#222222";
        bubble.style.background = "#f1edff";
    }


    /* TEXT */

    if (message.text) {

        const textElement =
            document.createElement("div");

        textElement.textContent =
            message.text;

        textElement.style.whiteSpace =
            "pre-wrap";

        bubble.appendChild(
            textElement
        );
    }


    /* MEDIA */

    if (message.media_url) {

        const url =
            message.media_url.startsWith("http")
                ? message.media_url
                : API_URL + message.media_url;


        /* IMAGE */

        if (message.media_type === "image") {

            const img =
                document.createElement("img");

            img.src = url;

            img.alt =
                message.media_filename ||
                "image";

            img.loading = "lazy";

            img.style.display = "block";
            img.style.maxWidth = "280px";
            img.style.maxHeight = "380px";
            img.style.width = "auto";
            img.style.height = "auto";
            img.style.borderRadius = "14px";
            img.style.objectFit = "cover";
            img.style.marginTop =
                message.text ? "7px" : "0";

            img.style.cursor = "pointer";

            img.addEventListener(
                "click",
                () => {
                    window.open(
                        url,
                        "_blank"
                    );
                }
            );

            bubble.appendChild(img);
        }


        /* VIDEO */

        else if (
            message.media_type === "video"
        ) {

            const video =
                document.createElement("video");

            video.src = url;

            video.controls = true;
            video.preload = "metadata";

            video.style.display = "block";
            video.style.maxWidth = "280px";
            video.style.maxHeight = "380px";
            video.style.borderRadius = "14px";

            video.style.marginTop =
                message.text ? "7px" : "0";

            bubble.appendChild(video);
        }


        /* FILE */

        else if (
            message.media_type === "file"
        ) {

            const fileCard =
                document.createElement("a");

            fileCard.href = url;
            fileCard.target = "_blank";
            fileCard.rel = "noopener noreferrer";

            fileCard.style.display = "flex";
            fileCard.style.alignItems = "center";
            fileCard.style.gap = "10px";

            fileCard.style.minWidth = "220px";
            fileCard.style.maxWidth = "280px";

            fileCard.style.padding =
                "10px";

            fileCard.style.marginTop =
                message.text ? "7px" : "0";

            fileCard.style.borderRadius =
                "13px";

            fileCard.style.textDecoration =
                "none";

            fileCard.style.background =
                mine
                    ? "rgba(255,255,255,.15)"
                    : "rgba(109,40,217,.08)";


            const icon =
                document.createElement("div");

            icon.textContent = "📎";

            icon.style.fontSize =
                "27px";

            fileCard.appendChild(icon);


            const info =
                document.createElement("div");

            info.style.minWidth = "0";
            info.style.flex = "1";


            const filename =
                document.createElement("div");

            filename.textContent =
                message.media_filename ||
                "فایل";

            filename.style.fontWeight =
                "600";

            filename.style.fontSize =
                "14px";

            filename.style.whiteSpace =
                "nowrap";

            filename.style.overflow =
                "hidden";

            filename.style.textOverflow =
                "ellipsis";


            const size =
                document.createElement("div");

            size.textContent =
                formatFileSize(
                    message.media_size
                );

            size.style.fontSize =
                "11px";

            size.style.opacity =
                "0.7";

            size.style.marginTop =
                "2px";


            info.appendChild(filename);
            info.appendChild(size);

            fileCard.appendChild(info);

            bubble.appendChild(fileCard);
        }
    }


    /* TIME */

    const time =
        document.createElement("div");

    time.textContent =
        formatLastSeen(
            message.created_at
        );

    time.style.fontSize =
        "10px";

    time.style.opacity =
        "0.65";

    time.style.marginTop =
        "4px";

    time.style.textAlign =
        mine ? "right" : "left";

    bubble.appendChild(time);


    messages.appendChild(
        bubble
    );
}


/* =========================
   UPLOAD MEDIA
========================= */

async function uploadMedia(file) {

    if (!file) {
        return null;
    }

    if (!currentUser) {
        alert("ابتدا وارد حساب شوید.");
        return null;
    }

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    const response =
        await fetch(
            `${API_URL}/upload`,
            {
                method: "POST",

                headers: {
                    "Authorization":
                        "Bearer " + getToken()
                },

                body: formData
            }
        );


    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }


    if (!response.ok) {

        throw new Error(
            data.detail ||
            "آپلود فایل انجام نشد."
        );
    }


    return data;
}


/* =========================
   SEND MESSAGE
========================= */

async function sendMessage(
    uploadedMedia = null
) {

    const text =
        messageInput.value.trim();


    if (!activeChatUsername) {

        alert(
            "اول یک کاربر را برای گفتگو انتخاب کنید."
        );

        return;
    }


    if (!text && !uploadedMedia) {
        return;
    }


    const oldText =
        messageInput.value;


    sendButton.disabled = true;


    try {

        const params =
            new URLSearchParams();


        params.set(
            "receiver_username",
            activeChatUsername
        );


        params.set(
            "text",
            text
        );


        if (uploadedMedia) {

            params.set(
                "media_url",
                uploadedMedia.url
            );

            params.set(
                "media_type",
                uploadedMedia.type
            );

            params.set(
                "media_filename",
                uploadedMedia.filename ||
                "file"
            );

            params.set(
                "media_size",
                String(
                    uploadedMedia.size || 0
                )
            );
        }


        const response =
            await fetch(
                `${API_URL}/messages?${params.toString()}`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            "Bearer " + getToken()
                    }
                }
            );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "پیام ارسال نشد."
            );
        }


        messageInput.value = "";


        const sentTo =
            activeChatUsername;


        await loadChatMessages(
            sentTo
        );


        await loadRecentChats();


    } catch (error) {

        console.error(
            "Send message error:",
            error
        );


        messageInput.value =
            oldText;


        alert(
            error.message ||
            "ارسال پیام انجام نشد."
        );


    } finally {

        sendButton.disabled =
            false;

        messageInput.focus();
    }
}


/* =========================
   TEXT SEND BUTTON
========================= */

if (sendButton) {

    sendButton.addEventListener(
        "click",
        () => sendMessage()
    );
}


if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();
            }
        }
    );
}


/* =========================
   FILE PICKER
========================= */

function chooseMediaFile(
    accept
) {

    const input =
        document.createElement(
            "input"
        );

    input.type = "file";

    input.accept = accept;

    input.style.display = "none";

    document.body.appendChild(
        input
    );


    input.addEventListener(
        "change",
        async () => {

            const file =
                input.files &&
                input.files[0];


            input.remove();


            if (!file) {
                return;
            }


            if (!activeChatUsername) {

                alert(
                    "ابتدا یک کاربر را برای گفتگو انتخاب کنید."
                );

                return;
            }


            try {

                sendButton.disabled =
                    true;


                const uploaded =
                    await uploadMedia(
                        file
                    );


                if (!uploaded) {
                    return;
                }


                await sendMessage(
                    uploaded
                );


            } catch (error) {

                console.error(
                    "Media upload error:",
                    error
                );

                alert(
                    error.message ||
                    "ارسال فایل انجام نشد."
                );


            } finally {

                sendButton.disabled =
                    false;
            }
        }
    );


    input.click();
}


/* =========================
   MEDIA BUTTONS
========================= */

if (mediaButton) {

    mediaButton.addEventListener(
        "click",
        () => {

            chooseMediaFile(
                "image/*,video/*"
            );
        }
    );
}


if (fileButton) {

    fileButton.addEventListener(
        "click",
        () => {

            chooseMediaFile(
                "*/*"
            );
        }
    );
}

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
        if (user.role === "owner") {
            name.innerHTML =
                '<span class="royal-crown">♛</span>' +
                '<span class="royal-name">Медиа Поддержка</span>' +
                '<span class="royal-crown">♛</span>';
            name.classList.add("royal-support-name");
        } else {
            name.textContent =
                user.name || user.username || "کاربر";
        }

        const username = document.createElement("span");
        username.className = "search-user-username";
        username.textContent =
            "@" + (user.username || "");

        info.appendChild(name);
        info.appendChild(username);

        item.appendChild(avatar);
        item.appendChild(info);

        item.addEventListener("click", async (event) => {

            event.preventDefault();
            event.stopPropagation();

            const usernameValue = user.username;

            if (!usernameValue) {
                console.error("PROFILE: username missing");
                return;
            }

            console.log("OPEN PROFILE:", usernameValue);

            await openUserProfile(usernameValue);

        });

        list.appendChild(item);
    });

    console.log("SEARCH DISPLAYED:", users.length);
}

async function restoreEmptyChatList() {

    if (!realChatList) {
        return;
    }

    await loadRecentChats();
}


async function loadRecentChats() {

    if (!realChatList) {
        return;
    }

    const token = getToken();

    if (!token) {
        return;
    }

    realChatList.innerHTML = `
        <div class="empty-chat-list">
            <div class="empty-list-icon">💬</div>
            <strong>در حال دریافت گفتگوها...</strong>
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}/chats`,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "گفتگوها دریافت نشدند."
            );
        }

        renderRecentChats(data.chats || []);

    } catch (error) {

        console.error(
            "Recent chats error:",
            error
        );

        realChatList.innerHTML = `
            <div class="empty-chat-list">
                <div class="empty-list-icon">💬</div>
                <strong>هنوز گفتگویی ندارید</strong>
                <span>یک گفتگوی جدید شروع کنید.</span>
            </div>
        `;
    }
}


function renderRecentChats(chats) {

    if (!realChatList) {
        return;
    }

    realChatList.innerHTML = "";

    if (!Array.isArray(chats) || chats.length === 0) {

        realChatList.innerHTML = `
            <div class="empty-chat-list">
                <div class="empty-list-icon">💬</div>
                <strong>هنوز گفتگویی ندارید</strong>
                <span>یک گفتگوی جدید شروع کنید.</span>
            </div>
        `;

        return;
    }

    chats.forEach(chat => {

        const item = document.createElement("button");

        item.type = "button";
        item.className = "chat-item recent-chat-item";

        const avatar = document.createElement("div");

        avatar.className = "chat-avatar";

        if (chat.avatar_url) {

            const avatarUrl =
                chat.avatar_url.startsWith("http")
                    ? chat.avatar_url
                    : API_URL + chat.avatar_url;

            const img = document.createElement("img");

            img.src = avatarUrl;
            img.alt = chat.name || "کاربر";
            img.loading = "lazy";

            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";
            img.style.borderRadius = "50%";

            avatar.appendChild(img);

        } else if (chat.role === "owner") {

            avatar.textContent = "👑";

        } else {

            const letter =
                (
                    chat.name ||
                    chat.username ||
                    "ک"
                )
                .trim()
                .charAt(0);

            avatar.textContent =
                letter.toUpperCase();
        }

        const info = document.createElement("div");

        info.className =
            "chat-item-info";

        const name = document.createElement("strong");

        name.className =
            "recent-chat-name";

        name.textContent =
            chat.name ||
            chat.username ||
            "کاربر";

        const preview = document.createElement("span");

        preview.className =
            "recent-chat-preview";

        preview.textContent =
            chat.last_message ||
            "پیامی وجود ندارد";

        info.appendChild(name);
        info.appendChild(preview);

        const time = document.createElement("span");

        time.className =
            "recent-chat-time";

        if (chat.last_message_at) {

            time.textContent =
                formatLastSeen(
                    chat.last_message_at
                );
        }

        item.appendChild(avatar);
        item.appendChild(info);
        item.appendChild(time);

        item.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                if (!chat.username) {
                    return;
                }

                await loadChatMessages(
                    chat.username
                );
            }
        );

        realChatList.appendChild(item);
    });
}


/* =========================
   PROFILE
========================= */

async function openUserProfile(username) {

    console.log("PROFILE FUNCTION START:", username);

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

        console.log("PROFILE RESPONSE STATUS:", response.status);
        console.log("PROFILE RESPONSE DATA:", data);

        if (!response.ok) {

            alert(
                "خطای پروفایل: HTTP " +
                response.status +
                "\n" +
                (data.detail || "پروفایل قابل دریافت نیست.")
            );

            return;
        }

        console.log("PROFILE SUCCESS:", data);

        selectedProfile = data;

        userProfileName.innerHTML = "";

        const profileName = document.createElement("span");
        profileName.className = "media-owner-name";

        if (data.role === "owner") {
            profileName.appendChild(
                document.createTextNode(
                    "𓆩 Медиа"
                )
            );

            const fire = document.createElement("span");
            fire.className = "media-owner-fire";
            fire.textContent = "❤️‍🔥";
            fire.title = "پشتیبانی رسمی مدیا";

            profileName.appendChild(fire);

            profileName.appendChild(
                document.createTextNode(
                    "поддержка 𓆪"
                )
            );
        } else {
            profileName.textContent =
                data.name || "کاربر مدیا";
        }

        userProfileName.appendChild(profileName);

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


        // گیفت کوتاه پروفایل
        const oldGift =
            userProfileModal.querySelector(".media-gift");

        if (oldGift) {
            oldGift.remove();
        }

        const gift =
            document.createElement("div");

        gift.className = "media-gift";

        gift.textContent =
            data.role === "owner"
                ? "✨"
                : "🎁";

        const avatarWrap =
            userProfileModal.querySelector(
                ".user-profile-avatar-wrap"
            );

        if (avatarWrap) {
            avatarWrap.appendChild(gift);

            setTimeout(() => {
                gift.remove();
            }, 550);
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
   ACCOUNT PROFILE EDITOR
========================= */

const accountPanel =
    document.getElementById("accountPanel");

const closeAccountPanel =
    document.getElementById("closeAccountPanel");

const accountName =
    document.getElementById("accountName");

const accountUsername =
    document.getElementById("accountUsername");

const accountBio =
    document.getElementById("accountBio");

const accountShowEmail =
    document.getElementById("accountShowEmail");

const accountEmail =
    document.getElementById("accountEmail");

const accountAvatarPreview =
    document.getElementById("accountAvatarPreview");

const accountSaveStatus =
    document.getElementById("accountSaveStatus");


async function loadMyAccountProfile() {

    if (!currentUser || !currentUser.username) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/profile/${encodeURIComponent(currentUser.username)}`,
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
            throw new Error(
                data.detail ||
                "پروفایل دریافت نشد."
            );
        }


        if (accountName) {
            accountName.value =
                data.name || "";
        }


        if (accountUsername) {
            accountUsername.value =
                data.username || "";
        }


        if (accountBio) {
            accountBio.value =
                data.bio || "";
        }


        if (accountShowEmail) {
            accountShowEmail.checked =
                Boolean(data.email);
        }


        if (accountEmail) {
            accountEmail.textContent =
                data.email ||
                "ایمیل مخفی است";
        }


        if (accountAvatarPreview) {

            if (data.avatar_url) {

                accountAvatarPreview.src =
                    data.avatar_url.startsWith("http")
                        ? data.avatar_url
                        : API_URL + data.avatar_url;

            } else {

                accountAvatarPreview.src =
                    createDefaultAvatar(
                        data.name
                    );
            }
        }

    } catch (error) {

        console.error(
            "Account profile load error:",
            error
        );

        if (accountSaveStatus) {
            accountSaveStatus.textContent =
                "دریافت اطلاعات حساب انجام نشد.";
        }
    }
}


/* OPEN ACCOUNT PANEL */

if (accountSetting) {

    accountSetting.addEventListener(
        "click",
        async () => {

            if (!accountPanel) {
                return;
            }

            accountPanel.classList.add("open");

            await loadMyAccountProfile();
        }
    );
}


/* CLOSE ACCOUNT PANEL */

if (closeAccountPanel) {

    closeAccountPanel.addEventListener(
        "click",
        () => {

            if (accountPanel) {
                accountPanel.classList.remove("open");
            }

        }
    );
}


/* EMAIL PREVIEW */

if (accountShowEmail) {

    accountShowEmail.addEventListener(
        "change",
        () => {

            if (!accountEmail) {
                return;
            }

            if (accountShowEmail.checked) {

                accountEmail.textContent =
                    currentUser?.email ||
                    "ایمیل حساب";

            } else {

                accountEmail.textContent =
                    "ایمیل مخفی است";
            }
        }
    );
}


/* =========================
   ACCOUNT SAVE / AVATAR
========================= */

const saveAccountButton =
    document.getElementById("saveAccountButton");

const changeAvatarButton =
    document.getElementById("changeAvatarButton");

const accountAvatarInput =
    document.getElementById("accountAvatarInput");

const removeAvatarButton =
    document.getElementById("removeAvatarButton");


/* CHANGE AVATAR */

if (changeAvatarButton && accountAvatarInput) {

    changeAvatarButton.addEventListener(
        "click",
        () => {
            accountAvatarInput.click();
        }
    );

}


/* SELECT AVATAR */

if (accountAvatarInput) {

    accountAvatarInput.addEventListener(
        "change",
        async () => {

            const file =
                accountAvatarInput.files?.[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                alert("لطفاً یک عکس انتخاب کنید.");

                accountAvatarInput.value = "";

                return;
            }

            try {

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        "در حال آپلود عکس...";
                }

                const uploaded =
                    await uploadMedia(file);

                if (!uploaded?.url) {
                    throw new Error(
                        "آدرس عکس دریافت نشد."
                    );
                }

                const response =
                    await fetch(
                        `${API_URL}/profile`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + getToken()
                            },

                            body: JSON.stringify({
                                avatar_url:
                                    uploaded.url
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "ذخیره عکس انجام نشد."
                    );
                }

                const avatarUrl =
                    uploaded.url.startsWith("http")
                        ? uploaded.url
                        : API_URL + uploaded.url;

                if (accountAvatarPreview) {
                    accountAvatarPreview.src =
                        avatarUrl;
                }

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        "عکس پروفایل با موفقیت تغییر کرد. ✓";
                }

                accountAvatarInput.value = "";

                await loadMyAccountProfile();

            } catch (error) {

                console.error(
                    "Avatar upload error:",
                    error
                );

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        error.message ||
                        "آپلود عکس انجام نشد.";
                }

            }
        }
    );

}


/* REMOVE AVATAR */

if (removeAvatarButton) {

    removeAvatarButton.addEventListener(
        "click",
        async () => {

            try {

                removeAvatarButton.disabled =
                    true;

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        "در حال حذف عکس...";
                }

                const response =
                    await fetch(
                        `${API_URL}/profile`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + getToken()
                            },

                            body: JSON.stringify({
                                avatar_url: ""
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "حذف عکس انجام نشد."
                    );
                }

                if (accountAvatarPreview) {

                    accountAvatarPreview.src =
                        createDefaultAvatar(
                            currentUser?.name ||
                            "کاربر"
                        );
                }

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        "عکس پروفایل حذف شد. ✓";
                }

                await loadMyAccountProfile();

            } catch (error) {

                console.error(
                    "Remove avatar error:",
                    error
                );

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        error.message ||
                        "حذف عکس انجام نشد.";
                }

            } finally {

                removeAvatarButton.disabled =
                    false;
            }
        }
    );

}


/* SAVE ACCOUNT */

if (saveAccountButton) {

    saveAccountButton.addEventListener(
        "click",
        async () => {

            try {

                const name =
                    accountName?.value.trim() || "";

                const bio =
                    accountBio?.value.trim() || "";

                const showEmail =
                    Boolean(
                        accountShowEmail?.checked
                    );

                if (name.length < 2) {

                    if (accountSaveStatus) {
                        accountSaveStatus.textContent =
                            "نام باید حداقل ۲ کاراکتر باشد.";
                    }

                    accountName?.focus();

                    return;
                }

                if (bio.length > 160) {

                    if (accountSaveStatus) {
                        accountSaveStatus.textContent =
                            "بیو نمی‌تواند بیشتر از ۱۶۰ کاراکتر باشد.";
                    }

                    return;
                }

                saveAccountButton.disabled =
                    true;

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        "در حال ذخیره تغییرات...";
                }

                const response =
                    await fetch(
                        `${API_URL}/profile`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + getToken()
                            },

                            body: JSON.stringify({
                                name: name,
                                bio: bio,
                                show_email:
                                    showEmail
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "ذخیره تغییرات انجام نشد."
                    );
                }

                if (currentUser) {

                    currentUser.name =
                        name;

                    saveUser(currentUser);
                }

                if (accountEmail) {

                    accountEmail.textContent =
                        showEmail
                            ? (
                                currentUser?.email ||
                                "ایمیل حساب"
                            )
                            : "ایمیل مخفی است";
                }

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        "تغییرات با موفقیت ذخیره شد. ✓";
                }

                await loadRecentChats();

            } catch (error) {

                console.error(
                    "Save account error:",
                    error
                );

                if (accountSaveStatus) {
                    accountSaveStatus.textContent =
                        error.message ||
                        "ذخیره تغییرات انجام نشد.";
                }

            } finally {

                saveAccountButton.disabled =
                    false;
            }
        }
    );

}


/* =========================================
   MEDIA PRIVACY / SECURITY
========================================= */

const privacySubPanel =
    document.getElementById("privacySubPanel");

const closePrivacySubPanel =
    document.getElementById("closePrivacySubPanel");

const savePrivacyButton =
    document.getElementById("savePrivacyButton");

const privacySaveStatus =
    document.getElementById("privacySaveStatus");

const privacyOnline =
    document.getElementById("privacyOnline");

const privacyProfile =
    document.getElementById("privacyProfile");

const privacyEmail =
    document.getElementById("privacyEmail");

const privacyMessages =
    document.getElementById("privacyMessages");

const privacyLastSeen =
    document.getElementById("privacyLastSeen");

const changePasswordButton =
    document.getElementById("changePasswordButton");

const activeSessionsButton =
    document.getElementById("activeSessionsButton");

const passwordDialog =
    document.getElementById("passwordDialog");

const closePasswordDialog =
    document.getElementById("closePasswordDialog");

const savePasswordButton =
    document.getElementById("savePasswordButton");

const currentPasswordInput =
    document.getElementById("currentPasswordInput");

const newPasswordInput =
    document.getElementById("newPasswordInput");

const newPassword2Input =
    document.getElementById("newPassword2Input");

const passwordSaveStatus =
    document.getElementById("passwordSaveStatus");

const sessionsDialog =
    document.getElementById("sessionsDialog");

const closeSessionsDialog =
    document.getElementById("closeSessionsDialog");

const sessionsList =
    document.getElementById("sessionsList");

const logoutOtherSessionsButton =
    document.getElementById("logoutOtherSessionsButton");

const sessionsSaveStatus =
    document.getElementById("sessionsSaveStatus");


function mediaAuthHeaders() {

    const token =
        localStorage.getItem("media_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        ...(token
            ? {"Authorization": "Bearer " + token}
            : {})
    };
}


async function openMediaPrivacy() {

    if (!privacySubPanel) return;

    privacySubPanel.classList.remove("hidden");

    try {

        const response = await fetch(
            "/privacy",
            {
                headers: mediaAuthHeaders()
            }
        );

        if (!response.ok) {
            throw new Error("privacy_load_failed");
        }

        const data = await response.json();

        if (privacyOnline)
            privacyOnline.value =
                data.online_visibility || "everyone";

        if (privacyProfile)
            privacyProfile.value =
                data.profile_visibility || "everyone";

        if (privacyEmail)
            privacyEmail.value =
                data.email_visibility || "nobody";

        if (privacyMessages)
            privacyMessages.value =
                data.message_permission || "everyone";

        if (privacyLastSeen)
            privacyLastSeen.value =
                data.last_seen_visibility || "everyone";

    } catch (error) {

        if (privacySaveStatus) {
            privacySaveStatus.textContent =
                "❌ دریافت تنظیمات انجام نشد.";
        }

    }
}





if (closePrivacySubPanel) {

    closePrivacySubPanel.addEventListener(
        "click",
        () => {
            privacySubPanel.classList.add("hidden");
        }
    );

}


if (savePrivacyButton) {

    savePrivacyButton.addEventListener(
        "click",
        async () => {

            savePrivacyButton.disabled = true;

            if (privacySaveStatus)
                privacySaveStatus.textContent =
                    "در حال ذخیره...";

            try {

                const response = await fetch(
                    "/privacy",
                    {
                        method: "PUT",
                        headers: mediaAuthHeaders(),
                        body: JSON.stringify({
                            online_visibility:
                                privacyOnline.value,

                            profile_visibility:
                                privacyProfile.value,

                            email_visibility:
                                privacyEmail.value,

                            message_permission:
                                privacyMessages.value,

                            last_seen_visibility:
                                privacyLastSeen.value
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "save_failed"
                    );
                }

                if (privacySaveStatus)
                    privacySaveStatus.textContent =
                        "✅ تغییرات با موفقیت ذخیره شد.";

            } catch (error) {

                if (privacySaveStatus)
                    privacySaveStatus.textContent =
                        "❌ " +
                        (error.message ||
                        "ذخیره انجام نشد.");

            } finally {

                savePrivacyButton.disabled = false;

            }

        }
    );

}


if (changePasswordButton) {

    changePasswordButton.addEventListener(
        "click",
        () => {

            passwordDialog.classList.remove(
                "hidden"
            );

            if (passwordSaveStatus)
                passwordSaveStatus.textContent = "";

        }
    );

}


if (closePasswordDialog) {

    closePasswordDialog.addEventListener(
        "click",
        () => {
            passwordDialog.classList.add(
                "hidden"
            );
        }
    );

}


if (savePasswordButton) {

    savePasswordButton.addEventListener(
        "click",
        async () => {

            const current =
                currentPasswordInput.value;

            const next =
                newPasswordInput.value;

            const repeat =
                newPassword2Input.value;

            if (!current || !next || !repeat) {

                passwordSaveStatus.textContent =
                    "❌ همه فیلدها را کامل کنید.";

                return;

            }

            if (next !== repeat) {

                passwordSaveStatus.textContent =
                    "❌ تکرار رمز جدید یکسان نیست.";

                return;

            }

            savePasswordButton.disabled = true;

            passwordSaveStatus.textContent =
                "در حال تغییر رمز...";

            try {

                const response = await fetch(
                    "/change-password",
                    {
                        method: "POST",
                        headers: mediaAuthHeaders(),
                        body: JSON.stringify({
                            current_password:
                                current,

                            new_password:
                                next
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "تغییر رمز انجام نشد."
                    );
                }

                passwordSaveStatus.textContent =
                    "✅ رمز عبور با موفقیت تغییر کرد.";

                currentPasswordInput.value = "";
                newPasswordInput.value = "";
                newPassword2Input.value = "";

            } catch (error) {

                passwordSaveStatus.textContent =
                    "❌ " +
                    (error.message ||
                    "خطا در تغییر رمز.");

            } finally {

                savePasswordButton.disabled = false;

            }

        }
    );

}


async function loadMediaSessions() {

    sessionsList.innerHTML =
        '<div class="sessions-loading">در حال دریافت نشست‌ها...</div>';

    try {

        const response = await fetch(
            "/sessions",
            {
                headers: mediaAuthHeaders()
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "دریافت نشست‌ها انجام نشد."
            );
        }

        if (!data.sessions ||
            data.sessions.length === 0) {

            sessionsList.innerHTML =
                '<div class="sessions-empty">نشست فعالی ثبت نشده است.</div>';

            return;
        }

        sessionsList.innerHTML =
            data.sessions.map(
                session => `
                    <div class="session-item">
                        <div class="session-icon">
                            📱
                        </div>
                        <div class="session-info">
                            <strong>
                                ${session.current
                                    ? "این دستگاه"
                                    : "نشست فعال"}
                            </strong>
                            <small>
                                ${session.created_at
                                    ? new Date(
                                        session.created_at
                                      ).toLocaleString(
                                        "fa-IR"
                                      )
                                    : "زمان نامشخص"}
                            </small>
                        </div>
                        <span class="session-badge">
                            ${session.current
                                ? "فعلی"
                                : "فعال"}
                        </span>
                    </div>
                `
            ).join("");

    } catch (error) {

        sessionsList.innerHTML =
            `<div class="sessions-empty">
                ❌ ${error.message || "خطا در دریافت نشست‌ها"}
            </div>`;

    }

}


if (activeSessionsButton) {

    activeSessionsButton.addEventListener(
        "click",
        async () => {

            sessionsDialog.classList.remove(
                "hidden"
            );

            await loadMediaSessions();

        }
    );

}


if (closeSessionsDialog) {

    closeSessionsDialog.addEventListener(
        "click",
        () => {
            sessionsDialog.classList.add(
                "hidden"
            );
        }
    );

}


if (logoutOtherSessionsButton) {

    logoutOtherSessionsButton.addEventListener(
        "click",
        async () => {

            logoutOtherSessionsButton.disabled = true;

            sessionsSaveStatus.textContent =
                "در حال خروج...";

            try {

                const response = await fetch(
                    "/sessions/others",
                    {
                        method: "DELETE",
                        headers: mediaAuthHeaders()
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "عملیات انجام نشد."
                    );
                }

                sessionsSaveStatus.textContent =
                    "✅ نشست‌های دیگر خارج شدند.";

                await loadMediaSessions();

            } catch (error) {

                sessionsSaveStatus.textContent =
                    "❌ " +
                    (error.message ||
                    "خطا در خروج نشست‌ها.");

            } finally {

                logoutOtherSessionsButton.disabled =
                    false;

            }

        }
    );

}
