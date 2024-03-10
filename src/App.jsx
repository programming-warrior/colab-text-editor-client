import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/logout';

function App() {

  return (
    <>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  )
}

export default App
