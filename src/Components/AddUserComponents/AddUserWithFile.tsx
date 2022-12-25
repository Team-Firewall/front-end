import React, { FormEvent, useState } from "react"
import axios from "axios";

const AddUserWithFile = () => {
  const [selectedFile, setSelectedFile] = useState<any>()

  const fileHandler = (e: any) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    console.log(formData)

    axios.post('http://localhost:8082/trance', formData, {
      headers: {'Content-Type':'multipart/form-data'}
    }).then((res) => {
      console.log(res.data)
    })
  }

  const handleFileSelect = (e: any) => {
    setSelectedFile(e.target.files[0])
  }

  return (
    <div>
      <form onSubmit={fileHandler}>
        <input type={'file'} required={true} onChange={handleFileSelect}/>
        <button type={'submit'}>하이</button>
      </form>
    </div>
  )
}

export default AddUserWithFile