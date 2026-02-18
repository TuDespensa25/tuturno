// utils/api.js - Versión ultra ligera con cache

const SUPABASE_URL = 'https://torwzztbyeryptydytwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcnd6enRieWVyeXB0eWR5dHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODAxNzIsImV4cCI6MjA4Njk1NjE3Mn0.yISCKznhbQt5UAW5lwSuG2A2NUS71GSbirhpa9mMpyI';

const TABLE_NAME = 'turnos';

// Cache en memoria
const cache = {
    bookingsByDate: new Map(), // fecha -> {data, timestamp}
    allBookings: null,
    allBookingsTimestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Fetch all bookings for a specific date (con cache)
 */
async function getBookingsByDate(dateStr) {
    // Verificar si tenemos cache válido
    const cached = cache.bookingsByDate.get(dateStr);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log('🗂️ Usando cache para', dateStr);
        return cached.data;
    }

    try {
        console.log('🌐 Solicitando turnos para', dateStr);
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?fecha=eq.${dateStr}&estado=neq.Cancelado&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) throw new Error('Error fetching bookings');
        
        const data = await response.json();
        
        // Guardar en cache
        cache.bookingsByDate.set(dateStr, {
            data: data,
            timestamp: Date.now()
        });
        
        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        // Si hay error y tenemos cache viejo, lo devolvemos igual
        if (cached) {
            console.log('⚠️ Usando cache viejo por error de red');
            return cached.data;
        }
        return [];
    }
}

/**
 * Create a new booking (sin cache, invalida cache relacionado)
 */
async function createBooking(bookingData) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${TABLE_NAME}`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(bookingData)
            }
        );
        
        if (!response.ok) throw new Error('Error creating booking');
        
        // Limpiar cache de la fecha afectada
        cache.bookingsByDate.delete(bookingData.fecha);
        cache.allBookings = null;
        
        return { success: true };
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

/**
 * Fetch all bookings (for admin) - con cache
 */
async function getAllBookings() {
    // Verificar cache
    if (cache.allBookings && (Date.now() - cache.allBookingsTimestamp) < CACHE_DURATION) {
        return cache.allBookings;
    }

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*&order=fecha.desc,hora_inicio.asc`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );
        
        if (!response.ok) throw new Error('Error fetching all bookings');
        
        const data = await response.json();
        
        // Guardar en cache
        cache.allBookings = data;
        cache.allBookingsTimestamp = Date.now();
        
        return data;
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        return cache.allBookings || [];
    }
}

/**
 * Update booking status (invalida cache)
 */
async function updateBookingStatus(id, newStatus) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?id=eq.${id}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: newStatus })
            }
        );
        
        if (!response.ok) throw new Error('Error updating booking');
        
        // Limpiar todo el cache (porque cambió un estado)
        cache.bookingsByDate.clear();
        cache.allBookings = null;
        
        return { success: true };
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
}