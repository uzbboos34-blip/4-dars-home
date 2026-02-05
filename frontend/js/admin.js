const token = window.localStorage.getItem("accessToken")

if (!token) {
    window.location = "/login"
}
async function admin(e) {
    try {
        e.preventDefault()

        const fromData = new FormData()
        fromData.append("title", videoInput.value)
        fromData.append("file", uploadInput.files[0])

        await axios.post(`${BASE_URL}/api/files`,fromData,
            {
                headers: {token:token}
            }
        );
        alert("Video qo‘shildi");
        videoInput.value = "";
        uploadInput.value = "";
        location.reload();
    } catch (error) {
        alert(error.response.data.message);
    }

}

async function Videos() {
    const files = await axios.get(`${BASE_URL}/api/files/userfiles`,
        {
            headers: {token:token}
        }
    )
    
    for (const file of files.data) {
            videosList.innerHTML += `
                <li class="video-item">
                    <video 
                        controls 
                        src="${BASE_URL}/file/${file.file_name}">
                    </video>
                    <img 
                    class="delete-icon" 
                    src ="${BASE_URL}/file/delete.png"
                    width = "25"
                    onclick="deleteVideo(${file.id})">
                    
                    <p class = "content">${file.title}</p>
                </li>    
            `;  
    }
}

async function deleteVideo(id) {
    try {
        const res = await axios.delete(`${BASE_URL}/api/files/${id}`,{
        headers: {token:token}
        })
        console.log(res);
        
        if (res.status == 200) {
            alert(res.data.message);
            location.reload();
        }
    } catch (error) {
        alert("Xatolik bo'ldi ❌");
    }
    
    
}

async function logoutBtn() {
    window.location = "/login";
}
Videos()
logoutBtn.onclick = logoutBtn
submitButton.onclick = admin
