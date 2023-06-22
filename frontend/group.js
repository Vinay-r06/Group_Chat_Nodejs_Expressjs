
const chatForm=document.getElementById('chatForm')                      // chat input form 
const messageinput=document.getElementById('message');                  // chats input here
const userList=document.getElementById('user-list');                    // group member name will display who joined
const groups=document.getElementById('groupform');                     // group chats will display


const removememberform=document.querySelector('#removememberform')           // form id
const removemembers=document.querySelector('#removemembers')                 // form input id


const adminform=document.querySelector('#adminform')                            // admin form id
const admin=document.querySelector('#admin')                                    // admin input id 

const socket = io('http://localhost:8000')

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

chatForm.addEventListener('submit', async (event)=>{
    event.preventDefault();
    const token=localStorage.getItem('token');
    const groupId=JSON.parse(localStorage.getItem('groupId'));

    const tokenval=parseJwt(token);
    
    const grpId=localStorage.getItem('groupId');
    let message={text:messageinput.value};
    let obj={
       name:tokenval.name,
        text:messageinput.value,
        id:grpId
    }
 const date=new Date().getTime();
 localStorage.setItem(date, JSON.stringify(obj));


 let oldkey=localStorage.key(0);
 if(localStorage.length>11){
    for(let i=1;i<localStorage.length;i++){
        if(localStorage.key(i)<oldkey){
            oldkey=localStorage.key(i);
        }

    }
    localStorage.removeItem(oldkey);
 }
const response= await axios.post(`http://localhost:3000/user/chat?groupId=${grpId}`, message, {headers:{'Authentication':token}} );
console.log(response.data.chatData);
socket.emit('send-message',groupId )
messageinput.value='';

})


window.addEventListener('load', ()=>{
    getusers();
    getmessages();
});


async function getusers(){
    const grpid=localStorage.getItem('groupId');
    const response= await axios.get(`http://localhost:3000/grpusers/getname?groupId=${grpid}`);
    console.log(response.data.grpusers);
    const userlist=response.data.grpusers;
    const grpName=response.data.grpusers[0].groupName;
    const groupNameElement=document.getElementById('admin');
    groupNameElement.textContent=grpName;

    userList.innerHTML='';
    userlist.forEach((user)=>{
     const userElement=document.createElement('div');
     userElement.textContent=user.name+' joined'; 
     userList.appendChild(userElement);  
    }) 

}

async function getmessages(){
    const grpId=localStorage.getItem('groupId');

    const response=await axios.get(`http://localhost:3000/user/chat?groupId=${grpId}`);
    console.log(response)
    const chatHistory = response.data.message;
    groups.innerHTML='';
    chatHistory.forEach((chat)=>{
    const chatMessageElement=document.createElement('div');
    chatMessageElement.textContent=`${chat.userName}:${chat.message}`;
    groups.appendChild(chatMessageElement);    
    });
}


//startUpdatingMessage();

socket.on('receive-message', async(group)=>{
    const groupId=JSON.parse(localStorage.getItem('groupId'));
    console.log('check socket',group, groupId);
    console.log(group===groupId);
    if(group===groupId){
        getmessages();
        getusers();
    }
})

removememberform.addEventListener('submit',async(event)=>{
    event.preventDefault();
    const grpid=localStorage.getItem('groupId');
    let memberRemoveElement={
        grpId:grpid,
        members:removemembers.value.split(',').map(name=>name.trim())
    };

    if(removemembers.value){
        try{
            const token=localStorage.getItem('token');
            const response= await axios.post('http://localhost:3000/group/removemember', memberRemoveElement, {headers:{'Authentication':token}} );
            if(response.status==201){
                getusers();
                removemembers.value='';
                alert(`${response.data.message}`)
            }
            else if(response.status==202){
                removemembers.value='';
                alert(`${response.data.message}`)
            }
            else if(response.status==200){
                getusers();
                removemembers.value='';
                alert(`${response.data.message}`)
            }
            else{
                removemembers.value='';
                throw new Error(response.message);
            }
        }catch(error){
      alert(error.message);
        }
    }
    else{
        alert('please fill out all fields.')
    }

})


adminform.addEventListener('submit', async(event)=>{
    event.preventDefault();
    const grpid=localStorage.getItem('groupId');
    let makeMemberAdmin={
        grpId:grpid,
        members:admin.value.split(',').map(name=>name.trim())
    };
    
    if(admin.value){
        try{
        const token=localStorage.getItem('token');

        const response= await axios.post('http://localhost:3000/group/makeadmin',makeMemberAdmin,{headers:{'Authentication':token}} );
       if(response.status==201){
       getusers();
       admin.value='';
       alert(`${response.data.message}`)
    }
   else if(response.status==202){
    admin.value='';
    alert(`${response.data.message}`)
}
else if(response.status==204){
    admin.value='';
    alert(`${response.data.message}`)
}
else if(response.status==200){
    getusers();
    admin.value='';
    alert(`${response.data.message}`)
} else{
    admin.value='';
        throw new Error(response.message);
       }

        }catch(error){
          alert(error.message);
        }
    }else{
        alert('Please fill out all fields ')
    }
})