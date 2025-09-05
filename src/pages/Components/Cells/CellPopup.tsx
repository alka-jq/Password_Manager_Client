import React, { useState, useEffect } from 'react'
import apiClient from '@/service/apiClient'

interface Type {
    id?: string,
    title: string,
    color: string,
    icon: string
}

const CellPopup = () => {
    const [title, setTitle] = useState('')
    const [color, setColor] = useState('')
    const [icon, setIcon] = useState('')

    const [celldata, setCelldata] = useState < Type | null > ()
    console.log(celldata)

    const fetchCell = async () => {
        const res = await apiClient.get("/api/password/getCell")
        setCelldata(res.data)

    } 
  
    const resetform = () => {
        setTitle('')
        setColor('')
        setIcon('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await apiClient.post('/api/identity/cell/create', { title, color, icon })
            alert('submitted')
            resetform()
            fetchCell();
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className='flex gap-4'>
                <input
                    type='text'
                    name='title'
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                    placeholder='title' />


                <input
                    type='color'
                    name='color'
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value)
                    }}
                    placeholder='select color' />

                <select name='icon' value={icon} onChange={(e) => {
                    setIcon(e.target.value)
                }}>
                    <option value="hello">hello</option>
                    <option value="yellow">yellow</option>
                    <option value="on">on</option>
                    <option value="4">off</option>
                </select>

                <button type='submit'>Submit</button>
            </form>


            <div>
                {/* {celldata.map((cell) => (
                    <div className="div" key>
                        <div className="h1">{cell.title}</div>
                    </div>

                ))} */}
            </div>




        </div>
    )
}

export default CellPopup
