import React from 'react';
import { Link } from 'react-router-dom';

const ConnectionFailure = () => {
    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="flex flex-col items-center">


                    <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 md:text-3xl">Error</h1>

                    <p className="mb-12 max-w-screen-md text-center text-gray-500 md:text-lg">couldn't connect to the server</p>

                    <Link to="/" className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">Go home</Link>
                </div>
            </div>
        </div>
    );
}

export default ConnectionFailure;
