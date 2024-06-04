import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../utils/Constants";

export default function DoctorScheduler() {
    const [appointments, setAppointments] = useState(null);
    const doctor = {
        name: 'Yapa Dissanayake',
        image: 'https://www.shutterstock.com/image-vector/vector-medical-icon-doctor-image-600nw-1170228883.jpg',
        timing: '9.00AM - 5.00PM'
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const timeSlots = [
        "9:00am - 9:30am",
        "9:30am - 10:00am",
        "4:00pm - 4:30pm",
        "4:30pm - 5:00pm",
        // Add more time slots here
    ];

    useEffect(() => {
        const getSchedule = async () => {
            try {
                // Simulated response data with dummy booked slots
                const resp = {
                    data: {
                        dateFrom: "2024-04-16",
                        dateTo: "2024-04-22",
                        slots: [
                            { day: 'Monday', slot: "9:30am - 10:00am" },
                            { day: 'Wednesday', slot: "4:00pm - 4:30pm" },
                            { day: 'Friday', slot: "9:00am - 9:30am" }, // Additional booked slot
                            { day: 'Sunday', slot: "4:30pm - 5:00pm" }   // Additional booked slot
                        ]
                    }
                };

                setAppointments(resp.data);
            } catch (error) {
                console.log(error);
            }
        };

        getSchedule();
    }, []);

    const renderDateRange = () => {
        if (!appointments || isNaN(new Date(appointments.dateFrom).getTime()) || isNaN(new Date(appointments.dateTo).getTime())) {
            return "April 1 - April 7"; // Display default date range if appointments are not available or dates are invalid
        } else {
            return `${new Date(appointments.dateFrom).toDateString()} - ${new Date(appointments.dateTo).toDateString()}`;
        }
    };

    const isSlotBooked = (day, timeSlot) => {
        return appointments && appointments.slots && appointments.slots.some(slot => slot.day === day && slot.slot === timeSlot);
    };

    return (
        <div className="flex items-center flex-col justify-center w-full">
            <div>
                {renderDateRange()}
            </div>
            <div className="flex items-start ml-auto">
                <img src={doctor.image} className="w-32 h-32 rounded-full" alt="" />
                <div className="p-5">
                    <h2 className="text-xl font-bold">{doctor.name}</h2>
                    <p>{doctor.timing}</p>
                </div>
            </div>
            <div className="p-4">
                <h1 className="text-3xl font-bold mb-4 text-center">Vet Schedule</h1>
                <div className="grid grid-cols-8 gap-2">
                    <div className="text-center border p-2"></div>
                    {daysOfWeek.map((day, dayIndex) => (
                        <div key={dayIndex} className="text-center border p-2 font-bold">{day}</div>
                    ))}
                    {timeSlots.map((timeSlot, slotIndex) => (
                        <React.Fragment key={slotIndex}>
                            <div className="text-center col-span-1 border p-2">{timeSlot}</div>
                            {daysOfWeek.map((day, dayIndex) => (
                                <button key={dayIndex} className={`text-center w-full col-span-1 border p-2 ${isSlotBooked(day, timeSlot) ? 'bg-red-100' : 'bg-green-100 hover:bg-green-400'}`}>{isSlotBooked(day, timeSlot) ? 'booked' : 'available'}</button>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
