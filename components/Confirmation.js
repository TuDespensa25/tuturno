function Confirmation({ booking, onReset }) {
    React.useEffect(() => {
        // Construct WhatsApp URL
        const phone = "5354066204";
        const text = `📅 NUEVO TURNO - UÑAS MÁGICAS\n👤 Cliente: ${booking.cliente_nombre}\n💅 Servicio: ${booking.servicio} (${booking.duracion} min)\n📆 Fecha: ${booking.fecha}\n⏰ Hora: ${booking.hora_inicio}`;
        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/${phone}?text=${encodedText}`;
        
        // Open WhatsApp in new tab
        window.open(url, '_blank');
    }, [booking]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <div className="icon-check text-4xl text-green-600"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Turno Reservado!</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Tu cita ha sido agendada correctamente y el dueño ha sido notificado.</p>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 w-full max-w-sm mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                <div className="space-y-4 text-left">
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Nombre</div>
                        <div className="font-medium text-gray-900 text-lg">{booking.cliente_nombre}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Servicio</div>
                        <div className="font-medium text-gray-900">{booking.servicio}</div>
                        <div className="text-sm text-gray-500">{booking.duracion} min</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Fecha</div>
                            <div className="font-medium text-gray-900">{booking.fecha}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Hora</div>
                            <div className="font-medium text-gray-900">{booking.hora_inicio}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg flex items-center justify-center gap-2">
                   <div className="icon-smartphone"></div>
                   Contacto: +53 54066204
                </div>
                
                <button 
                    onClick={onReset}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                    Nueva Reserva
                </button>
            </div>
        </div>
    );
}