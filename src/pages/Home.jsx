import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Home() {
  const [token, setToken] = useState('');
  const history = useNavigate();

  const [docs, setDocs] = useState([

  ]);

  const [sharedDocs, setSharedDocs] = useState([]);

  const [selectedDoc, setSelectedDoc] = useState(null);


  useEffect(() => {
    (async function () {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch('http://localhost:7000/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.status === 200 || res.status === 201) {
          setToken(token);
        }
      }
    })()
  }, [])

  useEffect(() => {
    (async function () {
      if (token) {
        const res = await fetch('http://localhost:7000/docs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const res2 = await fetch('http://localhost:7000/sharedDocs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log(res2.status);
        console.log(res.status);
        if (res.status === 200) {
          const data = await res.json();
          console.log(data);
          setDocs([...docs, ...data])
        }
        if (res2.status === 200) {
          const data = await res2.json();
          console.log(data);
          setSharedDocs([...data]);
        }
      }
    })()


  }, [token])



  const handleClick = (e) => {
    const id = e.target.dataset.id;
    console.log(id);
    const selectedDoc = docs.filter(doc => {
      return doc.id === id
    })
    setSelectedDoc({ ...selectedDoc[0] });
  }

  const handleClickForSharedDocuments = (e) => {
    const id = e.target.dataset.id;
    console.log(id);
    console.log(sharedDocs)
    const selectedDoc = sharedDocs.filter(doc => {
      return doc.doc.id === id
    })
    // setSelectedDoc({ ...selectedDoc[0] });
    history('/editor', { state: { doc: selectedDoc[0].doc } });
  }


  useEffect(() => {
    if (selectedDoc) {
      history('/editor', { state: { doc: selectedDoc } });
    }
  }, [selectedDoc])

  const handleCreateDocument = async () => {
    const res = await fetch('http://localhost:7000/docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        createdat: new Date().toISOString().slice(0, 10),
        text: [],
      })
    })

    if (res.status === 201) {
      const data = await res.json();
      console.log(data);
      history('/editor', { state: { doc: data } });
    }
  }

  return (
    <>

      <nav>
        {token ?
          <div className='flex justify-between p-8'>
            <button className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white" onClick={handleCreateDocument}>create new document</button>
            <button className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white"><Link to="/logout">Logout</Link></button>
          </div>
          :
          (<div className='flex justify-around p-8'>
            <button className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white"> <Link to="/login">Login</Link></button>
            <button className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white"> <Link to="/register">Signup</Link></button>

          </div>)}
      </nav>

      <div>
        {
          docs.map(e => {
            return (
              <div onClick={(e) => { handleClick(e) }} className="w-3/4 my-2 rounded cursor-pointer p-4 flex gap-8 items-center border-2 border-gray-500 border-solid" data-id={e.id}>
                <span className=' pointer-events-none font-bold text-lg'>{e.title}</span>
                <span className='pointer-events-none'>{e.createdat}</span>
              </div>)
          })
        }
      </div>

      <div>
        <h1 className='m-4 text-xl font-bold'>Shared Documents</h1>
        {
          sharedDocs.map(e => {
            return (
              <div onClick={(e) => { handleClickForSharedDocuments(e) }} className="w-3/4 my-2 rounded cursor-pointer p-4 flex gap-8 items-center border-2 border-gray-500 border-solid" data-id={e.doc.id}>
                <span className=' pointer-events-none font-bold text-lg'>{e.doc.title}</span>
                <span className='pointer-events-none'>{e.doc.owner}</span>
                <span className='pointer-events-none'>{e.doc.createdat}</span>
              </div>)
          })
        }

      </div>



    </>
  )
}

export default Home
