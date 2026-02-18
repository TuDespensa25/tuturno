// Utility functions for Trickle Database interactions

const TABLE_NAME = 'turnos';

/**
 * Fetch all bookings for a specific date
 */
async function getBookingsByDate(dateStr) {
    try {
        // Since we can't filter server-side easily without advanced API, 
        // we'll fetch all and filter client-side for this MVP. 
        // In a real app with many records, we'd want server-side filtering.
        // For 2026, we assume the dataset is manageable for now.
        
        // Using a limit of 1000 to cover enough grounds. 
        // If data grows, we need pagination logic.
        const response = await trickleListObjects(TABLE_NAME, 1000, true);
        
        if (!response || !response.items) return [];

        return response.items
            .map(item => ({...item.objectData, id: item.objectId}))
            .filter(booking => booking.fecha === dateStr && booking.estado !== 'Cancelado');
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

/**
 * Create a new booking
 */
async function createBooking(bookingData) {
    try {
        const result = await trickleCreateObject(TABLE_NAME, bookingData);
        return result;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

/**
 * Fetch all bookings (for admin)
 */
async function getAllBookings() {
    try {
        const response = await trickleListObjects(TABLE_NAME, 100, true);
        return response.items ? response.items.map(item => ({...item.objectData, id: item.objectId})) : [];
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        return [];
    }
}

/**
 * Update booking status
 */
async function updateBookingStatus(id, newStatus) {
    try {
        const result = await trickleUpdateObject(TABLE_NAME, id, { estado: newStatus });
        return result;
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
}