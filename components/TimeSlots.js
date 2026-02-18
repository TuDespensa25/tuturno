function TimeSlots({ service, date, onTimeSelect, selectedTime }) {
    const [slots, setSlots] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (!service || !date) return;

        const loadSlots = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Generate base slots
                const baseSlots = generateBaseSlots("09:00", "18:00", service.duration);
                
                // 2. Fetch existing bookings
                const bookings = await getBookingsByDate(date);
                
                // 3. Filter available slots
                const available = filterAvailableSlots(baseSlots, service.duration, bookings);
                
                setSlots(available);
            } catch (err) {
                console.error(err);
                setError("Error al cargar horarios");
            } finally {
                setLoading(false);
            }
        };

        loadSlots();
    }, [service, date]);

    if (!service || !date) return null;

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="icon-clock text-pink-500"></div>
                3. Elegí un horario
            </h2>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            ) : slots.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="icon-calendar-x text-3xl text-gray-400 mb-2 mx-auto"></div>
                    <p className="text-gray-600">No hay horarios disponibles para esta fecha.</p>
                    <p className="text-sm text-gray-400 mt-1">Por favor, seleccioná otro día.</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {slots.map(time => (
                        <button
                            key={time}
                            onClick={() => onTimeSelect(time)}
                            className={`
                                py-2 px-3 rounded-lg text-sm font-semibold transition-all shadow-sm
                                ${selectedTime === time
                                    ? 'bg-green-600 text-white ring-2 ring-green-600 ring-offset-1'
                                    : 'bg-white text-green-700 border border-green-200 hover:bg-green-50 hover:border-green-300'}
                            `}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}