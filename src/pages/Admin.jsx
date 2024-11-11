import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddDates from "../components/admin/AddDates";
import BookedCalendar from "../components/admin/BookedCalendar";
import BookedTimes from "../components/admin/BookedTimes";
import { format } from "date-fns";

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

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetch("https://api-mongo-db-pi2.onrender.com/appointments")
      .then((response) => response.json())
      .then((data) => setAppointments(data));
  }, []);

  useEffect(() => {
    setSelectedTime(null);
    setSelectedAppointment(null);
  }, [selectedDate]);

  useEffect(() => {
    if (activeComponent !== "details") {
      setSelectedDate(null);
    }
  }, [activeComponent]);

  function showAppointment(time, _) {
    setSelectedTime(time);
    
    const appointment = appointments.find((apt) => apt.appointment_time === time);
    setSelectedAppointment(appointment);

    setActiveComponent("details");
  }

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
              <BookedTimes
                selectedDate={selectedDate}
                onTimeSelect={showAppointment}
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

      {activeComponent === "details" && (
        <div>
          <h2>Resumo do agendamento:</h2>
          <p>
            <strong>Motivo da Consulta:</strong> {selectedAppointment.reason}
          </p>
          <p>
            <strong>Observações:</strong> {selectedAppointment.notes}
          </p>
          <p>
            <strong>Data:</strong>{" "}
            {format(selectedAppointment.appointment_date, "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Horário:</strong> {selectedAppointment.appointment_time}
          </p>
          <p>
            <strong>Cliente:</strong> {selectedAppointment.client_name}
          </p>
          <p>
            <strong>Email:</strong> {selectedAppointment.client_email}
          </p>
          <p>
            <strong>Telefone:</strong> {selectedAppointment.client_phone}
          </p>
          <p>
            <strong>Pet:</strong> {selectedAppointment.pet_name}
          </p>
          <p>
            <strong>Espécie:</strong> {selectedAppointment.pet_species}
          </p>
          <p>
            <strong>Raça:</strong> {selectedAppointment.pet_breed}
          </p>
          <p>
            <strong>Idade:</strong> {selectedAppointment.pet_age}
          </p>

          <button onClick={() => setActiveComponent("view")}>Voltar</button>
        </div>
      )}
    </>
  );
}

export default Admin;
