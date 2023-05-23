// in signup.html--->i passed--> signup(event)....event object

async function signup(e){
  try{
e.preventDefault();

// console.log(e.target.email.value);


const signupdetails={
  name:e.target.name.value,
  phone:e.target.phone.value,
  email:e.target.email.value,
  password:e.target.password.value
}

const response = await axios.post("http://localhost:3000/user/signup", signupdetails)

if(response.status ===201){
window.location.href="./login.html"        // change the page once successful login
}else{
 throw new Error('Failed to login')
}

}
  catch(err){
      document.body.innerHTML += `<div style="color:red;">${err} <div>` + "<h4>User already exists</h4>";
  }
}












