import React, { useEffect, useState } from 'react'
import axios from "axios"
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";

export default function Todo() {
  const [valueInput, setValueInput] = useState({})
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(false)
  const [flag, setFlag] = useState(false)

  const handleChange = (e) => {
    setValueInput({ ...valueInput, [e.target.name]: e.target.value })
  }

  const handleGetData = async () => {
    const res = await axios.get("http://localhost:8386/api/v1/todo?per_page=4")
    // console.log(res.data.todo);
    setData(res.data)
  }

  useEffect(() => {
    handleGetData()
  }, [flag])

  const handleAdd = async () => {
    if (valueInput.name === "") {
      alert("Vui long nhap ten")
    } else {
      try {
        const res = await axios.post("http://localhost:8386/api/v1/addTodo", {
          ...valueInput,
          id: Math.floor(Math.random() * 999999),
          completed: false
        })
        // alert(res.data.message)
        console.log(res.data.add);
        //  setData(res.data.add)
        setFlag(!flag)
        setValueInput({ ...valueInput, name: "" })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm("Ban muon xoa?")
    if (confirm) {
      const res = await axios.delete(`http://localhost:8386/api/v1/todo/${id}`)
      console.log(res.data.todo);
      // setData(res.data.todo)
      setFlag(!flag)
    }
  }

  const handleDeleteAll = async () => {
    try {
      const res = await axios.delete(`http://localhost:8386/api/v1/todo`);
      setFlag(!flag);
      // setData(res.data.todo)
    } catch (error) {
      console.log(error);
    }
  }
  const handleEdit = (item) => {
    setValueInput(item)
    setEdit(true)
  }

  const handleSave = async () => {
    const res = await axios.put(`http://localhost:8386/api/v1/todo/${valueInput.id}`, valueInput)
    // setData(res.data.todo)
    setFlag(!flag)
    setValueInput({ ...valueInput, name: "" })
    setEdit(false)
  }


  const handleChangeCompleted = async (item) => {

    const res = await axios.patch(`http://localhost:8386/api/v1/todo/${item.id}`, item)
    // setData(res.data.todo)
    setFlag(!flag)

  }

  const number = data.filter((item) => item.completed == false)
  // console.log(number);

  return (
    <div className=' h-[100vh] bg-green-200'> <br /> <br />
      <div className=' w-[35%] h-[80%] text-center m-auto bg-purple-400 rounded-2xl'> <br />
        <h1 className='text-2xl font-semibold'>Todo App</h1>
        <input type="text" placeholder='Add Todoooooooo' name='name' value={valueInput.name} onChange={handleChange}
          className='border-2  border-indigo-500  px-4 text-2xl rounded-xl outline-none mt-2 w-[65%]' />
        {edit ? <button className='cursor-pointer border-2 border-indigo-500 px-3 text-2xl ml-5 rounded-xl p-1' onClick={handleSave}><CiEdit /> </button> :
          <button className='border-2 border-indigo-500 px-3 text-2xl ml-5 rounded-xl p-1 cursor-pointer' onClick={handleAdd}> <FaPlus /></button>}

        {data.map((item, index) => {
          return <div key={index} className='flex justify-around mt-2 m-auto'>
            <p className='w-[30%] text-2xl'
              style={{ textDecoration: item.completed ? "line-through" : "none" }}
              onClick={() => handleChangeCompleted(item)}>
              {item.name}</p>
            <div className='flex'>
              <button className='text-2xl cursor-pointer' onClick={() => handleEdit(item)}><CiEdit /> </button>
              <button className='text-2xl ml-3 cursor-pointer' onClick={() => handleDelete(item.id)}><RiDeleteBin6Fill /></button>
            </div>

          </div>
        })}
        <div className='mt-[200px] flex justify-around'>
          <p className='text-2xl'>You have {number.length} pending task</p>
          <button className='text-2xl border-2 border-indigo-500 rounded-xl px-3' onClick={handleDeleteAll}>Clear All</button>
        </div>
      </div>
    </div>
  )
}
