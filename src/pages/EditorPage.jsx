import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import Editor from '../components/Editor';
import ColorPallete from '../components/ColorPallete';
import ShareDocument from '../components/ShareDocument';

function EditorPage() {
    const [col, setCol] = useState('black');
    const getColFromColorPallete = (selectedCol) => {
        setCol(selectedCol);
    }
    const [doc, setDoc] = useState(null);

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.doc) {
            setDoc({ ...location.state.doc })
        }
    }, [])


    return (
        <>
            <ShareDocument doc={doc} />
            <ColorPallete getColFromColorPallete={getColFromColorPallete} />
            <Editor col={col} />
        </>
    )
}

export default EditorPage
