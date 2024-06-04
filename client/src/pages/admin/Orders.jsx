import React, { useState, useEffect } from 'react';
import { useAuth } from '../common/AuthContext';
import { apiUrl } from '../../utils/Constants';
import authAxios from '../../utils/authAxios';
import { usePDF } from 'react-to-pdf';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import jsPDF from 'jspdf';

export default function AdminOrders() {
  const [transactions, setTransactions] = useState([]);
  const { id } = useAuth();
  const { toPDF, targetRef } = usePDF({ filename: 'Orders.pdf' });
  const [selectedTr, setSelTR] = useState({})
  const [updateModal, setUpdateModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  // Function to download PDF
  const downloadPDF = () => {
    // Create jsPDF instance
    const pdf = new jsPDF();

    // Define columns for the PDF table
    const columns = ['ID', 'Product', 'Amount', 'Shipping Address', 'Status', 'Created At'];
    const rows = [];

    // Extract data from transactions state
    transactions.forEach((transaction, index) => {
      const rowData = [
        index + 1, // Adding 1 to index to start from 1 instead of 0
        transaction.productId?.title || 'Item No Longer Available',
        transaction.amount,
        transaction.shipAddress || 'Address No Longer Available',
        transaction.status,
        new Date(transaction.createdAt).toDateString()
      ];
      rows.push(rowData);
    });

    const headerText = "Orders";
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
    pdf.save('Orders.pdf');
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  const getAllTransactions = async () => {
    try {
      const response = await authAxios.get(`${apiUrl}/card/transactions/all`)
      setTransactions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Handle error
    }
  };

  const updateTransaction = async () => {
    try {
      const response = await authAxios.put(`${apiUrl}/card/order/${selectedTr._id}`, selectedTr)
      console.log(response.data);
      toast.success('Order Updated')
      setUpdateModal(false)
      getAllTransactions()
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Handle error
    }
  }

  const deleteTr = async () => {
    try {
      const response = await authAxios.delete(`${apiUrl}/card/order/${selectedTr._id}`);
      console.log(response.data);
      toast.warning('Order Deleted');
      // Close the confirmation popup
      closePopup();
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Handle error
    }
  };

  const handleUpdateDialogOpen = (t) => {
    setSelTR(t)
    setUpdateModal(true)
  }

  const handleDeleteDialogOpen = (t) => {
    setSelTR(t)
    setDeleteModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelTR(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-8 rounded-md w-full">
      
      <div className="max-w-full overflow-x-auto">
      <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={downloadPDF}
            >
                Download PDF
            </button>
  <table className="min-w-full bg-white border-collapse shadow rounded-lg overflow-hidden">
    <thead className="bg-blue-100">
      <tr>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          #
        </th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Product
        </th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Amount
        </th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Shipping Address
        </th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Created At
        </th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      {transactions?.map((transaction, index) => (
        <tr key={transaction._id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {transaction?.productId?.title || 'Item No Longer Available'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {transaction?.shipAddress || 'Address No Longer Available'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.status}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {new Date(transaction.createdAt).toDateString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center justify-between gap-3">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleUpdateDialogOpen(transaction)}>Update</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleDeleteDialogOpen(transaction)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)}>
        <DialogTitle>Delete Payment Details</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the Order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModal(false)} color="primary">No</Button>
          <Button color="secondary" onClick={deleteTr}>Yes</Button>
        </DialogActions>
      </Dialog>


      {/* Update Payment Details Dialog */}
      <Dialog open={updateModal} onClose={() => setUpdateModal(false)}>
        <DialogTitle>Update Order Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="ID"
            label="Order ID"
            type="text"
            fullWidth
            name="ID"
            value={selectedTr?._id || ''}
            onChange={handleInputChange}
            disabled
          />
          <TextField
            margin="dense"
            id="product"
            label="Product"
            type="text"
            fullWidth
            name="product"
            value={selectedTr?.productId?.title || ''}
            disabled
          />
          <TextField
            margin="dense"
            id="qty"
            label="Quantity"
            type="text"
            fullWidth
            name="qty"
            value={selectedTr?.qty || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="createdAt"
            label="Order Placed Date"
            type="text"
            fullWidth
            name="expYear"
            value={selectedTr?.createdAt || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="shippingAddress"
            label="Shipping Address"
            type="text"
            fullWidth
            name="shippingAddress"
            value={selectedTr?.shipAddress || ''}
            onChange={handleInputChange}
          />
         
          <p>Status</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name='status'
            value={selectedTr?.status}
            onChange={handleInputChange}
            className='w-full'
            label="Status"
          >
            <MenuItem value="pending">pending</MenuItem>
            <MenuItem value="approved">approved</MenuItem>
            <MenuItem value="completed">completed</MenuItem>
            <MenuItem value="rejected">rejected</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateModal(false)} color="primary">Cancel</Button>
          <Button onClick={updateTransaction} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
