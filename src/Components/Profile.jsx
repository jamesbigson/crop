import { Component, useState } from 'react';
import SignIn from "./SignIn";

function Profile(){
  const [Component,setComponent]=useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column'}}>
    <div id='Profile' onClick={()=>setComponent(!Component)}>
      <img src='./logo.svg' alt='profile'/>
    </div>
    {Component && <SignIn/>}
    </div>
  )
}

export default Profile;