import express from 'express'
import { loginValidator } from '../middlewares/loginValidator.js';
import { createSchedule, deleteScheduleById, getAllSchedules, getScheduleById, getScheduleThisWeek, updateScheduleById } from '../controllers/scheduleController.js';
const schRoutes = express.Router();

schRoutes.get('/',getAllSchedules)
schRoutes.get('/current',getScheduleThisWeek)
schRoutes.get('/:id',getScheduleById)

schRoutes.post('/', createSchedule)
schRoutes.put('/:id', updateScheduleById);
schRoutes.delete('/:id',deleteScheduleById);



export default schRoutes;