import React, { useEffect, useState } from 'react';
import authAxios from '../../utils/authAxios';
import { apiUrl } from '../../utils/Constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../common/AuthContext';


export default function Checkout() {
  const [selectedCurrency, setSelectedCurrency] = useState('LKR');
  const [amount, setAmount] = useState(0)
  const [shipAddress, setShip] = useState('');
  const {clearCart} = useAuth()
  const [card, setCard] = useState({
    name: "",
  });
  const location = useLocation();
  const [buttonText, setBtnText] = useState('Save Card')
  const [price, setPrice] = useState(0.0);
  const navigate = useNavigate()
  const [rates, setRates] = useState({ lkr: 1 });
  const [targetCurrency, setTargetCurrency] = useState('lkr');
  const cart = location.state


  // Access state values
  const total = cart.reduce((total, item) => {
    return total + (item.price * item.qty);
  }, 0);

  const getSavedCardDetails = async () => {
    try {
      const det = await authAxios.get(`${apiUrl}/card/`)
      if (det?.data.length > 0) {
        setCard(det.data[0])
        console.log(det.data[0]);
        setBtnText('Place Order')
      }

    } catch (error) {
      console.log(error);
    }
  }

  const getRates = async () => {
    try {
      const data = await axios.get(`${apiUrl}/rates`)
      setRates(data.data)
    } catch (error) {
      console.log(error);
      toast.error('Error fetching Rates')
    }
  }

  useEffect(() => {
    getSavedCardDetails()
    getRates()
  }, [])

  const handleCurrencyChange = (event) => {
    const currency = event.target.value;
    setTargetCurrency(currency);
    calculatePrice(currency)
  };
  const calculatePrice = (c) => {
    const rate = rates[c];
    console.log('Rate:', rate);

    const itemPrice = parseFloat(total);
    console.log('Item Price:', itemPrice);

    const pr = parseFloat(rate) * itemPrice;
    console.log('Calculating price  rate = ' + rate + ' price = ' + total);
    console.log(pr);
    setPrice(pr);
  };

  const placeOrder = async () => {
    try {
      if (buttonText === 'Place Order') {
        const data = {
          cardId: card?._id,
          amount: total,
          products: cart,
          shipAddress
        }
        if(!shipAddress){
          toast.error('Shipping Address is required')
          return
        }
        console.log(data);
        const resp = await authAxios.put(`${apiUrl}/item/buy`, data);
        toast.success('Order is placed')
        clearCart()
        navigate('/')
      } else {
        console.log(card);
        const resp = await authAxios.post(`${apiUrl}/card/save`, card);
        toast.success('Card is Saved')
        await getSavedCardDetails()
        setBtnText('Place Order')
      }

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }

  const updateCardDetails = (e) => {
    setCard((prev) => (
      {
        ...prev,
        [e.target.name]: e.target.value
      }
    ))
    console.log(card);
  }

  const rechargeCard = async () => {
    try {
      const resp = await axios.put(`${apiUrl}/card/${card._id}`, { balance: amount })
      toast.success(`Balance Changed to ${amount}`)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="relative mx-auto w-full bg-white">
      <div className="grid min-h-screen grid-cols-10">
        <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">Checkout<span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span></h1>
            <form action="" className="mt-10 flex flex-col space-y-4">
              <div><label htmlFor="email" className="text-xs font-semibold text-gray-500">Shipping Address</label>
                <input type="text" required id="shipAddress" name="shipAddress" placeholder="Shipping Address" onChange={e => setShip(e.target.value)} value={shipAddress} className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500" />
              </div>
              <div><label htmlFor="email" className="text-xs font-semibold text-gray-500">Email</label>
                <input type="email" id="email" name="email" placeholder="john.capler@fang.com" onChange={updateCardDetails} value={card?.email} className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500" />
              </div>

              {/* <div><label htmlFor="cardType" className="text-xs font-semibold text-gray-500">Card Type</label>
                <select id="cardType" name="card-name" placeholder="Address" className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500" >
                  <option value="">Select</option>
                  <option value="Master">Master</option>
                  <option value="VISA">VISA</option>
                </select>
              </div> */}

              <div className="relative"><label htmlFor="card-number" className="text-xs font-semibold text-gray-500">Card number</label><input type="text" onChange={updateCardDetails} value={card?.cardNumber} id="card-number" name="cardNumber" placeholder="1234-5678-XXXX-XXXX" className="block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 pr-10 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500" /><img src="" alt="" className="absolute bottom-3 right-3 max-h-4" /></div>
              <div>


                <p className="text-xs font-semibold text-gray-500">Expiration date</p>
                <div className="mr-6 flex flex-wrap">
                  <div className="my-1">
                    <label htmlFor="month" className="sr-only">Select expiration month</label>
                    <input
                      id="year"
                      type="number"
                      min="1"
                      max="12"
                      name='expMonth'
                      className='p-3 border placeholder-gray-300 bg-gray-50'
                      placeholder='mm'
                      value={card.expMonth}
                      onChange={updateCardDetails}
                    />
                  </div>
                  <div className="my-1 ml-3 mr-6">
                    <label htmlFor="year" className="sr-only">Select expiration year</label>
                    <input
                      id="year"
                      type="number"
                      min="1000"
                      max="9999"
                      name='expYear'
                      className='p-3 border placeholder-gray-300 bg-gray-50'
                      placeholder='yyyy'
                      value={card.expYear}
                      onChange={updateCardDetails}
                    />
                  </div>


                  <div className="relative my-1"><label htmlFor="security-code" className="sr-only">Security code</label><input type="text" onChange={updateCardDetails} value={card?.cvv} id="security-code" name="cvv" placeholder="Security code" className="block w-36 rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500" /></div>
                </div>
              </div>


              <div>
                <p className="text-xs font-semibold text-gray-500">Name on the Card</p>
                <input type="text" id="cardName" name="name" onChange={updateCardDetails} value={card?.name} placeholder="Type the name" className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500" />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-500">Total Price:</p>
                <div className="flex items-center">
                  {/* <select
                    value={targetCurrency}
                    onChange={handleCurrencyChange}
                    className="px-3 py-1 border rounded-md outline-none"
                  >
                    {Object.keys(rates).map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select> */}
                  <span className="ml-2">
                    LKR {total}
                  </span>
                </div>
              </div>
              {/* {(
                <p className="text-sm font-semibold text-gray-500">
                  Converted Price: {targetCurrency} {price.toFixed(2)}
                </p>
              )} */}

            </form>
            <p className="mt-10 text-center text-sm font-semibold text-gray-500">By placing this order you agree to the <a href="#" className="whitespace-nowrap text-teal-400 underline hover:text-teal-600">Terms and Conditions</a></p>
            <button type="button" onClick={placeOrder} className="mt-4 inline-flex w-full items-center justify-center rounded bg-blue-500 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-teal-500 sm:text-lg">
              {buttonText}
            </button>
           <div className='mt-10'>
              
              {/*<span className='text-xs'>this will change the card balance to a given amount if card balance is insufficiant for a specific order, this is for testing purpose only</span>*/}
           {/*  <div className='flex items-center justify-between'>
                <input type="number" className='p-2 border ' value={amount} onChange={e => setAmount(e.target.value)} />
                <button className='my-10 p-2 bg-green-200' type='button' onClick={rechargeCard}>Recharge Card</button>
            </div>*/}

            </div>
          </div>
        </div>
        <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24 bg-blue-300">

          <h2 className="sr-only">Order summary</h2>
          <div>
            <img src="" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-teal-800 to-teal-400 opacity-95"></div>
          </div>
          <div className="relative">

            <div className="my-5 h-0.5 w-full bg-white bg-opacity-30"></div>
            <div className="space-y-2">
              <p className="flex justify-between text-lg font-bold text-white"><span>Total price:</span><span>LKR. {total}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
