import React, { FormEvent } from "react"
import axios from "axios";

const AddUserWithFile = () => {

  const fileHandler = (e: any) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', e.target.file)

    axios.post('http://localhost:8082/trance', formData, {
      headers: {'Content-Type':'multipart/form-data'}
    }).then((res) => {
      console.log(res.data)
    })
  }

  return (
    <div>
      <form onSubmit={fileHandler}>
        <input type={'file'} required={true}/>
        <button type={'submit'}>하이</button>
      </form>
    </div>
  )
}

export default AddUserWithFile