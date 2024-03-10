import { useState, useRef, useEffect } from 'react'

function ColorPallete({ getColFromColorPallete }) {
    const [active, setActive] = useState('blue')

    const handleClick = (e) => {
        const selectedCol = e.target.dataset.col;
        setActive(selectedCol);

    }

    useEffect(() => {
        getColFromColorPallete(active);
    }, [active])

    return (
        <>
            <div className='bg-inherit flex gap-2 p-4 '   >
                <div className={`w-6 h-6 bg-green-500 ${active === 'green' ? " border-4 border-solid border-stone-300 " : ""}`} data-col="green" onClick={(e) => { handleClick(e) }}></div>
                <div className={`w-6 h-6 bg-blue-500 ${active === 'blue' ? " border-4 border-solid border-stone-300 " : ""}`} data-col="blue" onClick={(e) => { handleClick(e) }}></div>
                <div className={`w-6 h-6 bg-red-500 ${active === 'red' ? " border-4 border-solid border-stone-300 " : ""}`} data-col="red" onClick={(e) => { handleClick(e) }}></div>
                <div className={`w-6 h-6 bg-yellow-500 ${active === 'yellow' ? " border-4 border-solid border-stone-300 " : ""}`} data-col="yellow" onClick={(e) => { handleClick(e) }}></div>
                <div className={`w-6 h-6 bg-black ${active === 'black' ? " border-4 border-solid border-stone-300 " : ""}`} data-col="black" onClick={(e) => { handleClick(e) }}></div>
            </div>
        </>
    )
}

export default ColorPallete;
