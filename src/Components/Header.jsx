import { Link } from "react-router-dom";
function Header(){
  return (
    <>
    <div className="HeadBody">
      <Link to='/' style={{ textDecoration: 'none', color: 'black' }}><h1>Crop Yeild Prediction</h1></Link>
      <div id='Navigation'>
      <Link className='link'>Solutions</Link>
      <Link className='link' to="/About">About</Link>
      <Link className='link'>Blog</Link>
      <Link className='link'>Help</Link>
      {/* <Link className='link' to='/Pest'>Fertilizer</Link> */}
      </div>
        <Link to="/Sign"><button className='start_buttons'>Login</button></Link>
    </div>
    </>
  )  
}

export default Header;