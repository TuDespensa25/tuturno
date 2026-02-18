// Time manipulation and slot generation logic

// Helper to convert "HH:mm" to minutes since midnight
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Helper to convert minutes since midnight to "HH:mm"
function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Generate all possible start times based on service duration
function generateBaseSlots(startHourStr, endHourStr, durationMinutes) {
    const startMins = timeToMinutes(startHourStr);
    const endMins = timeToMinutes(endHourStr);
    const slots = [];

    // Loop from start time until (end time - duration)
    // We assume slots start every `duration` minutes (as per requirement table), 
    // BUT the requirement table shows a simplified pattern. 
    // Requirement says: "saltando según la duración del servicio seleccionado"
    // 30 min -> 9:00, 9:30, 10:00...
    // 60 min -> 9:00, 10:00, 11:00...
    // 90 min -> 9:00, 10:30, 12:00...
    
    // However, usually flexible booking allows starting at 9:30 for a 60min service if 9:00-9:30 is free?
    // The requirement explicitly gives a table:
    // | 60 min | 9:00, 10:00, 11:00... |
    // | 90 min | 9:00, 10:30, 12:00... |
    // This implies fixed slots based on duration intervals starting from 9:00.
    
    // We will follow the requirement's explicit table logic strictly.
    // Interval = durationMinutes.
    
    for (let current = startMins; current + durationMinutes <= endMins; current += durationMinutes) {
        slots.push(minutesToTime(current));
    }
    
    return slots;
}

// Check if a slot is available considering existing bookings
function filterAvailableSlots(baseSlots, durationMinutes, existingBookings) {
    return baseSlots.filter(slotStartStr => {
        const slotStart = timeToMinutes(slotStartStr);
        const slotEnd = slotStart + durationMinutes;

        // Check against every existing booking
        const hasConflict = existingBookings.some(booking => {
            const bookingStart = timeToMinutes(booking.hora_inicio);
            const bookingEnd = timeToMinutes(booking.hora_fin);

            // Check for Overlap
            // Slot starts before booking ends AND Slot ends after booking starts
            return (slotStart < bookingEnd) && (slotEnd > bookingStart);
        });

        return !hasConflict;
    });
}

function calculateEndTime(startTimeStr, durationMinutes) {
    const startMins = timeToMinutes(startTimeStr);
    return minutesToTime(startMins + durationMinutes);
}