import React, { useEffect, useRef, useState } from 'react';
import ConnectionFailure from './ConnectionFailure';
import { useLocation } from 'react-router-dom';

const Editor = ({ col }) => {

    const [ws, setWs] = useState(null);
    const [mousePressed, setMousePressed] = useState(false);
    const [startMousePressed, setStartMousePressed] = useState(-1);
    const [endMousePressed, setEndMousePressed] = useState(-1);
    const [cursor, setCursor] = useState(0);
    const [text, setText] = useState([]);
    const [range, setRange] = useState(null);
    const [selection, setSelection] = useState(null);
    const [prevOperation, setPrevOpeartion] = useState(null);
    const editor = useRef(null);
    const location = useLocation();
    const [doc, setDoc] = useState(null);



    const insertText = (text) => {
        text.forEach(obj => {
            const span = document.createElement('span');
            span.textContent = obj.char;
            span.classList.add(`${obj.col}`)
            editor.current.appendChild(span);
        })
    }

    useEffect(() => {
        setDoc(location.state.doc);
        if (location.state && location.state.doc && location.state.doc.text && editor && editor.current) {
            const newText = location.state.doc.text;
            insertText(newText);
            setText([...newText]);
        }
    }, [])


    useEffect(() => {
        if (doc) {
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS}`, ['Authorization', `${doc.id}`]);
            socket.addEventListener('open', () => {
                setWs(socket);
                console.log('connected');

            })
            socket.addEventListener('close', () => {
                setWs(null);
            })
        }


    }, [doc])

    useEffect(() => {
        if (ws) {
            ws.addEventListener('message', (data) => {
                const { event, start, end, payload } = JSON.parse(data.data);
                console.log(start + " " + end)
                if (event === 'insert') {
                    let newText = [...text];

                    //resolve any conflicts


                    if (start === end) {
                        newText.splice(start, 0, payload);
                    }
                    else {
                        newText.splice(start, end - start);
                        newText.splice(start, 0, payload)
                    }
                    editor.current.textContent = ""
                    insertText(newText);
                    setText([...newText])

                }

                else if (event === 'delete-backward') {
                    let newText = [...text];
                    if (start === end) {
                        newText.splice(start - 1, 1);
                    }
                    else {
                        newText.splice(start, end - start);
                    }
                    editor.current.textContent = "";
                    insertText(newText);
                    setText([...newText]);

                }

                else if (event === 'delete-forward') {
                    let newText = [...text];
                    if (start === end) {
                        newText.splice(start, 1);
                    }
                    else {
                        newText.splice(start, end - start)
                    }
                    editor.current.textContent = "";
                    insertText(newText);
                    setText([...newText]);

                }
            })
        }
    }, [text, ws, cursor])

    const sendSocketMsg = ({ event, start, end, payload }) => {
        if (ws) {
            ws.send(JSON.stringify({ event, start, end, payload }))
        }
    }

    const handleInsertion = (data) => {
        if (editor) {
            let newText = [...text];
            editor.current.textContent = ''

            if (mousePressed && startMousePressed > -1 && endMousePressed > -1 && startMousePressed === endMousePressed) {
                newText.splice(startMousePressed, 0, { char: data, col });

                setPrevOpeartion({ event: "insert", start: startMousePressed, end: startMousePressed, payload: { char: data, col } })
                sendSocketMsg({ event: "insert", start: startMousePressed, end: startMousePressed, payload: { char: data, col } });

                setCursor(endMousePressed + 1);
                setStartMousePressed(-1);
                setEndMousePressed(-1);
            }
            else if (mousePressed && startMousePressed > -1 && endMousePressed > -1 && startMousePressed !== endMousePressed) {
                newText.splice(startMousePressed, endMousePressed - startMousePressed);

                newText.splice(startMousePressed, 0, { char: data, col })

                setPrevOpeartion({ event: "insert", start: startMousePressed, end: startMousePressed, payload: { char: data, col } })
                sendSocketMsg({ event: "insert", start: startMousePressed, end: endMousePressed, payload: { char: data, col } });


                setCursor(startMousePressed + 1);
                setStartMousePressed(-1);
                setEndMousePressed(-1);
            }
            else {
                if (text.length === 0) {
                    newText.push({ char: data, col })

                }
                else {
                    newText.splice(cursor, 0, { char: data, col })
                }

                setPrevOpeartion({ event: "insert", start: cursor, end: cursor, payload: { char: data, col } })
                sendSocketMsg({ event: "insert", start: cursor, end: cursor, payload: { char: data, col } });
                setCursor(cursor + 1);
            }
            insertText(newText);
            setText([...newText]);

        }
    }

    const handleBackwardDeletion = () => {
        if (editor && editor.current) {
            let newText = [...text]
            if (mousePressed && startMousePressed > 0 && startMousePressed === endMousePressed) {
                newText.splice(startMousePressed - 1, 1);

                setPrevOpeartion({ event: "delete-backward", start: startMousePressed, end: startMousePressed })
                sendSocketMsg({ event: "delete-backward", start: startMousePressed, end: endMousePressed });

                setCursor(startMousePressed - 1);
                setStartMousePressed(-1);
                setEndMousePressed(-1);
            }
            else if (mousePressed && startMousePressed >= 0 && endMousePressed > 0 && startMousePressed !== endMousePressed) {
                newText.splice(startMousePressed, endMousePressed - startMousePressed)

                setPrevOpeartion({ event: "delete-backward", start: startMousePressed, end: startMousePressed })
                sendSocketMsg({ event: "delete-backward", start: startMousePressed, end: endMousePressed });


                setCursor(startMousePressed);
                setStartMousePressed(-1);
                setEndMousePressed(-1);
            }
            else {
                if (newText.length > 0) {
                    newText.splice(cursor - 1, 1);

                    setPrevOpeartion({ event: "delete-backward", start: cursor, end: cursor })

                    sendSocketMsg({ event: "delete-backward", start: cursor, end: cursor })

                    setCursor(cursor - 1);
                }
            }
            editor.current.textContent = ""
            insertText(newText);
            setText([...newText])
        }
    }

    const handleForwardDeletion = () => {
        if (editor && editor.current) {
            let newText = [...text]
            if (mousePressed && startMousePressed >= 0 && startMousePressed === endMousePressed) {
                newText.splice(startMousePressed, 1);

                setPrevOpeartion({ event: "delete-forward", start: startMousePressed, end: startMousePressed })
                sendSocketMsg({ event: "delete-forward", start: startMousePressed, end: endMousePressed });

                setCursor(startMousePressed);

                setStartMousePressed(-1);
                setEndMousePressed(-1);
            }
            else if (mousePressed && startMousePressed >= 0 && endMousePressed > 0 && startMousePressed !== endMousePressed) {
                newText.splice(startMousePressed, endMousePressed - startMousePressed)

                setPrevOpeartion({ event: "delete-forward", start: startMousePressed, end: startMousePressed })
                sendSocketMsg({ event: "delete-forward", start: startMousePressed, end: endMousePressed });


                setCursor(startMousePressed);
                setStartMousePressed(-1);
                setEndMousePressed(-1);
            }
            else {
                if (newText.length > 0) {
                    newText.splice(cursor, 1);

                    setPrevOpeartion({ event: "delete-forward", start: cursor, end: cursor })
                    sendSocketMsg({ event: "delete-forward", start: cursor, end: cursor });

                    setCursor(cursor);
                }
            }
            editor.current.textContent = ""
            insertText(newText);
            setText([...newText])
        }
    }




    useEffect(() => {
        if (range && selection) {
            try {
                range.setStart(range.startContainer, cursor);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            catch (e) {
                console.log(e);
            }
        }
    }, [text])



    const handleInput = (e) => {
        const inputType = e.nativeEvent.inputType;

        const selection = window.getSelection();
        setSelection(window.getSelection());
        setRange(selection.getRangeAt(0));


        switch (inputType) {
            case 'insertText': {
                handleInsertion(e.nativeEvent.data);
                break;
            }

            case 'deleteContentBackward': {
                handleBackwardDeletion();
                break;
            }

            case 'deleteContentForward': {
                handleForwardDeletion();
                break;
            }
        }

        setMousePressed(false);
    }



    function getSelectedIndex(parentElement, container, offset) {
        let index = 0;
        let node = parentElement.firstChild;

        while (node) {
            if (node === container || (node && node.firstChild === container)) {
                return index + offset;
            }

            if (node.nodeType === Node.TEXT_NODE) {
                index += node.textContent.length;
            } else {
                index += node.innerText.length;
            }
            node = node.nextSibling;
        }
        return -1;
    }

    const handleMouseUp = (e) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        let start = getSelectedIndex(editor.current, range.startContainer, range.startOffset);
        let end = getSelectedIndex(editor.current, range.endContainer, range.endOffset);

        setStartMousePressed(start);
        setEndMousePressed(end);
        setMousePressed(true);
    }



    const handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft') {
            if (cursor > 0) {
                setCursor(cursor - 1)
            }
        }
        else if (e.key === 'ArrowRight') {
            if (cursor < text.length) {
                setCursor(cursor + 1)
            }
        }

    }

    return (

        <div className='flex justify-center items-center h-full bg-gray-100'>
            <div className={`${!ws ? "hidden" : ""} editor bg-white border border-solid p-4 border-black rounded  w-1/2 h-3/4`} ref={editor} contentEditable="true" onInput={(e) => { handleInput(e) }} onMouseUp={(e) => { handleMouseUp(e) }} onKeyUp={(e) => { handleKeyUp(e) }}>

            </div>

            {
                ws ? "" : <ConnectionFailure />
            }

        </div>
    )
}

export default Editor;