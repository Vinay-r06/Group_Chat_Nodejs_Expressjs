const token=localStorage.getItem('token');

const chatForm= document.getElementById('chatForm');

chatForm.addEventListener('submit', sendMessage);
const chatDiv= document.getElementById('chatDiv');

window.addEventListener('DOMContentLoaded',()=>{
    try{
      setInterval(async()=>{
        let getchat= await axios.get('http://localhost:3000/chats', {headers: {'Authorization': token}})
            console.log(getchat);

            if(getchat.data.success){
                    
              for(let i=0; i<getchat.data.chatData.length;i++){
                chatForm.innerHTML=chatForm.innerHTML+`${getchat.data.chatData[i].username}:${getchat.data.chatData[i].message}<br> `;
              }
               
              chatDiv.innerHTML='You joined <br>';
              chatForm.appendChild(chatDiv);
        }
      },1000)

    }catch(err){
      console.log('Err Send_Message', err)
    }
})


async function sendMessage(e){
    try{
      e.preventDefault();
     
      let message = document.getElementById('message')
      let obj= {
        message: message.value
      }

      let sendMessage = await axios.post('http://localhost:3000/chats/sendMessage', obj, {headers:{'Authorization':token}} );
        
      console.log(sendMessage);
      if(sendMessage.data.success){
        chatForm.innerHTML= chatForm.innerHTML+`You: ${message.value} <br>`;
        console.log(chatDiv);
        message.value='';
      }

    }catch(err){
        console.log('Err Send_Message', err)
    }
}

