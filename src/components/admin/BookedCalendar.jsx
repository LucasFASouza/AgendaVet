import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  format,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  startOfWeek,
  addDays,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarTitle = styled.h2`
  margin: 10px 0;
`;

const WeekRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const DayButton = styled.button`
  margin: 5px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  &:hover {
    background-color: #fff;
  }
`;

const DayLabel = styled.div`
  flex: 1;
  text-align: center;
  font-weight: bold;
  margin: 5px;
`;

const EmptyDay = styled.div`
  flex: 1;
  margin: 5px;
  padding: 10px;
`;

const BookingCalendar = ({ onDateSelect, selectedDate }) => {
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [interval, setInterval] = useState({ start: null, end: null });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api-mongo-db-pi2.onrender.com/time_slots"
      );
      const data = await response.json();
      const dates = data
        .filter((slot) => slot.appointment_id)
        .map((slot) => parseISO(slot.slot_date));
      setHighlightedDates(dates);

      if (dates.length > 0) {
        const start = dates.reduce(
          (min, date) => (date < min ? date : min),
          dates[0]
        );
        const end = dates.reduce(
          (max, date) => (date > max ? date : max),
          dates[0]
        );
        setInterval({ start, end });
      }
    };

    fetchData();
  }, []);

  if (!interval.start || !interval.end) {
    return <div>Loading...</div>;
  }

  const days = eachDayOfInterval({ start: interval.start, end: interval.end });

  const startDayOfWeek = startOfWeek(interval.start, { locale: ptBR });
  const dayLabels = Array.from({ length: 7 }).map((_, index) =>
    format(addDays(startDayOfWeek, index), "EEEEEE", { locale: ptBR })
  );

  const weeks = [];
  let daysInWeek = Array(getDay(interval.start))
    .fill(null)
    .map((_, index) => <EmptyDay key={`empty-start-${index}`} />);

  days.forEach((day, index) => {
    const isHighlighted = highlightedDates.some((highlightedDate) =>
      isSameDay(day, highlightedDate)
    );

    const isSelected = selectedDate && isSameDay(day, selectedDate);

    const color = isHighlighted ? "#fff" : "#888";
    const backgroundColor = isHighlighted ? "#4CAF50" : "#ddd";
    const outline = isSelected ? "3px solid #ddd" : "none";

    daysInWeek.push(
      <DayButton
        key={index}
        style={{
          color: color,
          backgroundColor: backgroundColor,
          outline: outline,
        }}
        onClick={() => onDateSelect(day)}
      >
        {format(day, "dd/MM")}
      </DayButton>
    );

    if (daysInWeek.length === 7) {
      weeks.push(<WeekRow key={`week-${index}`}>{daysInWeek}</WeekRow>);
      daysInWeek = [];
    }
  });

  if (daysInWeek.length > 0) {
    while (daysInWeek.length < 7) {
      daysInWeek.push(<EmptyDay key={`empty-end-${daysInWeek.length}`} />);
    }
    weeks.push(<WeekRow key="last">{daysInWeek}</WeekRow>);
  }

  return (
    <CalendarContainer>
      <CalendarTitle>Datas disponíveis</CalendarTitle>
      <WeekRow>
        {dayLabels.map((label, index) => (
          <DayLabel key={index}>{label}</DayLabel>
        ))}
      </WeekRow>
      {weeks}
    </CalendarContainer>
  );
};

export default BookingCalendar;
