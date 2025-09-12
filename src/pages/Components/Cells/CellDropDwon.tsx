import React, { useState, useEffect, FunctionComponent } from 'react'
import {
Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText, User
} from 'lucide-react';
import apiClient from '@/service/apiClient';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const iconComponents: Record<string, JSX.Element> = {
Home: <Home size={16} />,
Briefcase: <Briefcase size={16} />,
Gift: <Gift size={16} />,
Store: <Store size={16} />,
Heart: <Heart size={16} />,
AlarmClock: <AlarmClock size={16} />,
AppWindow: <AppWindow size={16} />,
Settings: <Settings size={16} />,
Users: <Users size={16} />,
Ghost: <Ghost size={16} />,
ShoppingCart: <ShoppingCart size={16} />,
Leaf: <Leaf size={16} />,
Shield: <Shield size={16} />,
Circle: <Circle size={16} />,
CreditCard: <CreditCard size={16} />,
Fish: <Fish size={16} />,
Smile: <Smile size={16} />,
Lock: <Lock size={16} />,
UserCheck: <UserCheck size={16} />,
Star: <Star size={16} />,
Flame: <Flame size={16} />,
Wallet: <Wallet size={16} />,
Bookmark: <Bookmark size={16} />,
IceCream: <IceCream size={16} />,
Laptop: <Laptop size={16} />,
BookOpen: <BookOpen size={16} />,
Infinity: <Infinity size={16} />,
FileText: <FileText size={16} />,
Personal: <User size={16} />
};

interface CellData {
id?: string,
title?: string,
color?: string,
icon?: string,
}
interface Props {
    cellId: string | null;
    setCellId: (id: string | null) => void;
    personal: boolean;
    setPersonal: (p: boolean) => void;
    initialCellId?: string | null;
    initialPersonal?: boolean;
}

const CellDropDwon: FunctionComponent<Props> = ({ cellId, setCellId, personal, setPersonal, initialCellId = null, initialPersonal = true }) => {
    const [celldata, setCellData] = useState<CellData[]>([]);
    const [celldropdown, setcellDropdown] = useState(false)
    const [celltype, setCellType] = useState("Personal")
    const [selectedIcon, setSelectedIcon] = useState<string>("Personal")
    const [selectedColor, setSelectedColor] = useState<string>("")

const fetchCell = async () => {
    const res = await apiClient.get("/api/password/getCell")
    setCellData(res.data.data)
}
useEffect(() => {
    fetchCell()
}, [])

useEffect(() => {
    if (celldata.length > 0) {
        if (initialPersonal) {
            setCellType("Personal")
            setSelectedIcon("Personal")
            setSelectedColor("")
            setCellId(null)
            setPersonal(true)
        } else if (initialCellId) {
            const cell = celldata.find(c => c.id === initialCellId)
            if (cell) {
                setCellType(cell.title || "")
                setSelectedIcon(cell.icon || "Home")
                setSelectedColor(cell.color || "")
                setCellId(cell.id || null)
                setPersonal(false)
            }
        }
    }
}, [celldata, initialCellId, initialPersonal, setCellId, setPersonal])

    const handleCell = async (cell: CellData) => {
        const id = cell.id
        setCellId(id || null)
        setCellType(cell.title || "")
        setSelectedIcon(cell.icon || "Home")
        setSelectedColor(cell.color || "")
        setcellDropdown(false)
        setPersonal(false)
    };

    return (
        <div>
            <div className="flex ">
                <div className="relative rounded-xl overflow-hidden  border  flex items-center justify-between bg-white font-sans ">

                    <div>
                        <button onClick={() => setcellDropdown(!celldropdown)}>
                            <div className='flex justify-between w-[8vw] overflow-hidden p-2 items-center'>
                                <div className="flex items-center gap-2">
                                    <span style={{ color: selectedColor }}>
                                        {iconComponents[selectedIcon]}
                                    </span>
                                    {celltype}
                                </div>
                                <div> {celldropdown ? <FaChevronUp /> : <FaChevronDown />}</div>
                            </div>
                        </button>
                    </div>
                               
            </div>

            {celldropdown && (
                <div className="absolute mt-[6vh] right-15 z-40 bg-white border rounded px-4 py-2 space-y-2 max-h-[18vh] overflow-auto hide-scrollbar">
                    <button onClick={(e) => {
                        setPersonal(true),
                            setcellDropdown(false),
                            setCellId(null),
                            setCellType("Personal"),
                            setSelectedIcon("Personal"),
                            setSelectedColor("")
                    }}>
                        <span className="flex gap-2"><User size={16} />Personal</span></button>
                    {celldata.map((cell, index) => (
                        <div className="font-sans" key={index}>
                            <button onClick={(e) => handleCell(cell)}>
                                <span className="flex items-center gap-2">
                                    <span style={{ color: cell.color }}>
                                        {iconComponents[cell.icon || "Home"]}
                                    </span>
                                    {cell.title}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
)
}

export default CellDropDwon