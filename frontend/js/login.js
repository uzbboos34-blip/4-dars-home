const token = window.localStorage.getItem("accessToken")
if (!token) {
    window.location = "/register"
}
const socket = io(BASE_URL.replace('/backend', ''), {
    auth:{
        headers:token
    },
    transports: ["websocket", "polling"]
})
async function login(e) {
    try {
    e.preventDefault()

    const fromData = new FormData()
    fromData.append("username", usernameInput.value)
    fromData.append("password", passwordInput.value)

    const user = await axios.post(`${BASE_URL}/api/login`, fromData)
    console.log(user);
    
    if (user.data.status == 200) {
        alert(user.data.message)
        window.localStorage.setItem("accessToken", user.data.accessToken)
        window.localStorage.setItem("avatar",user.data.avatar)
        window.location = "/admin"
    }
    } catch (error) {
        alert(error.response.data.message);
    }
}

submitButton.onclick = login

showButton.addEventListener("click", () => {
    if (passwordInput.type === "password") {
    passwordInput.type = "text";
    } else {
    passwordInput.type = "password";
    }
})