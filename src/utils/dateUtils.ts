export const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month +1, 0).getDate();
}

export const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
}

export const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export const formatDayMonth = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
}

export const isDayToday = (day: number, month: number, year: number, today: Date): boolean => {
    return isSameDay(new Date(year, month, day), today);
}

export const isDaySelected = (day: number, month: number, year: number, selectedDate: Date): boolean => {
    return isSameDay(new Date(year, month, day), selectedDate);
}

export const dayHasEvent = (day: number, month: number, year: number, eventDates: Set<string>): boolean => {
    const dateKey = formatDate(new Date(year, month, day));
    return eventDates.has(dateKey);
}

export const createEventDateSet = (events: Array<{ date: Date }>): Set<string> => {
    return new Set(events.map(event => formatDate(event.date)));
}
