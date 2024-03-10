import react from 'react';
import { useState, useEffect } from 'react';

const ShareDocument = ({ doc }) => {
    const [openForm, setOpenForm] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(()=>{
        console.log(doc);
    },[doc])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`${REACT_APP_BACKEND_URL}/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Beaerer ${token}`
            },
            body: JSON.stringify({
                shareto: email,
                document_id: doc.id,
            })
        })
        if (res.status === 200 || res.status === 201) {
            setOpenForm(false);
        }
    }


    return (
        <>
            <div>
                <button type="submit" className={`${!openForm ? 'block' : 'hidden'} rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base`} onClick={() => { setOpenForm(true) }}>share</button>
                <form onSubmit={(e) => { handleSubmit(e) }} className={`${openForm ? 'block' : 'hidden'} mx-auto w-1/2 rounded-lg border`}>
                    <div className={`${openForm ? 'flex' : 'hidden'}  flex-col gap-4 p-4 md:p-8`}>
                        <input placeholder='search by email' name="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                        <button type="submit" className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">give access</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ShareDocument;