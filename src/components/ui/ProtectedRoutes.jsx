import React,{useEffect} from 'react'
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
const ProtectedRoutes = ({children}) => {
   const{users}=useSelector(store=>store.author)
   const navigate=useNavigate()
    useEffect(()=>{
        if(!users){
            navigate('/peekaBoo/login')
        }
    },[users, navigate]);
  return (
    <>
    {children}
  </>
  )
}

export default ProtectedRoutes