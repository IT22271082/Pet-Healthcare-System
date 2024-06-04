import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../../utils/Constants";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import authAxios from "../../utils/authAxios";

export default function Feedbacks() {
    const [open, setOpen] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [updatedRating, setUpdatedRating] = useState("");
    const [updatedComment, setUpdatedComment] = useState("");
    const [feedbackToUpdate, setFeedbackToUpdate] = useState(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUpdateMode(false);
        setUpdateId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const rating = event.target.rat.value;
            if (rating < 1 || rating > 5) {
                toast.error('Rating must be between 1 and 5');
                return;
            }

            const phone = event.target.phone.value;
            if (!phone.match(/^\d{10}$/)) {
                toast.error('Phone number must be 10 digits');
                return;
            }

            const feedbackData = {
                rating,
                comment: event.target.com.value,
                name: event.target.name.value,
                email: event.target.email.value,
                phone
            };

            const resp = await authAxios.post(`${apiUrl}/feedback`, feedbackData);
            toast.success('Feedback Submitted');
            event.target.reset();
            getAllFeedbacks();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    };

    const getAllFeedbacks = async () => {
        try {
            const resp = await axios.get(`${apiUrl}/feedback`);
            setFeedbacks(resp.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllFeedbacks();
    }, [])

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("My Feedbacks", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

        const headers = [['FeedbackId','Name', 'Rating', 'Comment']];
        const data = headers.concat(feedbacks.map(feedback => [feedback._id, feedback.name, feedback.rating, feedback.comment]));

        doc.autoTable({
            head: [headers[0]],
            body: data.slice(1),
            startY: 20,
            theme: 'grid',
            styles: {
                font: 'helvetica',
                fontStyle: 'bold',
                textColor: [0, 0, 0],
                overflow: 'linebreak',
                cellPadding: 5
            },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 35 },
                2: { cellWidth: 30 },
                3: { cellWidth: 40 },
            }
        });

        doc.save("my_feedbacks.pdf");
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/feedback/${id}`);
            toast.success('Feedback deleted successfully.');
            getAllFeedbacks();
        } catch (error) {
            console.error('Error deleting feedback:', error);
            toast.error('Failed to delete feedback');
        }
    };

    const handleUpdate = (id) => {
        const feedbackToUpdate = feedbacks.find((feedback) => feedback._id === id);
        if (!feedbackToUpdate) {
            toast.error('Feedback not found');
            return;
        }

        setFeedbackToUpdate(feedbackToUpdate);

        setUpdateId(id);
        setUpdateMode(true);
        setUpdatedRating(feedbackToUpdate.rating);
        setUpdatedComment(feedbackToUpdate.comment);
        setOpen(true); // Open the form with update data
    };

    const handleUpdateCancel = () => {
        setUpdateMode(false);
        setUpdateId(null);
        setOpen(false); // Close the form
    };

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const updatedRating = event.target.rat.value;
            if (updatedRating < 1 || updatedRating > 5) {
                toast.error('Rating must be between 1 and 5');
                return;
            }
    
            const phone = event.target.phone.value;
            if (!phone.match(/^\d{10}$/)) {
                toast.error('Phone number must be 10 digits');
                return;
            }
    
            const updatedFeedbackData = {
                rating: updatedRating,
                comment: event.target.com.value,
                name: event.target.name.value,
                email: event.target.email.value,
            };
    
            await axios.put(`${apiUrl}/feedback/${updateId}`, updatedFeedbackData);
            toast.success('Feedback updated successfully');
            getAllFeedbacks();
            handleClose();
        } catch (error) {
            console.error('Error updating feedback:', error);
            toast.error('Failed to update feedback');
        }
    };
    

    return (
        <div className="container mx-auto relative">
            <h1 className="text-2xl font-bold mb-4 text-center">All the feedback Received</h1>

            <ToastContainer />

            <button onClick={handleOpen} className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded shadow mb-4">
                Raise a Feedback
            </button>
            <button onClick={handleExportPDF} className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded shadow mb-4">
                Export PDF
            </button>

            {open && !updateMode && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
                    <form className="bg-white rounded shadow-lg w-96 p-10" onSubmit={handleSubmit}>
                        <h2>Raise a feedback</h2>
                        <input type="text" name="name" placeholder="Name" className="p-2 border my-2 w-full" />
                        <input type="email" name="email" placeholder="Email" className="p-2 border my-2 w-full" />
                        <input type="tel" name="phone" placeholder="Phone Number (10 digits)" pattern="[0-9]{10}" className="p-2 border my-2 w-full" />
                        <input type="text" name="rat" placeholder="Rating (1-5)" className="p-2 border my-2 w-full" />
                        <input type="text" name="com" placeholder="Comment" className="p-2 border my-2 w-full" />
                        <div className="flex items-center justify-between">
                            <button className="p-2 border bg-green-300">Submit</button>
                            <button className="p-2 border bg-red-300" type="button" onClick={handleClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {open && updateMode && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
                    <form className="bg-white rounded shadow-lg w-96 p-10" onSubmit={handleUpdateSubmit}>
                        <h2>Update Feedback</h2>
                        <input type="text" name="name" placeholder="Name" defaultValue={feedbackToUpdate.name} className="p-2 border my-2 w-full" />
                        <input type="email" name="email" placeholder="Email" defaultValue={feedbackToUpdate.email} className="p-2 border my-2 w-full" />
                        <input type="tel" name="phone" placeholder="Phone Number (10 digits)" pattern="[0-9]{10}" defaultValue={feedbackToUpdate.phone} className="p-2 border my-2 w-full" />
                        <input type="text" name="rat" placeholder="Rating (1-5)" value={updatedRating} onChange={(e) => setUpdatedRating(e.target.value)} className="p-2 border my-2 w-full" />
                        <input type="text" name="com" placeholder="Comment" value={updatedComment} onChange={(e) => setUpdatedComment(e.target.value)} className="p-2 border my-2 w-full" />
                        <div className="flex items-center justify-between">
                            <button className="p-2 border bg-green-300">Update</button>
                            <button className="p-2 border bg-red-300" type="button" onClick={handleUpdateCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <table className="table-auto w-full mt-10">
                <thead className="bg-pink-100">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Phone Number</th>
                        <th className="px-4 py-2">Rating</th>
                        <th className="px-4 py-2">Comment</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((feedback, idx) => (
                        <tr key={idx} className="border-b border-gray-300">
                            <td className="border px-4 py-2">{feedback?._id}</td>
                            <td className="border px-4 py-2">{feedback?.name}</td>
                            <td className="border px-4 py-2">{feedback?.email}</td>
                            <td className="border px-4 py-2">{feedback?.phone}</td>
                            <td className="border px-4 py-2">{feedback?.rating}</td>
                            <td className="border px-4 py-2">{feedback?.comment}</td>
                            <td className="border px-4 py-2 flex items-center space-x-2">
                                <button onClick={() => handleUpdate(feedback._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Update
                                </button>
                                <button onClick={() => handleDelete(feedback._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
