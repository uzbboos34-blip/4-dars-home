const token = window.localStorage.getItem("accessToken")
if (!token) {
    window.location = "/register"
}
const socket = io("http://localhost:4545", {
    auth:{
        headers:token
    },
    transports: ["websocket", "polling"]
})

async function register(e) {
        try {
        e.preventDefault()

        const formData = new FormData()
        formData.append("username", usernameInput.value)
        formData.append("email", email.value)
        formData.append("otp", otpInput.value)
        formData.append("password", passwordInput.value)
        formData.append("file", uploadInput.files[0])        

        const newUser = await axios.post("http://localhost:4545/api/register",formData)
        console.log(newUser);
        

    
        if (newUser.data.status == 201) {
            window.localStorage.setItem("accessToken", newUser.data.accessToken)
            window.localStorage.setItem("avatar",newUser.data.avatar)
            window.location = "/"
        }
        } catch (error) {
            alert(error.response.data.message);
        }
        
} 
const openModal = document.getElementById("openModal");
const sendOtp = document.getElementById("sendOtp");
const modal = document.getElementById("emailModal");
const closeBtn = document.querySelector(".close");
const emailInput = document.getElementById("emailInput");

openModal.onclick = () => { modal.classList.add("active")};

closeBtn.onclick = () => { modal.classList.remove("active")};

sendOtp.onclick = async () => {
    const email = emailInput.value.trim();

    if (!email) {
    alert("Email kiriting!");
    return;
    }


    try {
        const res = await axios.post("http://localhost:4545/send", { email });

        if (res.status == 200) {
            alert("Kod yuborildi!");
        }
    } catch (err) {
        alert("Xatolik yuz berdi");
    }
};


submitButton.onclick = register

showButton.addEventListener("click", () => {
    if (passwordInput.type === "password") {
    passwordInput.type = "text";
    } else {
    passwordInput.type = "password";
    }
})