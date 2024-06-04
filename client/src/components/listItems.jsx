import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';
import { Fastfood, Home, LocalBar, ShoppingCart, Store, StoreMallDirectory, Whatshot } from '@material-ui/icons';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { ManageAccounts, Newspaper, ShoppingBag } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ViewListIcon from '@mui/icons-material/ViewList';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AppsIcon from '@mui/icons-material/Apps';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AodIcon from '@mui/icons-material/Aod';

const white = '#FFFFFF';

export const adminListItems = (
  <React.Fragment>
    <Link to={'/admin'}>
      <ListItemButton>
        <ListItemIcon sx={{ color: white }}>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" sx={{ color: white }} />
      </ListItemButton>
    </Link>

    <Link to={'/admin/orders'}>
      <ListItemButton>
        <ListItemIcon sx={{ color: white }}>
          <ListAltIcon/>
        </ListItemIcon>
        <ListItemText primary="Orders" sx={{ color: white }} />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const customerListItems = (
  <React.Fragment>
  <Link to={'/items'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <ViewListIcon />
      </ListItemIcon>
      <ListItemText primary="Items" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  
  <Link to={'/transactions'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <ShoppingBag />
      </ListItemIcon>
      <ListItemText primary="My Transactions" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  <Link to={'/cart'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <ShoppingCart />
      </ListItemIcon>
      <ListItemText primary="Cart" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  <Link to={'/ticket'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <ChatIcon />
      </ListItemIcon>
      <ListItemText primary="Ticket" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  <Link to={'/feedback'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <AodIcon />
      </ListItemIcon>
      <ListItemText primary="Feedback" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  <Link to={'/appointment'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <EventAvailableIcon />
      </ListItemIcon>
      <ListItemText primary="Appointments" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  <Link to={'/docScheduler'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <CalendarMonthIcon />
      </ListItemIcon>
      <ListItemText primary="Vet Schedule" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  
  </React.Fragment>
);


export const guestListItems = (
  <React.Fragment>
  <Link to={'/'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <Home />
      </ListItemIcon>
      <ListItemText primary="Home" sx={{ color: white }} />
    </ListItemButton>
  </Link>

  </React.Fragment>
);


export const scheduleManagerListItems = (
  <React.Fragment>
  

  <Link to={'/appointments'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <EventAvailableIcon />
      </ListItemIcon>
      <ListItemText primary="Appointments" sx={{ color: white }} />
    </ListItemButton>
  </Link>


  <Link to={'/schedule'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <CalendarMonthIcon />
      </ListItemIcon>
      <ListItemText primary="Schedule" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  
  </React.Fragment>
);

export const customerServiceManagerListItems = (
  <React.Fragment>
  

  <Link to={'/tickets'}>
    <ListItemButton>
      <ListItemIcon sx={{ color: white }}>
        <ChatIcon />
      </ListItemIcon>
      <ListItemText primary="Tickets" sx={{ color: white }} />
    </ListItemButton>
  </Link>
  
  </React.Fragment>
);
