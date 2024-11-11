import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const TimesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimesTitle = styled.h2`
  margin: 10px 0;
`;

const TimeButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  margin: 5px;
  padding: 10px 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  outline: ${({ isselected }) => (isselected ? "3px solid #fff" : "0")};
  &:hover {
    background-color: #45a049;
  }
`;

const TimeList = styled.ul`
  list-style-type: none;
  padding: 10px;
  max-height: 350px;
  min-width: 400px;
  background-color: #1a1a1a;
  border-radius: 8px 0 0 8px;
  overflow-y: auto;
`;

const NoTimesMessage = styled.div`
  margin: 10px 0;
  color: #888;
`;

const AvailableTimes = ({ selectedDate, onTimeSelect, selectedTime }) => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timeIdMap, setTimeIdMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api-mongo-db-pi2.onrender.com/time_slots"
      );
      const data = await response.json();

      const times = data
        .filter((slot) => isSameDay(parseISO(slot.slot_date), selectedDate))
        .filter((slot) => slot.appointment_id)
        .map((slot) => slot.slot_time);

      times.sort((a, b) => {
        const [aHour, aMinute] = a.split(":").map(Number);
        const [bHour, bMinute] = b.split(":").map(Number);
        return aHour - bHour || aMinute - bMinute;
      });

      setAvailableTimes(times);

      const timeIdDictionary = data.reduce((acc, slot) => {
        if (
          isSameDay(parseISO(slot.slot_date), selectedDate) &&
          slot.is_available
        ) {
          acc[slot.slot_time] = slot._id;
        }
        return acc;
      }, {});
      setTimeIdMap(timeIdDictionary);
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  return (
    <TimesContainer>
      <TimesTitle>
        {selectedDate
          ? `Horários Disponíveis para ${format(selectedDate, "dd/MM/yyyy", {
              locale: ptBR,
            })}`
          : "Selecione uma data para ver os horários disponíveis"}
      </TimesTitle>
      {selectedDate &&
        (availableTimes.length > 0 ? (
          <TimeList>
            {availableTimes.map((time, index) => (
              <li key={index}>
                <TimeButton
                  isselected={selectedTime === time}
                  onClick={() => onTimeSelect(time, timeIdMap[time])}
                >
                  {time}
                </TimeButton>
              </li>
            ))}
          </TimeList>
        ) : (
          <NoTimesMessage>Nenhum horário disponível</NoTimesMessage>
        ))}
    </TimesContainer>
  );
};

export default AvailableTimes;
