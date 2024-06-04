import { AuthProvider } from './pages/common/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/common/Login'
import Signup from './pages/common/Signup'
import NotFound from './pages/common/NotFound'
import Dashboard from './pages/common/Dashboard';
import Guest from './pages/guest/Guest';
import CustomerCart from './pages/customer/Cart';
import Home from './pages/admin/Home';
import StoreItems from './pages/store/Items';
import ItemPage from './pages/store/ItemPage';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import TicketPage from './pages/customer/Tickets';
import Appointments from './pages/customer/Appointments';
import AppointmentsScheduleHome from './pages/scheduleManager/ScheduleHome';
import Tickets from './pages/scheduleManager/Tickets';
import AdminOrders from './pages/admin/Orders';
import Overview from './pages/scheduleManager/Overview';
import DoctorScheduler from './pages/customer/DoctorScheduler';
import CreateSchedule from './pages/scheduleManager/CreateSchedule';
import Feedback from './pages/customer/Feedbacks';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer autoClose={2000} />
      <AuthProvider>

        <Routes>

          {/*Common Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={<NotFound />} />


          {/* Inside dashboard layout */}
          <Route path='/' element={<Dashboard />}>
            <Route path='' element={<Guest />} />

            <Route path='items' element={<StoreItems />} />
            <Route path='itempage/:id' element={<ItemPage />} />


            {/*Admin Routes */}
            <Route path='home' element={<Home />} />
            <Route path='admin' element={<Home />} />
            <Route path='admin/orders' element={<AdminOrders />} />

            {/*Schedule Manager Routes */}
            <Route path='appointments' element={<AppointmentsScheduleHome />} />
            <Route path='tickets' element={<Tickets />} />
            <Route path='overview' element={<Overview />} />
            <Route path='schedule' element={<CreateSchedule />} />
            



            {/*Customer Routes */}
            <Route path='cart' element={<CustomerCart />} />
            <Route path='store' element={<StoreItems />} />
            <Route path='itempage/:id' element={<ItemPage />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='transactions' element={<Orders />} />
            <Route path='ticket' element={<TicketPage />} />
            <Route path='feedback' element={<Feedback />} />
            <Route path='appointment' element={<Appointments />} />
            <Route path='docScheduler' element={<DoctorScheduler />} />




          </Route>
        </Routes>
        {/* <StickyFooter /> */}
      </AuthProvider>
    </BrowserRouter>
  )
}