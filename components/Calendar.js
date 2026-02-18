function Calendar({ onDateSelect, selectedDate }) {
    const [currentDate, setCurrentDate] = React.useState(new Date(2026, 0, 1)); // Start at Jan 2026

    // Navigation
    const nextMonth = () => {
        const next = new Date(currentDate);
        next.setMonth(currentDate.getMonth() + 1);
        if (next.getFullYear() === 2026) setCurrentDate(next);
    };

    const prevMonth = () => {
        const prev = new Date(currentDate);
        prev.setMonth(currentDate.getMonth() - 1);
        if (prev.getFullYear() === 2026) setCurrentDate(prev);
    };

    // Generate days
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun
    
    // Adjust for Monday start (0=Mon, 6=Sun) if preferred, but standard JS 0=Sun is fine if we label columns correctly.
    // Let's use standard Sun-Sat grid but disable Sundays.
    
    const days = [];
    // Padding
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const formatDate = (date) => {
        if (!date) return '';
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const isSelected = (date) => {
        return date && selectedDate === formatDate(date);
    };

    const isSunday = (date) => {
        return date && date.getDay() === 0;
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="icon-calendar text-pink-500"></div>
                2. Seleccioná una fecha
            </h2>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
                    <button onClick={prevMonth} disabled={currentDate.getMonth() === 0} className="p-2 hover:bg-white rounded-full transition-colors disabled:opacity-30 text-gray-600">
                        <div className="icon-chevron-left"></div>
                    </button>
                    <span className="font-bold text-gray-800 text-lg capitalize">
                        {monthNames[currentDate.getMonth()]} 2026
                    </span>
                    <button onClick={nextMonth} disabled={currentDate.getMonth() === 11} className="p-2 hover:bg-white rounded-full transition-colors disabled:opacity-30 text-gray-600">
                        <div className="icon-chevron-right"></div>
                    </button>
                </div>

                {/* Grid */}
                <div className="p-4">
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                            <div key={i} className={`text-xs font-medium py-1 ${d === 'D' ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((date, idx) => {
                            if (!date) return <div key={idx}></div>;
                            
                            const disabled = isSunday(date);
                            const selected = isSelected(date);
                            
                            return (
                                <button
                                    key={idx}
                                    onClick={() => !disabled && onDateSelect(formatDate(date))}
                                    disabled={disabled}
                                    className={`
                                        h-10 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                        ${selected 
                                            ? 'bg-gray-900 text-white shadow-md scale-105' 
                                            : disabled 
                                                ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                                                : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'}
                                    `}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}