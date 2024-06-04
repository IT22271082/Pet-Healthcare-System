import React, { useEffect, useState } from 'react';
import { useAuth } from '../common/AuthContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiUrl } from '../../utils/Constants';

export default function ItemPage() {
    const { userRole, addItemToCart } = useAuth();
    const { id } = useParams()
    const [item, setItem] = useState({})
    const [rates, setRates] = useState({ lkr:1});

    const [targetCurrency, setTargetCurrency] = useState('lkr');
    const [rateM, setRateM] = useState(1.0);
    const [price, setPrice] = useState(0.0);

    const getItem = async () => {
        try {
            const data = await axios.get(`${apiUrl}/item/${id}`)
            setItem(data.data)
            return data.data
        } catch (error) {
            console.log(error);
            toast.error('Error fetching item')
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
        getRates()
        getItem().then((it) => {
            calculatePrice(it);
        })
    }, [targetCurrency])


    const handleCurrencyChange = (event) => {
        const currency = event.target.value;
        setTargetCurrency(currency);
    };
    const calculatePrice = (it) => {
        const rate = rates[targetCurrency];
        console.log('Rate:', rate);
        setRateM(parseFloat(rate));
        
        const itemPrice = parseFloat(it?.price);
        console.log('Item Price:', itemPrice); 
        
        const pr = parseFloat(rate) * itemPrice;
        console.log('Calculating price  rate = ' + rate + ' price = ' + it.price);
        console.log(pr);
        setPrice(pr);
    };
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex flex-col md:flex-row -mx-4">
                <div className="md:flex-1 px-4">
                    <div x-data="{ image: 1 }" x-cloak>
                        <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4">
                            <div className="h-64 md:h-80 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                                <img src={item?.image || "https://i.pinimg.com/originals/10/b2/f6/10b2f6d95195994fca386842dae53bb2.png"} alt="Product Image" className='h-full' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:flex-1 px-4">
                    <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">{item?.title}</h2>
                    <p className="text-gray-500 text-sm">By <a href="#" className="text-indigo-600 hover:underline">ABC Company</a></p>

                    <div className="flex items-center space-x-4 my-4">
                        <div>
                            <div class="rounded-lg bg-gray-100 flex py-2 px-3">
                                <span class="text-indigo-400 mr-1 mt-1">{targetCurrency}</span>
                                {
                                    <span class="font-bold text-indigo-600 text-3xl">  {price.toFixed(2)}</span>

                                }
                            </div>
                        </div>
                        {/* <select value={targetCurrency} onChange={handleCurrencyChange}>
                            {Object.keys(rates).map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select> */}
                       
                    </div>

                    <p className="text-gray-500">{item?.desc}</p>

                    {/* Add to Cart button */}
                    {userRole === 'customer' && (
                        <div className="flex py-4 space-x-4">
                            <button onClick={()=>addItemToCart(item)}>
                                <button
                                    type="button"
                                    className="h-14 px-6 py-2 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                                >
                                    Add to Cart
                                </button>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

