import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:7000/register', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        if (res.status === 200 || res.status === 201) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            history('/');
        } ``
    };

    return (
        <div className="bg-white h-full py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Login</h2>

                <form onSubmit={(e) => { handleSubmit(e) }} className="mx-auto max-w-lg rounded-lg border">
                    <div className="flex flex-col gap-4 p-4 md:p-8">
                        <div>
                            <label htmlFor="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email</label>
                            <input name="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Password</label>
                            <input name="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                        </div>

                        <button type="submit" className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Log in</button>

                    </div>

                    <div className="flex items-center justify-center bg-gray-100 p-4">
                        <p className="text-center text-sm text-gray-500">Don't have an account? <Link to="/register" className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
