import mongoose from "mongoose";

const validateAppointmentsLength = function (appointments) {
    return appointments.length === 4;
};

var scSchema = new mongoose.Schema({
    dateFrom: {
        type: Date,
        required: true,
    },
    dateTo: {
        type: Date,
        required: true,
    },
    appointments: {
        slotOne: [
            {
                status: {
                    type: String,
                    default: 'available',
                    enum: ['available', 'booked']
                },
            }
        ],
        slotTwo: [
            {
                status: {
                    type: String,
                    default: 'available',
                    enum: ['available', 'booked']
                },
            }
        ],
        slotThree: [
            {
                status: {
                    type: String,
                    default: 'available',
                    enum: ['available', 'booked']
                },
            }
        ],
        slotFour: [
            {
                status: {
                    type: String,
                    default: 'available',
                    enum: ['available', 'booked']
                },
            }
        ]
    }
});

const ScheduleModel = mongoose.model('Schedule', scSchema);
export default ScheduleModel