import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authAxios from "../../utils/authAxios";
import { apiUrl } from "../../utils/Constants";
import axios from "axios";
import jsPDF from 'jspdf';

export default function AppointmentsScheduleHome() {
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleStatus = async (id, status) => {
        if (status === 'approved') {
            toast.error("Approved appointment cannot be set back to pending!", { position: "top-center" });
            return;
        }
        try {
            const resp = await axios.put(`${apiUrl}/appointment/${id}`, { status: 'approved' });
            toast.success('Appointment Approved');
            myApps();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        console.log("Deleting appointment with ID:", id);
        try {
            await axios.delete(`${apiUrl}/appointment/${id}`);
            toast.success('Appointment Deleted');
            myApps();
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete appointment');
        }
    };


    const handleCancel = async (id) => {
        console.log("Deleting appointment with ID:", id);
        try {
            await axios.put(`${apiUrl}/appointment/${id}`,{status:'cancelled'});
            toast.success('Appointment Cancelled');
            myApps();
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete appointment');
        }
    };

    const downloadPDF = () => {
        // Create jsPDF instance
        const pdf = new jsPDF('p', 'pt', 'letter');
    
        // Define columns for the PDF table
        const columns = ['ID', 'Message', 'Appointment Type', 'Date', 'Time Slot', 'Status'];
        const rows = [];
    
        // Extract data from appointments state
        appointments.forEach(appointment => {
            const rowData = [
                appointment._id,
                appointment.message,
                appointment.type,
                new Date(appointment.date).toLocaleString(),
                appointment.timeSlot,
                appointment.status
            ];
            rows.push(rowData);
        });
    
        const headerText = "Appointments List";
        const headerFontSize = 16;
        const headerMargin = 20; // Adjust as needed
    
        pdf.setFontSize(headerFontSize);
        const headerTextWidth = pdf.getStringUnitWidth(headerText) * headerFontSize / pdf.internal.scaleFactor;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const headerX = (pageWidth - headerTextWidth) / 2;
        pdf.text(headerText, headerX, headerMargin);
    
        const tableStartY = headerMargin + headerFontSize + 10; // Adjust as needed
    
        pdf.autoTable({
            startY: tableStartY, // Adjust startY value to leave space for the heading
            head: [columns],
            body: rows,
        });
    
        // Save PDF
        pdf.save('appointments_schedule.pdf');
    };
    
    



    const handleFormSubmit = (event) => {
        event.preventDefault();
        setAppointments(prevAppointments => [
            ...prevAppointments,
            {
                id: prevAppointments.length + 1,
                message: event.target.message.value,
                type: event.target.type.value,
                status: "pending",
                date: event.target.date.value,
                timeSlot: event.target.timeSlot.value
            }
        ]);
        setShowForm(false);
    };

    const handleClose = () => {
        setShowForm(false);
    };

    const myApps = async () => {
        try {
            const data = await authAxios.get(`${apiUrl}/appointment`);
            console.log(data.data);
            setAppointments(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        myApps();
    }, []);

    // Function to filter appointments based on the search query
    const filteredAppointments = appointments.filter(appointment =>
        appointment.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto relative">
            <h1 className="text-2xl font-bold mb-4 text-center">Appointments List</h1>
            <div className="flex justify-between items-center mb-4">
                {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setShowForm(true)}>
                    Make Appointment
                </button> */}
                <input
                    type="text"
                    placeholder="Search by Type..."
                    className="border border-gray-400 px-4 py-2 rounded"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="container mx-auto relative" id="table-container"></div>
            <table className="table-auto w-full mt-10">
                <thead className="bg-pink-100">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Message</th>
                        <th className="px-4 py-2">Appointment Type</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Time Slot</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th> {/* Add this */}
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {filteredAppointments.map(appointment => (
                        <tr key={appointment.id}>
                            <td className="border px-4 py-2">{appointment._id}</td>
                            <td className="border px-4 py-2">{appointment.message}</td>
                            <td className="border px-4 py-2">{appointment.type}</td>
                            <td className="border px-4 py-2">{new Date(appointment.date).toLocaleString()}</td>
                            <td className="border px-4 py-2">{appointment.timeSlot}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className={`px-2 py-1 rounded ${appointment.status === 'approved' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                                    onClick={() => toggleStatus(appointment._id, appointment.status)}
                                >
                                    {appointment.status}
                                </button>
                            </td>
                            <td className="border px-4 py-2 flex items-center gap-3">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => handleDelete(appointment._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => handleCancel(appointment._id)}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={downloadPDF}
            >
                Download PDF
            </button>
            <ToastContainer position="top-center" />
        </div>
    );
}
