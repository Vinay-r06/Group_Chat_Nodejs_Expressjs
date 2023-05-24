const token=localStorage.getItem('token');

const chatForm= document.getElementById('chatForm');

chatForm.addEventListener('submit', addMessage);


window.addEventListener('DOMContentLoaded', async()=>{
    try{

    }catch(err){
        let getchat= await axios.get('http://localhost:3000/chats', {headers: {'Authorization': token}})
        if(getchat){
            chatForm.innerHTML+='You joined <br>';

        }
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

      if(sendMessage){
        chatForm.innerHTML= chatForm.innerHTML+message.value;
        message.value='';
      }

    }catch(err){
        console.log('Err Send_Message', err)
    }
}

