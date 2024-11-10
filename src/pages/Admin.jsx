import React, { useState } from "react";
import styled from "styled-components";
import AddDates from "../components/admin/AddDates";
import BookedCalendar from "../components/admin/BookedCalendar";
import AvailableTimes from "../components/agendamento/AvailableTimes";


const ButtonLink = styled.button`
  background: none;
  color: #4caf50;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px;
  text-decoration: underline;

  &:hover {
    color: #45a049;
  }
`;

const DoubleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  min-height: 500px;
  justify-items: center;
`;

const HalfWidthContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

function Admin() {
  const [activeComponent, setActiveComponent] = useState("view");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <>
      <h1>Administração de agendamentos</h1>

      <nav>
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <li>
            <ButtonLink onClick={() => setActiveComponent("view")}>
              Visualizar consultas
            </ButtonLink>
          </li>
          <li>
            <ButtonLink onClick={() => setActiveComponent("add")}>
              Adicionar datas
            </ButtonLink>
          </li>
        </ul>
      </nav>

      {activeComponent === "view" && (
        <>
          <DoubleContainer>
            <HalfWidthContainer>
              <BookedCalendar
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </HalfWidthContainer>
            <HalfWidthContainer>
              <AvailableTimes
                selectedDate={selectedDate}
                onTimeSelect={setSelectedTime}
                selectedTime={selectedTime}
              />
            </HalfWidthContainer>
          </DoubleContainer>
        </>
      )}

      {activeComponent === "add" && (
        <>
          <AddDates />
        </>
      )}
    </>
  );
}

export default Admin;
