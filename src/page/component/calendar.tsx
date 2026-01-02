import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangeCalendarItem {
    StartDate: Date | null;
    EndDate: Date | null;
    setStartDate: (value: Date | null) => void;
    setEndDate: (value: Date | null) => void;
}

const DateRangeCalendar = (item: DateRangeCalendarItem) => {
    const { StartDate, setStartDate, EndDate, setEndDate } = item

    const [CurrentMonth, setCurrentMonth] = useState(new Date());
    const [isSelecting, setIsSelecting] = useState(false);

    const listmonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const handleDateClick = (date: Date) => {
        if (!date) return;
        if (isSelecting) {
            if (date < StartDate!) {
                setEndDate(StartDate);
                setStartDate(date);
            } else {
                setEndDate(date);
            }
        } else {
            setIsSelecting(false);
            setStartDate(date);
            setEndDate(null);
            setIsSelecting(true);
        }
    };

    const isDateInRange = (date: Date) => {
        if (!date || !StartDate) return false;
        if (!EndDate) return date.getTime() === StartDate.getTime();
        return date >= StartDate && date <= EndDate;
    };

    useEffect(() => {
        if (StartDate) setCurrentMonth(StartDate);
    }, [StartDate]);

    const isStartDate = (date: Date) => date && StartDate && date.getTime() === StartDate.getTime();
    const isEndDate = (date: Date) => date && EndDate && date.getTime() === EndDate.getTime();
    const previousMonth = () => setCurrentMonth(new Date(CurrentMonth.getFullYear(), CurrentMonth.getMonth() - 1));
    const nextMonth = () => setCurrentMonth(new Date(CurrentMonth.getFullYear(), CurrentMonth.getMonth() + 1));

    const ResetSelection = () => {
        setStartDate(null);
        setEndDate(null);
        setIsSelecting(false);
    };

    const FormatDate = (date?: Date) => {
        if (!date) return '-';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const days = getDaysInMonth(CurrentMonth);

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: 30 }}>
                <h4 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>Select Date Range</h4>
                <div style={{ marginBottom: 30 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Button variant='warning' onClick={previousMonth}><ChevronLeft size={16} /></Button>
                        <h5 style={{ margin: 0, color: '#333' }}>{listmonth[CurrentMonth.getMonth()]} {CurrentMonth.getFullYear()}</h5>
                        <Button variant='warning' onClick={nextMonth}><ChevronRight size={16} /></Button>
                    </div>
                    <div className='calendar-grid'>
                        {daysofweek.map((day, index) => (
                            <div key={index + 1} className='calendar-day-header'>{day}</div>
                        ))}
                        {days.map((date, index) => (
                            <button key={index + 1} className={`buttonnone calendar-day ${date ? 'clickable' : ''} ${isDateInRange(date!) ? 'in-range' : ''} ${isStartDate(date!) || isEndDate(date!) ? 'selected' : ''}`} onClick={() => handleDateClick(date!)}>{date ? date.getDate() : ''}</button>
                        ))}
                    </div>
                </div>
                <div style={{ backgroundColor: '#fff6bf', border: '1px solid #fff3a0', borderRadius: 4, padding: 15, marginBottom: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                        <div>
                            <div style={{ color: '#0c5460' }}><strong style={{ color: '#0c5460' }}>StartDate: </strong> {FormatDate(StartDate!)}</div>
                        </div>
                        <div>
                            <div style={{ color: '#0c5460' }}><strong style={{ color: '#0c5460' }}>EndDate: </strong>{FormatDate(EndDate!)}</div>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Button variant='secondary' onClick={ResetSelection}>Clear Select</Button>
                </div>
            </div>
        </div>
    );
};

export default DateRangeCalendar;