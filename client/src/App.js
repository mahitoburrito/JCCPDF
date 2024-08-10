import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  
  const [data, setData] = useState({});
  const [text, setText] = useState({});

  useEffect(() => {
    setText("");
  }, [])

  // Functionality for file upload results
  const handleUpload = async () => {
    if (data) {
      console.log('Uploading file...');
      
      // Upload file
      const formData = new FormData();
      formData.append('file', data);
      
      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch('http://localhost:3000/file', {
          method: 'POST',
          body: formData,
        });

        const data = await result.json();

        // Generate file and download for user
        const type = 'text/csv;charset=utf-8;';
        const blob = new Blob([data], {type});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "examplefile.csv";
        a.click()
      } catch (error) {
        console.error(error);
      }
    }
  };

  // handle changing the file being read for user
  function handleChange(event) {
    setData(event.target.files[0]);
    console.log("data has been set");
  }
  
  // Functionality for 
  const handleURLUpload = async () => {
    if (text) {
      console.log('Uploading URL...');

      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch('http://localhost:3000/url', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
            },
          body: JSON.stringify(text),
        });

        const data_return = await result.json();

        console.log(data_return);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const download_file = async () => {
    try {
      const result = await fetch("http://localhost:3000/download", {
        method: 'GET'
      })
      console.log("doing something")
      console.log(result)
    }
    catch (error) {
      console.log(error)
    }
  };

  // Functionality for grabbing GenAI data and downloading for user
  async function saveAsFile() {
    let text;
    const type = 'text/csv;charset=utf-8;';
    // grab the Gen AI data stored in the backend
    const file = fetch('http://localhost:3000/download')
    .then(res => res.json())
    .then((response) => {
      text = response.body;
      // Generate file and download for user
      const blob = new Blob([response.body], {type});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "response.csv";
      a.click()
    });
  }

  return (
    <div>
      <form onSubmit={handleUpload}>
          <h1>PDF Summarizer File Upload</h1>
          <input type="file" onChange={handleChange}/>
          <button type="submit" onSubmit={handleUpload}>Upload</button>
      </form>
      <form onSubmit={handleURLUpload}>
          <h1>PDF Summarizer URL Upload</h1>
          <input type="text" value = {text} onChange={e => setText(e.target.value)}/>
          <button type="submit" onSubmit={handleURLUpload}>Upload</button>
      </form>
      <h1>Download Results</h1>
      <button type="submit" onClick={saveAsFile}>Download</button>
    </div>    
  )
}

export default App