import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signup from './components/ui/Signup'
import Login from './components/ui/Login'
import Home from './components/ui/Home'
import Notification from './components/ui/Notification'
import Explore from './components/ui/Explore'
import Message from './components/ui/Message'
import Profile from './components/ui/Profile'
import ProtectedRoutes from './components/ui/ProtectedRoutes'
import EditProfile from './components/ui/EditProfile'
import MainLayout from './components/ui/MainLayout'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import {Provider} from "react-redux"
import store from "./redux/storeRedux.js"
import {
  persistStore
} from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
        <Route index element={<Home />} />
        <Route path='home' element={<Home />} />
        <Route path='profile/:id' element={<Profile />} />
        <Route path='profile/edit' element={<EditProfile />} />
        <Route path='explore' element={<Explore />} />
        <Route path='notification' element={<Notification />} />
        <Route path='message' element={<Message />} />
      </Route>
      <Route path='/register' element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </>
  )
)


let persistor = persistStore(store)
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="196715696342-cr8ef97jmaphnn6atr3rmnf96r4ngnpt.apps.googleusercontent.com">
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router} />
    </PersistGate>
    </Provider>
  </StrictMode>
  </GoogleOAuthProvider>
)
