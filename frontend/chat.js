const chatForm=document.getElementById('chatForm');                          // chat input form 
const message=document.getElementById('message');                             // chats input here
const usernamechat=document.getElementById('usernamechat')                    // login member name will display who joined
const groupform=document.getElementById('groupform')                          //  group chats will display

const createGroup=document.querySelector('#createGroup');                    //create grop form id
const groupname=document.querySelector('#groupname')                          // create grop form input id  
const addppl=document.querySelector('#addppl');                                 //create grop form member input id
const groups=document.querySelector('#groups');                                  // all group name display here to enter inside 



function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}




function showNewUserOnScreen(chat){
  const chatMessageElement=document.createElement('div');
  chatMessageElement.textContent=`${chat.name}: ${chat.text}`
  groupform.appendChild(chatMessageElement);                         // groupform - chat messages all group
}


window.addEventListener('load',()=>{
  getusers();
  getGroups();
})


async function getGroups(){
  const token = localStorage.getItem('token');
  const response=await axios.get("http://localhost:3000/users/getgroupname",{headers:{'Authentication':token}});
  const grpdetails= response.data.groupDetails;
  const parent=document.querySelector('#groups') 
  for(let i=0;i<grpdetails.length;i++){
    let child=`<li onclick="insideGroup(${grpdetails[i].groupId})">${grpdetails[i].groupName} </li>`
    parent.innerHTML=parent.innerHTML + child;
  }
}

 async function insideGroup(id){
try{
  localStorage.setItem("groupId", id)
  window.location.href="./group.html"

}catch(err){
  console.log('error in group chats', err)
}
 }

 async function getusers(){
  const response= await axios.get("http://localhost:3000/user/signup");
 console.log(response)
  const username= response.data.users;
  username.forEach((user)=>{
    const userElement=document.createElement('div');
    userElement.textContent=user.name+" joined";
    usernamechat.appendChild(userElement); 
  })
 }


 async function getmessages(){
  let newKey= localStorage.key(0);
console.log(newKey,'newKey check getmessage')

for(let i=0;i<localStorage.length;i++){
  if(localStorage.key(i)<newKey){
    newKey=localStorage.key(i)
  }
}

const response=await axios.get(`http://localhost:3000/user/chat?currenttime=${newKey}`);
let chatHistory = response.data.message;

console.log(response.data.message,'checking chat for group with id')
groupform.innerHTML='';
chatHistory.forEach((chat)=>{
  const groupformElement=document.createElement('div');
  groupformElement.textContent=`${chat.userName}: ${chat.message}`;
  groupform.appendChild(groupformElement);
})
 }



 createGroup.addEventListener('submit', async(event)=>{
  event.preventDefault();
  let grpinformation={
    groupName:groupname.value,
    members:addppl.value.split(',').map(email=>email.trim())
  };
  if(groupname.value && addppl.value){
    try{
       const token=localStorage.getItem('token');
       const response= await axios.post('http://localhost:3000/group/creategrp', grpinformation, {headers:{'Authentication':token}});
       console.log(response.data.groupId);
       if(response.status===201){
        const parent =document.querySelector('#groups');
        let child=`<li onclick='insideGroup(${response.data.groupId});getGroups()'>${groupname.value}</li>`
        parent.innerHTML=parent.innerHTML+child
        
        groupname.value='';
        addppl.value='';
      }
      else if(response.status==202){
        groupname.value='';
        members.value='';
        alert('you are not the admin of this group, u can not add the user to the group ')
      }
      else {
        groupname.value='';
        members.value='';
        throw new Error(response.message);
      }


    }catch(error){
  alert(error.message)
    }
  }else{
    alert('Please enter all the details ')
  }
 })