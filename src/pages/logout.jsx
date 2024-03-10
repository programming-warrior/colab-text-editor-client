import { useEffect} from 'react'
import {useNavigate } from 'react-router-dom'

function Logout() {

    const history=useNavigate();
  useEffect(() => {
        localStorage.removeItem('token');
        history('/');
  }, [])



  return (
    <>
    </>
  )
}

export default Logout
