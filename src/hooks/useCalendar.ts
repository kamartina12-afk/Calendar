import { useState, useMemo } from 'react';      
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';
import { ViewMode } from '../types/event';

export const useCalendar = () => {
 const today = new Date();
 const [month, setMonth] = useState(today.getMonth());
 const [year, setYear] = useState(today.getFullYear());
 const [selectedDate, setSelectedDate] = useState<Date>(today);
 const [viewMode, setViewMode] = useState<ViewMode>('month');

 const daysInMonth = useMemo(() => getDaysInMonth(month, year), [month, year]);
 const firstdayOffset = useMemo(() => getFirstDayOfMonth(month, year), [month, year]);

 const goToNextMonth = () => {
    if (month === 11) {
        setMonth(0);
        setYear(prev => prev + 1);
    } else {
        setMonth(prev => prev + 1);
    }   
 };

 const goToPreviousMonth = () => {
    if (month === 0) {
        setMonth(11);
        setYear(prev => prev - 1);
    } else {
        setMonth(prev => prev - 1);
    }
 };

 const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
    setMonth(nextDay.getMonth());
    setYear(nextDay.getFullYear());
 };

 const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
    setMonth(prevDay.getMonth());
    setYear(prevDay.getFullYear());
 };

 const selectDate = (date: Date) => {
    setSelectedDate(date);
    setMonth(date.getMonth());
    setYear(date.getFullYear());
 };

 const toggleViewMode = () => {
    setViewMode(prev => prev === 'month' ? 'day' : 'month');
 };

 return {
    month,
    year,
    daysInMonth,
    firstdayOffset,
    selectedDate,
    viewMode,
    today,
    selectDate,
    setViewMode,
    toggleViewMode,
    goToNextMonth,
    goToPreviousMonth,
    goToNextDay,
    goToPreviousDay,
 }; 
};