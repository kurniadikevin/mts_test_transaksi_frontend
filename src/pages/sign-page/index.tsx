import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function SignPage (){

const [type,setType]= useState<string>('Sign-in');
const [username,setUsername]= useState<string>('');
const [password,setPassword]= useState<string>('');
const [currentUsername,setCurrentUsername]= useState<string>('');
const { push } = useRouter();

const highlightSelectType=()=>{
    let other;
    type === 'Sign-up' ? other = 'Sign-in' : other = 'Sign-up'
    const element : any = document.querySelector(`#${type}-select`);
    element.style.color='var(--button)';
    element.style.fontWeight='700';
    const otherElement : any = document.querySelector(`#${other}-select`);
    otherElement.style.color='var(--text)';
    otherElement.style.fontWeight='400';
}

const checkForAdminOnSignUp=()=>{
  if(type === 'Sign-up'){
    const currentUserData :any = localStorage.getItem('session-data');
    if(currentUserData.username !== 'admin0'){
        alert('only user admin0 can sign up new user')
        return false
    }
 }
}

const getCurrentSignedSession=()=>{
    const currentUserData :any = localStorage.getItem('session-data');
    if(currentUserData){
    const data= JSON.parse(currentUserData)
    setCurrentUsername(data.username);
    console.log('get')
    console.log(data.username)
    }
}

const signing= async(input:string)=>{
    if(checkForAdminOnSignUp() === false){return}
    let urlExt;
    input === 'Sign-up' ? urlExt = 'sign-up' : urlExt= 'sign-in';
    axios({
      method: "POST",
      data: {
        username: username,
        password: password,
      },
      withCredentials: true,
      headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
      url: `http://localhost:5000/user/${urlExt}`,
    }).then((res) => {
      if(res.data === 'No User Exists'){
        console.log(res.data)
      } else{
        console.log(res.data)
        localStorage.setItem("token", (res.data.token));
        localStorage.setItem("session-data", JSON.stringify(res.data.data));
        push('/')
      }    
    });
    // need to only can sign up if the user is admin or user
    
    
   
}

useEffect(()=>{
    highlightSelectType()
    getCurrentSignedSession()
},[type])

 return(
    <div className="flex items-start justify-center h-screen ">

        <div className=" w-3/12 flex-col p-4 min-w-fit">
            <div className="h-32 text-3xl flex justify-center items-center pb-4 
            font-bold break-words">
                Department Produksi
            </div>
            <div className="font-bold text-[color:var(--button)]">
                {currentUsername ? `Welcome back,${currentUsername}` : 'Sign in to continue'}
            </div>
            <div></div>
            <div className="bg-[color:var(--component)] border-2 border-black  p-8 gap-2">
            <div className="h-20 flex item-end justify-start gap-4 p-4">
                <div id="Sign-in-select" className="text-xl  pt-4 cursor-pointer" onClick={()=> setType('Sign-in')}>
                    Sign-in
                </div>
                <div id="Sign-up-select" className="text-xl  pt-4 cursor-pointer" onClick={()=> setType('Sign-up')}>
                    Sign-up
                </div>
            </div>
            <div className=" h-20 p-4">
                <div className="pb-2 ">Username</div>
                <input className="px-1 text-[color:var(--text-input)]"
                 value={username} onChange={(e)=> setUsername((e.target.value))}>
                </input>
            </div>
            <div className=" h-20 p-4">
                <div className="pb-2">Password</div>
                <input type="password" className="px-1 text-[color:var(--text-input)]"
                 value={password} onChange={(e)=> setPassword((e.target.value))}>    
                </input>
            </div>
            <div className="h-20  flex item-center justify-center pt-6">
                <button className="bg-[color:var(--button)] w-20 h-10 rounded-lg font-bold"
                onClick={()=>signing(type)}>
                    {type}
                </button>
            </div>
         </div>
        </div>

    </div>
 )
}