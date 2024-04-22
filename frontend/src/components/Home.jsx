import React, { useEffect, useState } from 'react';
import { getUserInfo, logoutUser } from '../Api/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [selectedCells, setSelectedCells] = useState([]);
    const [groups, setGroups] = useState(['AA102', 'AA101', 'GE201', 'GE302', 'Dev101', 'Dev102']); // Liste des groupes scolaires
    const [selectedGroup, setSelectedGroup] = useState(null); 
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo();
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
    };

    const handleMouseDown = (dayIndex, hourIndex) => {
        setIsSelecting(true);
        setSelectionStart({ dayIndex, hourIndex });
        setSelectionEnd({ dayIndex, hourIndex });
    };

    const handleMouseEnter = (dayIndex, hourIndex) => {
        if (isSelecting) {
            // Limitez la sélection horizontale
            if (dayIndex === selectionStart.dayIndex) {
                setSelectionEnd({ dayIndex, hourIndex });
            }
        }
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        // Code to process the selected cells
        const selected = [];
        for (let day = Math.min(selectionStart.dayIndex, selectionEnd.dayIndex); day <= Math.max(selectionStart.dayIndex, selectionEnd.dayIndex); day++) {
            for (let hour = Math.min(selectionStart.hourIndex, selectionEnd.hourIndex); hour <= Math.max(selectionStart.hourIndex, selectionEnd.hourIndex); hour++) {
                selected.push({ day, hour });
            }
        }
        setSelectedCells(selected);

    };

    if (!userData) {
        navigate('/');
        return null;
    }

    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const generateHours = () => {
        const hours = [];
        for (let i = 8; i <= 19; i++) {
            
            if (i < 19) {
                const halfHour = `${i < 10 ? '0' + i : i}:30`;
                hours.push(halfHour);
            }
        }
        return hours;
    };
    
    
    const hours = generateHours();
    

    return (
        <div className="container mx-auto mt-8">
            <>
                <h3 className="text-3xl font-semibold mb-4">Home</h3>
                <p className="text-lg">Hello {userData.username}</p>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 mt-4 rounded focus:outline-none focus:ring focus:ring-red-400"
                >
                    Logout
                </button>

                <div className="flex ">
                    {/* Tableau des groupes */}
                    <table className="border mr-4 w-52">
                        <caption>Liste des groupes</caption>
                            {groups.map((group, index) => (
                                <tr key={index} className={`border ${selectedGroup === group ? 'bg-blue-200' : ''}`} onClick={() => handleGroupSelect(group)}>
                                    <td className='p-4'>{group}</td>
                                </tr>
                            ))}
                    </table>

                    <table className="mt-8 border  w-1/2" border={1} onMouseUp={handleMouseUp}>
                        <caption>Emploi du temps</caption>
                        <tbody>
                            <tr>
                                <th></th>
                                {hours.map((hour, index) => (
                                    <th key={index} className='border p-2 '>{hour}</th>
                                ))}
                            </tr>
                            {daysOfWeek.map((day, dayIndex) => (
                                <tr key={dayIndex} className='border'>
                                    <td className='p-2 '>{day}</td>
                                    {hours.map((_, hourIndex) => (
                                        <td
                                            key={hourIndex}
                                            className={`border ${selectedCells.some(cell => cell.day === dayIndex && cell.hour === hourIndex) ? 'bg-blue-200' : ''}`}
                                            onMouseDown={() => handleMouseDown(dayIndex, hourIndex)}
                                            onMouseEnter={() => handleMouseEnter(dayIndex, hourIndex)}
                                        ></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        </div>
    );
}
