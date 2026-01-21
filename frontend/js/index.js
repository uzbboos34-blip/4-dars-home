const token = window.localStorage.getItem("accessToken")
// if (!token) {
//     window.location = "/register"
// }
const socket = io("http://localhost:4545", {
    auth:{
        headers:token
    },
    transports: ["websocket", "polling"]
})

let lastUserId

socket.on("connect", () => {
    console.log("Frontend ulandi")   
})
const navbarList = document.querySelector('.navbar-list');
const iframesList = document.querySelector('.iframes-list');
const inputSearch = document.getElementById('inputSearch');
const chatHeader = document.querySelector(".chat-header")

const avatar = window.localStorage.getItem("avatar")
list.innerHTML += `
        <img class="avatar-img" src="http://localhost:4545/file/${avatar}" alt="avatar-img" width="32px" height="32px">
`
async function getUser() {
        let res = await axios.get("http://localhost:4545/api/users");
        let users = res.data.data || [];

        for (const user of users) {
            navbarList.innerHTML += `
            <li onclick= "clickUser(${user.id}, '${user.username}', '${user.avatar}')" class="channel" data-user-id="${user.id}">
                <a href="#">
                    <img src="http://localhost:4545/file/${user.avatar}" alt="channel-icon" width="30px" height="30px">
                    <span>${user.username}</span>
                </a>
            </li>`;
        }

        document.querySelectorAll('.channel').forEach(channel => {
            channel.addEventListener('click', function(e) {
                e.preventDefault();

                document.querySelectorAll('.channel').forEach(el => el.classList.remove('active'));
                this.classList.add('active');

                const userId = this.dataset.userId;
                if (userId == 'main') {
                    getAllFiles();
                } else if (userId) {
                    getAllUserFiles(userId);
                }
            });
        });
}

let search = ""
function voice() {
    const recognition = new SpeechRecognition()
    recognition.start()
    recognition.lang = "uz-UZ"
    
    recognition.onresult = (e) => {
        console.log(e);
        
        search = e.results[0][0].transcript
        iframesList.innerHTML = ""
        getAllFiles()
    }
}
inputSearch.onkeydown = (e) => {
    console.log(e);
    
    if (e.keyCode == 13) {
        search = inputSearch.value
        iframesList.innerHTML = ""
        getAllFiles()
    }
}

async function getAllFiles() {
    let files = await axios.get(`http://localhost:4545/api/files/users?search=${search}`); 
    files = files.data.user
    

        for (const file of files) {
            iframesList.innerHTML +=`
                <li class="iframe">
                    <video src="http://localhost:4545/file/${file.file_name}" controls="" 
                        style="
                            width: 320px;
                            height: 250px;
                            border-radius: 15px;
                            margin-left: 20px;
                            border: 1px solid #ddd;"></video>
                    <div class="iframe-footer">
                        <img src="http://localhost:4545/file/${file.user.avatar}" alt="channel-icon">
                        <div class="iframe-footer-text">
                            <h2 class="channel-name">${file.user.username}</h2>
                            <h3 class="iframe-title">${file.title}</h3>
                            <time class="uploaded-time">${file.created_at}</time>
                            <a class="download" href="http://localhost:4545/api/file/download/${file.file_name}">
                                <span>${file.size} MB</span>
                                <img src="./img/download.png">
                            </a>
                        </div>                  
                    </div>
                </li>  
            `;
        }
}

