import React, { useEffect, useState } from "react";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authAxios from "../../utils/authAxios";
import { apiUrl } from "../../utils/Constants";
import 'react-clock/dist/Clock.css';
import axios from "axios";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [timeSlot, setTimeSlot] = useState(null);
    const [showUpdate, setShowUpdate] = useState(false)
    const [selectedApp, setSelectedApp] = useState({})


    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    const [minDate, setMinDate] = useState(getTodayDate());

    const handleStatusClick = async (id, status) => {
        try {
            const resp = await axios.put(`${apiUrl}/appointment/${id}`, { status })
            toast.warning('Appointment Cancelled')
            myApps()
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const message = event.target.message.value;
        const date = event.target.date.value;
        const timeSlot = event.target.timeSlot.value;
        const type = event.target.type.value;

        // Basic validation
        if (!message || !date || !timeSlot || !type) {
            toast.error('Please fill out all fields.');
            return;
        }

        // Validate message to contain only alphabetic characters
        const messageRegex = /^[A-Za-z]+$/;
        if (!messageRegex.test(message)) {
            toast.error('Message should contain only alphabetic characters.');
            return;
        }

        // Date validation
        const selectedDate = new Date(date);
        const today = new Date();
        if (selectedDate < today) {
            toast.error('Please select a date in the future.');
            return;
        }

        try {
            const data = {
                message,
                date,
                timeSlot,
                type
            };
            const resp = await axios.put(`${apiUrl}/appointment/${selectedApp._id}`, data);
            toast.warning('Appointment Updated');
            setShowUpdate(false);
            myApps();
        } catch (error) {
            console.log(error);
            toast.error('Failed to update appointment.');
        }
    };

    const handleShowUpdate = (a) => {
        setSelectedApp(a)
        setShowUpdate(true)
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const message = event.target.message.value;
        const date = event.target.date.value;
        const timeSlot = event.target.timeSlot.value;
        const type = event.target.type.value;

        // Basic validation
        if (!message || !date || !timeSlot || !type) {
            toast.error('Please fill out all fields.');
            return;
        }

        // Validate message to contain only alphabetic characters
        const messageRegex = /^[A-Za-z]+$/;
        if (!messageRegex.test(message)) {
            toast.error('Message should contain only alphabetic characters.');
            return;
        }

        // Date validation
        const selectedDate = new Date(date);
        const today = new Date();
        if (selectedDate < today) {
            toast.error('Please select a date in the future.');
            return;
        }

        try {
            const resp = await authAxios.post(`${apiUrl}/appointment`, {
                message,
                date,
                timeSlot,
                type
            });
            toast.success('Appointment Created');
            myApps();
        } catch (error) {
            console.log(error);
            toast.error('Failed to create appointment.');
        }
        setShowForm(false);
    };

    const handleClose = () => {
        setShowForm(false);
    };

    const myApps = async () => {
        try {
            const data = await authAxios.get(`${apiUrl}/appointment/my`)
            console.log(data.data);
            setAppointments(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        myApps()
    }, [])

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedApp(prev => ({
            ...prev,
            [name]: name === "timeSlot" ? value : e.target.value
        }));
    }

    return (
        <div className="container mx-auto relative">
            <h1 className="text-2xl font-bold mb-4 text-center">Appointments</h1>
            <button className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-green-500 text-white rounded" onClick={() => setShowForm(true)}>Make Appointment</button>

            {showForm && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <button className="absolute top-0 right-0 m-2" onClick={handleClose}>Close</button>
                        <h2 className="text-lg font-semibold mb-4">Make Appointment</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="message" className="block font-medium">Message:</label>
                                <input type="text" id="message" name="message" className="border border-gray-400 rounded px-3 py-2 w-full" placeholder="Enter your message" />
                            </div>
                            <div>
                                <label htmlFor="date" className="block font-medium">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    className="border border-gray-400 rounded px-3 py-2 w-full"
                                    placeholder="Select date"
                                    min={minDate}
                                />
                            </div>
                            <div>
                                <label htmlFor="timeSlot" className="block font-medium">Time Slot:</label>
                                <TimePicker
                                    id="timeSlot"
                                    name="timeSlot"
                                    className="border border-gray-400 rounded px-3 py-2 w-full"
                                    placeholder="Select time" // Placeholder for time picker
                                    value={timeSlot}
                                    onChange={setTimeSlot}
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block font-medium">Appointment Type:</label>
                                <select name="type" id="type" className="w-full p-2 border">
                                    <option value="sergeory">Surgery</option>
                                    <option value="checkup">Checkup</option>
                                    <option value="vaccination">Vaccination</option> {/* Add new appointment type */}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded mr-2">Submit</button>
                                <button onClick={handleClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-full overflow-x-auto">
                <table className="table-auto w-full mt-10">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Message</th>
                            <th className="px-4 py-2">Appointment Type</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Time Slot</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {appointments?.map(appointment => (
                            <tr key={appointment.id}>
                                <td className="border px-4 py-2">{appointment?._id}</td>
                                <td className="border px-4 py-2">{appointment?.message}</td>
                                <td className="border px-4 py-2">{appointment?.type}</td>
                                <td className="border px-4 py-2">{new Date(appointment?.date).toDateString()}</td>
                                <td className="border px-4 py-2">{appointment?.timeSlot}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className={`px-2 py-1 rounded ${
                                            appointment.status === 'approved'
                                                ? 'bg-red-500 text-white'
                                                : appointment.status === 'cancelled'
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-green-500 text-white'
                                            }`}
                                        onClick={() => handleStatusClick(appointment._id, appointment.status)}
                                        disabled={appointment.status === 'approved' || appointment.status === 'pending'}
                                    >
                                        {appointment.status}
                                    </button>
                                </td>
                                <td className="border px-4 py-2 inline-flex gap-2">
                                    <button
                                        className="px-2 py-1 rounded bg-red-500 text-white"
                                        onClick={() => handleStatusClick(appointment._id, 'cancelled')}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-2 py-1 rounded border-red-500 border-2 text-red-500"
                                        onClick={() => handleShowUpdate(appointment)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {
                showUpdate && <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <button className="absolute top-0 right-0 m-2" onClick={handleClose}>Close</button>
                        <h2 className="text-lg font-semibold mb-4">Update Appointment</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label htmlFor="message" className="block font-medium">Message:</label>
                                <input type="text" id="message" onChange={handleUpdateChange} name="message" value={selectedApp.message} className="border border-gray-400 rounded px-3 py-2 w-full" placeholder="Enter your message" />
                            </div>
                            <div>
                                <label htmlFor="date" className="block font-medium">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    defaultValue={selectedApp?.date}
                                    className="border border-gray-400 rounded px-3 py-2 w-full"
                                    placeholder="Select date"
                                    min={minDate}
                                    onChange={handleUpdateChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="timeSlot" className="block font-medium">Time Slot:</label>
                                <TimePicker
                                    id="timeSlot"
                                    name="timeSlot"
                                    className="border border-gray-400 rounded px-3 py-2 w-full"
                                    placeholder="Select time"
                                    value={selectedApp.timeSlot}
                                    onChange={(value) => handleUpdateChange({ target: { name: "timeSlot", value } })}
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block font-medium">Appointment Type:</label>
                                <select name="type" id="type" className="w-full p-2 border" value={selectedApp.type} onChange={handleUpdateChange}>
                                    <option value="surgery">Surgery</option>
                                    <option value="checkup">Checkup</option>
                                    <option value="vaccination">Vaccination</option> {/* Add new appointment type */}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded mr-2">Submit</button>
                                <button onClick={() => setShowUpdate(false)} type="button" className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
            <ToastContainer position="top-center" />
        </div>
    );
}
