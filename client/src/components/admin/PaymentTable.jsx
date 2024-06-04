import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../../utils/Constants';
import {toast} from 'react-toastify'
const PaymentTable = ({ cards }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [updatedCard, setUpdatedCard] = useState(null);


    const handleDeleteDialogOpen = (card) => {
        setSelectedCard(card);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleUpdateDialogOpen = (card) => {
        setSelectedCard(card);
        setUpdatedCard({ ...card });
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCard(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDeleteConfirmed = async () => {
        // Here you can implement the logic to delete the payment details using the card ID
        console.log('Deleting card with ID:', selectedCard._id);
        try {
            const resp = await axios.delete(`${apiUrl}/card/${selectedCard._id}`)
            toast.warning('Deleted')
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
        setDeleteDialogOpen(false);

    };

    const handleUpdateConfirmed =async () => {
        // Here you can implement the logic to update the payment details
        console.log('Updating card with ID:', selectedCard._id);
        try {
            const resp = await axios.put(`${apiUrl}/card/${selectedCard._id}`, updatedCard)
            toast.warning('Updated')
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
        setUpdateDialogOpen(false);
    };

    // Ensure that cards is an array before rendering
    if (cards.length > 0) {
        // Sample data for testing


        return (
            <div className="overflow-xl-auto">
                <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
    <thead className="bg-gray-200 text-gray-700">
        <tr>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold uppercase">Customer ID</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold uppercase">Name</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold uppercase">Card Number</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold uppercase">Expiration</th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold uppercase">CVV</th>
            {/* <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold uppercase">Card Type</th> */}
            <th className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold uppercase">Actions</th>
        </tr>
    </thead>
    <tbody className="text-gray-600">
        {cards.map(card => (
            <tr key={card._id} className="hover:bg-gray-100">
                <td className="px-6 py-4">{card._id}</td>
                <td className="px-6 py-4">{card.name}</td>
                <td className="px-6 py-4">{card.cardNumber}</td>
                <td className="px-6 py-4">{`${card.expMonth}/${card.expYear}`}</td>
                <td className="px-6 py-4">{card.cvv}</td>
                {/* <td className="px-6 py-4">{card.cardType}</td> */}
                <td className="px-6 py-4 flex items-center">
                    <button className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={() => handleUpdateDialogOpen(card)}>Update</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600" onClick={() => handleDeleteDialogOpen(card)}>Delete</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>



                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                    <DialogTitle>Delete Payment Details</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete the payment details for {selectedCard && selectedCard.name}?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose} color="primary">No</Button>
                        <Button onClick={handleDeleteConfirmed} color="secondary">Yes</Button>
                    </DialogActions>
                </Dialog>

                {/* Update Payment Details Dialog */}
                <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
                    <DialogTitle>Update Payment Details</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            name="name"
                            value={updatedCard?.name || ''}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            id="cardNumber"
                            label="Card Number"
                            type="text"
                            fullWidth
                            name="cardNumber"
                            value={updatedCard?.cardNumber || ''}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            id="expMonth"
                            label="Expiration Month"
                            type="text"
                            fullWidth
                            name="expMonth"
                            value={updatedCard?.expMonth || ''}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            id="expYear"
                            label="Expiration Year"
                            type="text"
                            fullWidth
                            name="expYear"
                            value={updatedCard?.expYear || ''}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            id="cvv"
                            label="CVV"
                            type="text"
                            fullWidth
                            name="cvv"
                            value={updatedCard?.cvv || ''}
                            onChange={handleInputChange}
                        />
                       
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateDialogClose} color="primary">Cancel</Button>
                        <Button onClick={handleUpdateConfirmed} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    return (
        <div>No payment data available.</div>
    );
};

export default PaymentTable;
