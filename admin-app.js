function AdminApp() {
    const [bookings, setBookings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filterDate, setFilterDate] = React.useState('');

    const fetchBookings = async () => {
        setLoading(true);
        const data = await getAllBookings();
        // Sort by date and time
        data.sort((a, b) => {
            if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
            return a.hora_inicio.localeCompare(b.hora_inicio);
        });
        setBookings(data);
        setLoading(false);
    };

    React.useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        if (!confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;
        
        try {
            await updateBookingStatus(id, newStatus);
            fetchBookings(); // Refresh
        } catch (error) {
            alert('Error al actualizar');
        }
    };

    const filteredBookings = filterDate 
        ? bookings.filter(b => b.fecha === filterDate)
        : bookings;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="icon-shield-check text-blue-600"></div>
                        Panel de Administración
                    </h1>
                    <button onClick={fetchBookings} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <div className="icon-refresh-cw text-gray-600"></div>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="icon-list-filter"></div>
                        Filtrar por fecha:
                    </div>
                    <input 
                        type="date" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    />
                    {filterDate && (
                        <button onClick={() => setFilterDate('')} className="text-sm text-red-500 hover:underline">
                            Limpiar
                        </button>
                    )}
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Fecha/Hora</th>
                                        <th className="p-4 font-semibold">Cliente</th>
                                        <th className="p-4 font-semibold">Servicio</th>
                                        <th className="p-4 font-semibold">Estado</th>
                                        <th className="p-4 font-semibold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredBookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{booking.fecha}</div>
                                                <div className="text-sm text-gray-500">{booking.hora_inicio} - {booking.hora_fin}</div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-900">
                                                {booking.cliente_nombre}
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-900">{booking.servicio}</div>
                                                <div className="text-xs text-gray-500">{booking.duracion} min</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${booking.estado === 'Confirmado' ? 'bg-green-100 text-green-700' : 
                                                      booking.estado === 'Cancelado' ? 'bg-red-100 text-red-700' : 
                                                      'bg-yellow-100 text-yellow-700'}
                                                `}>
                                                    {booking.estado}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                {booking.estado !== 'Confirmado' && booking.estado !== 'Cancelado' && (
                                                    <button 
                                                        onClick={() => handleStatusChange(booking.id, 'Confirmado')}
                                                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                                                        title="Confirmar"
                                                    >
                                                        <div className="icon-check"></div>
                                                    </button>
                                                )}
                                                {booking.estado !== 'Cancelado' && (
                                                    <button 
                                                        onClick={() => handleStatusChange(booking.id, 'Cancelado')}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                        title="Cancelar"
                                                    >
                                                        <div className="icon-x"></div>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                No se encontraron turnos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);