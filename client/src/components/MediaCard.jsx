import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Favorite } from '@material-ui/icons';
import { IconButton } from '@mui/material';
import { useAuth } from '../pages/common/AuthContext';

export default function MediaCard({ item }) {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = () => {

    navigate(`/itempage/${item._id}`);
  };

  return (
    <Card sx={{ maxWidth: 200, }} onClick={handleCardClick} style={{ cursor: 'pointer' }} className='hover:scale-105 rounded-xl overflow-hidden'>
      <CardMedia
        sx={{ height: 160, width: 200 }}
        image={item?.image || "https://i.pinimg.com/originals/10/b2/f6/10b2f6d95195994fca386842dae53bb2.png"}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item?.title}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          LKR. {item?.price}
        </Typography>
        {/* <Typography variant="caption" color="text.secondary">
          {item.desc}
        </Typography> */}
        {userRole === 'customer' && (
          <div className='text-right'>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
