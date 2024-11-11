import React, { useState } from "react";
import styled from "styled-components";
import { format, addMinutes, parse, startOfDay } from "date-fns";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #fff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormField = styled.div`
  margin-bottom: 15px;
  width: 100%;
  padding: 0 10px;
`;

const Label = styled.label`
  display: block;
  margin: 5px;
  color: #fff;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #fff;
  box-sizing: border-box;
`;

const TimeList = styled.ul`
  list-style-type: none;
  padding: 10px;
  max-height: 350px;
  min-width: 400px;
  background-color: #1a1a1a;
  border-radius: 8px;
  overflow-y: auto;
`;

const TimeItem = styled.li`
  margin: 5px;
`;

const TimeButton = styled.label`
  background-color: #4caf50;
  color: #fff;
  margin: 5px;
  padding: 10px 25px;
  border: ${({ isSelected }) => (isSelected ? "3px solid #fff" : "none")};
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #45a049;
  }
`;

const Button = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

const generateTimes = (startTime, endTime, interval) => {
  const times = [];
  let time = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  while (time <= end) {
    times.push(format(time, "HH:mm"));
    time = addMinutes(time, interval);
  }

  return times;
};

const AddDates = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const times = generateTimes("08:00", "18:00", 60);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setSelectedTimes((prevTimes) =>
      prevTimes.includes(time)
        ? prevTimes.filter((t) => t !== time)
        : [...prevTimes, time]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    selectedTimes.sort();

    selectedTimes.forEach((time) => {
      fetch("https://api-mongo-db-pi2.onrender.com/time_slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slot_date: selectedDate,
          slot_time: time,
          is_available: true,
          appointment_id: null,
        }),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error:", error);
          alert("Ocorreu um erro ao adicionar os horários.");
        });
    });

    setSelectedDate("");
    setSelectedTimes([]);

    alert("Horários adicionados com sucesso!");
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="date">Data:</Label>
          <Input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            required
          />
        </FormField>
        <FormField>
          <Label>Horários:</Label>
          <TimeList>
            {times.map((time) => (
              <TimeItem key={time}>
                <TimeButton isSelected={selectedTimes.includes(time)}>
                  <input
                    type="checkbox"
                    value={time}
                    checked={selectedTimes.includes(time)}
                    onChange={handleTimeChange}
                    style={{ display: "none" }}
                  />
                  {time}
                </TimeButton>
              </TimeItem>
            ))}
          </TimeList>
        </FormField>
        <Button type="submit">Adicionar</Button>
      </Form>
    </Container>
  );
};

export default AddDates;