async function getAllUserFiles(id) {
        let res = await axios.get(`http://localhost:4545/api/files/oneUser/${id}`);
        let files = res.data.files || [];
        
        

        iframesList.innerHTML = '';  

        for (const file of files) {
            iframesList.innerHTML +=`
                <li class="iframe">
                    <video src="http://localhost:4545/file/${file.file_name}" controls=""style="
                            width: 320px;
                            height: 250px;
                            border-radius: 15px;
                            margin-left: 20px;
                            border: 1px solid #ddd;"></video>
                    <div class="iframe-footer">
                        <img src="http://localhost:4545/file/${file.user.avatar}" alt="channel-icon">
                        <div class="iframe-footer-text">
                            <h2 class="channel-name">${file.user.username}</h2>
                            <h3 class="iframe-title">${file.title}</h3>
                            <time class="uploaded-time">${file.created_at}</time>
                            <a class="download" href="http://localhost:4545/api/file/${file.file_name}">
                                <span>${file.size} MB</span>
                                <img src="./img/download.png">
                            </a>
                        </div>                  
                    </div>
                </li>  
            `;
        }
}

async function clickUser(userIdTo, username, avatar){
    
    chatHeader.innerHTML =  `
    <img id="chatUserAvatar" src="http://localhost:4545/file/${avatar}"> 
                    <span id="chatUserName">${username}</span> `

    lastUserId = userIdTo
    chatBody.innerHTML = null
    let messages = await axios.get("http://localhost:4545/api/messages/" + userIdTo, {
        headers: {token:token}
    })
    messages =  messages.data.message

    for (const message of messages) {
        const file = message.message.split(".")[1]
        if(file == "jpg" || file == "mp4"){

            if (message.user_id_to == userIdTo) {
                chatBody.innerHTML += `
                <div class = "message me">
                    <img src="http://localhost:4545/file/${message.message}?media=true" width= 150 height= 100>
                </div>
            `
            }else{
                chatBody.innerHTML += `
                <div class = "message other">
                    <img src="http://localhost:4545/file/${message.message}?media=true" width= 150 height= 100>
                </div>
                `
            }
                
        }else{
            if (message.user_id_to == userIdTo) {
                chatBody.innerHTML += `
                <div class = "message me">
                    ${message.message}
                </div>
            `
            }else{
                chatBody.innerHTML += `
                <div class = "message other">
                    ${message.message}
                </div>
                `
            }
        }
        
    }
    
}

async function sendMessage() {

    const hasText = chatInput.value.trim().length > 0;
    const hasFile = mediaInput.files.length > 0;
    

    if (!hasText && !hasFile) {
        return;
    }

    if (mediaInput.files.length) {
        const fromdata = new FormData()
        fromdata.append("file",mediaInput.files[0])
        

        const res =  await axios.post("http://localhost:4545/api/messages/" + lastUserId,
            fromdata,
            {
                headers: {
                    token: token
                }
            }
        )
        
        if (res.status == 201) {
            chatBody.innerHTML += `
                <div class = "message me">
                    <img src="http://localhost:4545/file/${mediaInput.files[0]}?media=true" width= 150 height= 100>
                </div>
                `
        }
        
        chatInput.value = ""
        
    }else{
        const res =  await axios.post("http://localhost:4545/api/messages/" + lastUserId,
        {
            message: chatInput.value
        },
        {
            headers: {
                token: token
            }
        }
    )
        if (res.status == 201) {
            chatBody.innerHTML += `
                <div class = "message me">
                    ${chatInput.value}
                </div>
                `
        }
        
        chatInput.value = ""
    }
    
}
function massageRender() {
    location.reload();
}

list.addEventListener("click", () => {
    const token = window.localStorage.getItem("accessToken")
    if (token) {
        window.location = "/admin"
    } else {
        window.location = "/register"
    }
})
getUser();       
getAllFiles();  

socket.on("send_message", (msg, mimetype) => {
    const file = mimetype.split("/")[0]
    console.log(msg.rows[0].message);
    
    if (file != "plan") {
        chatBody.innerHTML += `
            <div class = "message other">
                <img src="http://localhost:4545/file/${msg.rows[0].message}?media=true" width= 150 height= 100>
            </div>
            `
    }else{
        chatBody.innerHTML += `
            <div class = "message other">
                ${msg.rows[0].message}
            </div>
            `
    }
    
})