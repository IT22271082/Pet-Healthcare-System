import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../utils/Constants';
import { toast } from 'react-toastify';

const CreateSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [createSc, setData] = useState({
        dateFrom: '',
        dateTo: '',
        appointments: {
            slotOne: [
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" }
            ],
            slotTwo: [
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" }
            ],
            slotThree: [
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" }
            ],
            slotFour: [
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" },
                { status: "available" }
            ]
        }
    });

    const timeSlots = [
        "9:00a.m - 9:30a.m",
        "9:30a.m - 10:00a.m",
        "4:00p.m - 4:30p.m",
        "4:30p.m - 5:00p.m",
        // Add more time slots here
    ];

    const getAllSchedule = async () => {
        try {
            const resp = await axios.get(`${apiUrl}/schedules`);
            setSchedules(resp.data);
        } catch (error) {
            console.log(error);
        }
    };

    const createSchedule = async () => {
        const startDate = new Date(createSc.dateFrom);
        const endDate = new Date(createSc.dateTo);

        if (!createSc.dateFrom || !createSc.dateTo) {
            toast.error('Please select both start and end dates');
            return;
        }

        if (startDate <= new Date() || endDate <= new Date()) {
            toast.error('Dates should be after today');
            return;
        }

        if (startDate.getDate() <= 16 || endDate.getDate() <= 16) {
            toast.error('Dates should be after the 16th of the month');
            return;
        }

        if (endDate <= startDate) {
            toast.error('End date should be after start date');
            return;
        }

        try {
            const resp = await axios.post(`${apiUrl}/schedules`, createSc);
            toast.success('Schedule created');
            getAllSchedule();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            await axios.delete(`${apiUrl}/schedules/${id}`);
            toast.success('Schedule deleted');
            getAllSchedule();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllSchedule();
    }, []);

    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const updateSlotStatus = (slot, index) => {
        setData((prevState) => ({
            ...prevState,
            appointments: {
                ...prevState.appointments,
                [slot]: prevState.appointments[slot].map((item, i) =>
                    i === index
                        ? { ...item, status: item.status === 'available' ? 'booked' : 'available' }
                        : item
                ),
            },
        }));
    };

    return (
        <div className='relative'>
            <button onClick={() => setShowForm(true)} className='px-4 py-2 bg-green-200'>
                Create Schedule
            </button>

            <div className='mt-10'>
                <h1>All Schedules</h1>
                <div className='bg-white p-3'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-green-100'>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">Start Date</th>
                                <th className="text-left pl-2">End Date</th>
                                <th className="text-left pl-2">Booked</th>
                                <th className="text-left pl-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((sc) => (
                                Object.keys(sc.appointments).map((slotKey, index) => (
                                    sc.appointments[slotKey].map((appointment, j) => (
                                        appointment.status === 'booked' &&
                                        <tr key={`${sc._id}-${slotKey}-${j}`} className='bg-green-100'>
                                            <td>{sc._id}</td>
                                            <td>{new Date(sc.dateFrom).toDateString()}</td>
                                            <td>{new Date(sc.dateTo).toDateString()}</td>
                                            <td>{timeSlots[index]}</td>
                                            <td>
                                                <button className='px-2 py-1 bg-red-200' onClick={() => deleteSchedule(sc._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showForm && (
                <div className='bg-white p-5 -translate-x-1/2 absolute top-1/2 left-1/2 shadow-xl'>
                    <div className='flex gap-5 items-center'>
                        <h2>Start Date</h2>
                        <input type='date' name='dateFrom' onChange={handleChange} />
                    </div>

                    <div className='flex gap-5 items-center'>
                        <h2>End Date</h2>
                        <input type='date' name='dateTo' onChange={handleChange} />
                    </div>
                    <div className='flex items-center justify-between'>
                        {Object.keys(createSc?.appointments).map((slotKey, index) => (
                            <div key={index}>
                                <div className='text-center col-span-1 border p-2'>{timeSlots[index]}</div>
                                {createSc?.appointments[slotKey].map((appointment, j) => (
                                    <button
                                        key={j}
                                        onClick={() => updateSlotStatus(slotKey, j)}
                                        className={`text-center w-full col-span-1 border p-2 ${
                                            appointment.status === 'available'
                                                ? 'bg-green-100 hover:bg-green-400'
                                                : 'bg-red-100 hover:bg-red-400'
                                        }`}>
                                        {appointment.status}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-5 items-center justify-between mt-10'>
                        <button className='px-4 py-2 bg-green-200' onClick={createSchedule}>
                            Submit
                        </button>
                        <button className='px-4 py-2 bg-red-200' onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateSchedule;
