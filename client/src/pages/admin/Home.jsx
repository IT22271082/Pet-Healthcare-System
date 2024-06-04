import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentTable from '../../components/admin/PaymentTable';
import Divider from '@mui/material/Divider';
import { apiUrl } from '../../utils/Constants';
import jsPDF from 'jspdf';

const Home = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${apiUrl}/card/all`);
      setCards(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }

  };

  const getOverview = async () => {
    try {
      const resp = await axios.get(`${apiUrl}/item/sales/overview`)
      console.log(resp.data);
      setOverview(resp.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCards();
    getOverview()
  }, []);

 // Filter cards based on search query
 const filteredCards = cards.filter(card =>
  card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  card.cardNumber.includes(searchQuery) ||
  `${card.expMonth}/${card.expYear}`.includes(searchQuery) ||
  card.cvv.includes(searchQuery)
);

// Function to download PDF
const downloadPDF = () => {
  // Create jsPDF instance
  const pdf = new jsPDF();

  // Define columns for the PDF table
  const columns = ['Name', 'Card Number', 'Expiry Date', 'CVV'];
  const rows = [];

  // Extract data from cards state
  filteredCards.forEach((card, index) => {
    const rowData = [
      card.name,
      card.cardNumber,
      `${card.expMonth}/${card.expYear}`,
      card.cvv,
    ];
    rows.push(rowData);
  });

  const headerText = 'Payment Methods';
  const headerFontSize = 16;
  const headerMargin = 20; // Adjust as needed

  pdf.setFontSize(headerFontSize);
  const headerTextWidth =
    (pdf.getStringUnitWidth(headerText) * headerFontSize) /
    pdf.internal.scaleFactor;
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
  pdf.save('Payment_Methods.pdf');
};
  return (
    <div className="bg-gray-100 min-h-screen p-">
      <div className='my-5 bg-white border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        <div className='border shadow-xl p-3 rounded-xl text-center'>
          <p className='font-semibold text-base text-gray-700 mb-2'>Pending Amount</p>
          <hr className="my-2" />
          <p className='text-xl font-bold text-gray-900'>{overview?.pendingAmount}</p>
        </div>
        <div className='border shadow-xl p-3 rounded-xl text-center'>
          <p className='font-semibold text-base text-gray-700 mb-2'>Total Sales</p>
          <hr className="my-2" />
          <p className='text-xl font-bold text-gray-900'>{overview?.totalSaleAmount}</p>
        </div>
        <div className='border shadow-xl p-3 rounded-xl text-center'>
          <p className='font-semibold text-base text-gray-700 mb-2'>Approved Orders</p>
          <hr className="my-2" />
          <p className='text-xl font-bold text-gray-900'>{overview?.totalApprovedOrders}</p>
        </div>
        <div className='border shadow-xl p-3 rounded-xl text-center'>
          <p className='font-semibold text-base text-gray-700 mb-2'>Pending Orders</p>
          <hr className="my-2" />
          <p className='text-xl font-bold text-gray-900'>{overview?.totalPendingOrders}</p>
        </div>
        <div className='border shadow-xl p-3 rounded-xl text-center'>
          <p className='font-semibold text-base text-gray-700 mb-2'>Rejected Orders</p>
          <hr className="my-2" />
          <p className='text-xl font-bold text-gray-900'>{overview?.totalRejectedOrders}</p>
        </div>
      </div>
       {/* Search Field */}
       
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
     
      <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={downloadPDF}
            >
                Download PDF
            </button>
      <h1 className="text-3xl font-semibold mb-4 text-center">All Payment Methods of Customers</h1>
     
      
     
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <PaymentTable cards={filteredCards} />
      )}
    </div>
  );
  
  
  
  
};

export default Home;

