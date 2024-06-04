import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { apiUrl } from "../../utils/Constants";

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [replyFormData, setReplyFormData] = useState({
        ticketId: null,
        userid: null,
        type: "",
        subject: "",
        message: "",
        name: "",
        phone: "",
        nic: ""
    });
    const [replyFormVisible, setReplyFormVisible] = useState(false);

    const toggleStatus = async (id) => {
        try {
            const rep = await axios.put(`${apiUrl}/ticket/${id}`, { status: 'approved' })
            toast.success('Ticket Marked As Solved')
            getAllTickets()
        } catch (error) {
            console.log(error);
        }
    };

    const handleReply = (tick) => {
        setReplyFormData(tick);
        setReplyFormVisible(true);
    };

    const handleCancelReply = () => {
        setReplyFormVisible(false);
    };

    const handleSendReply = async () => {
        if (replyFormData.message.trim() === "") {
            toast.error("Please enter a reply before sending.");
        } else {
            const resp = await axios.post(`${apiUrl}/ticket/reply/${replyFormData._id}`, {
                userid: replyFormData.userid,
                message: replyFormData.message
            });
            toggleStatus(replyFormData._id); // Change ticket status to resolved
            setReplyFormVisible(false);
            toast.success("Reply sent successfully.");
        }
    };

    const handleReplyChange = (e) => {
        const { name, value } = e.target;
        setReplyFormData({
            ...replyFormData,
            [name]: value
        });
    };

    const getAllTickets = async () => {
        try {
            const resp = await axios.get(`${apiUrl}/ticket`)
            setTickets(resp.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/ticket/${id}`);
            toast.success('Ticket deleted successfully.');
            getAllTickets();
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    useEffect(() => {
        getAllTickets()
    }, [])

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0); // Black color
        doc.setFont("helvetica", "bold"); // Set font to bold
        doc.text("My Tickets", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

        // Table headers
        const headers = [['ID', 'Ticket Type', 'Subject', 'Description', 'Status', 'Name', 'Phone Number', 'NIC Number']];
        const data = headers.concat(tickets.map(ticket => [ticket._id, ticket.type, ticket.subject, ticket.description, ticket.status, ticket.name, ticket.phone, ticket.nic]));

        // Create table using autoTable plugin
        doc.autoTable({
            head: [headers[0]],
            body: data.slice(1),
            startY: 20,
            theme: 'grid',
            styles: {
                font: 'helvetica',
                fontStyle: 'bold',
                textColor: [0, 0, 0], // Black color
                overflow: 'linebreak', // Allow text wrapping
                cellPadding: 5
            },
            columnStyles: {
                0: { cellWidth: 35 }, // ID column width
                1: { cellWidth: 30 }, // Ticket Type column width
                2: { cellWidth: 40 }, // Subject column width
                3: { cellWidth: 60 }, // Description column width
                4: { cellWidth: 26 }, // Status column width
                5: { cellWidth: 40 }, // Name column width
                6: { cellWidth: 40 }, // Phone Number column width
                7: { cellWidth: 40 }  // NIC Number column width
            }
        });

        // Save PDF
        doc.save("ticketreport.pdf");
    };


    return (
        <div className="container mx-auto relative">
           {/* Export PDF button */}
           <button onClick={handleExportPDF} className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded shadow mb-4">
                Export PDF
            </button>
           
            <h1 className="text-2xl font-bold mb-4 text-center">All the Tickets Received</h1>
            <table className="table-auto w-full mt-10">
                <thead className="bg-pink-100">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Ticket Type</th>
                        <th className="px-4 py-2">Subject</th>
                        <th className="px-4 py-2" style={{ width: '300px' }}>Description</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Phone Number</th>
                        <th className="px-4 py-2">NIC Number</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket, idx) => (
                        <tr key={idx} className="border-b border-gray-300">
                            <td className="border px-1 py-2">{ticket?._id}</td>
                            <td className="border px-1 py-2">{ticket?.type}</td>
                            <td className="border px-1 py-2">{ticket?.subject}</td>
                            <td className="border px-2 py-2" > <div style={{ width: '300px' }}>{ticket?.description}</div></td>
                            <td className="border px-1 py-2">{ticket?.status}</td>
                            <td className="border px-1 py-2">{ticket?.name}</td>
                            <td className="border px-1 py-2">{ticket?.phone}</td>
                            <td className="border px-1 py-2">{ticket?.nic}</td>
                            <td className="border px-1 py-2 flex items-center space-x-2">
                                {ticket?.status === "pending" && (
                                    <button onClick={() => handleReply(ticket)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Reply
                                    </button>
                                )}
                                <button onClick={() => toggleStatus(ticket?._id)}
                                    className={`bg-${ticket?.status === "pending" ? 'green' : 'gray'}-500 hover:bg-${ticket?.status === "pending" ? 'green' : 'gray'}-700 text-white font-bold py-2 px-4 rounded`}>
                                    {ticket?.status === "pending" ? "Pending" : "Resolved"}
                                </button>
                                <button onClick={() => handleDelete(ticket._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {replyFormVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-8">
                        <h2 className="text-xl font-bold mb-4">Reply to Ticket #{replyFormData._id} - {replyFormData.subject}</h2>
                        <textarea name="message" value={replyFormData.message} onChange={handleReplyChange} className="w-full h-32 border border-gray-300 rounded-lg p-2 mb-4" placeholder="Enter your reply here..." />
                        <div className="flex justify-end">
                            <button onClick={handleCancelReply} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 mr-2 rounded">
                                Cancel
                            </button>
                            <button onClick={handleSendReply} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="top-center" />
        </div>
    );
}
