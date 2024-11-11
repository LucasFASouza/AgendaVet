import React, { useState, useEffect } from "react";
import BookingCalendar from "../components/agendamento/BookingCalendar";
import AvailableTimes from "../components/agendamento/AvailableTimes";
import ClientForm from "../components/agendamento/ClientForm";
import styled from "styled-components";
import { format, set } from "date-fns";

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

function Agendamento() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlotId, setTimeSlotId] = useState(null);

  const [clientData, setClientData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    petName: "",
    petSpecies: "",
    petBreed: "",
    petAge: "",
    notes: "",
    reason: "Banho e Tosa",
  });

  const [formStage, setFormStage] = useState(1);

  useEffect(() => {
    setSelectedTime(null);
    setTimeSlotId(null);
  }, [selectedDate]);

  function selectTime(time, id) {
    setSelectedTime(time);
    setTimeSlotId(id);
  }

  function advanceStage() {
    console.log(clientData);

    if (formStage === 1 && (!selectedDate || !selectedTime)) {
      alert("Selecione uma data e um horário para continuar.");
      return;
    } else if (formStage === 2 && !clientData.clientName) {
      alert("Preencha o nome do cliente para continuar.");
      return;
    }
    setFormStage(formStage + 1);
  }

  function postAppointment() {
    fetch("https://api-mongo-db-pi2.onrender.com/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointment_date: selectedDate,
        appointment_time: selectedTime,

        client_name: clientData.clientName,
        client_email: clientData.clientEmail,
        client_phone: clientData.clientPhone,

        pet_name: clientData.petName,
        pet_species: clientData.petSpecies,
        pet_breed: clientData.petBreed,
        pet_age: clientData.petAge,

        reason: clientData.reason,
        notes: clientData.notes,

        status: "Scheduled",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(
          "https://api-mongo-db-pi2.onrender.com/time_slots/" + timeSlotId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_available: false,
              appointment_id: data._id,
            }),
          }
        );
      })
      .then(() => {
        alert("Agendamento realizado com sucesso!");
        setFormStage(1);
        setSelectedDate(null);
        setSelectedTime(null);
        setTimeSlotId(null);
        setClientData({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          petName: "",
          petSpecies: "",
          petBreed: "",
          petAge: "",
          reason: "Banho e Tosa",
          notes: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Ocorreu um erro ao realizar o agendamento.");
      });
  }

  return (
    <div>
      <h1>Agendamento Veterinário</h1>

      {formStage === 1 && (
        <>
          <DoubleContainer>
            <HalfWidthContainer>
              <BookingCalendar
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </HalfWidthContainer>
            <HalfWidthContainer>
              <AvailableTimes
                selectedDate={selectedDate}
                onTimeSelect={selectTime}
                selectedTime={selectedTime}
              />
            </HalfWidthContainer>
          </DoubleContainer>

          <button onClick={advanceStage}>Avançar</button>
        </>
      )}

      {formStage === 2 && (
        <ClientForm
          clientData={clientData}
          setClientData={setClientData}
          advanceStage={advanceStage}
          RetrieveStage={() => setFormStage(formStage - 1)}
        />
      )}

      {formStage === 3 && (
        <div>
          <h2>Resumo do agendamento:</h2>
          <p>
            <strong>Motivo da Consulta:</strong> {clientData.reason}
          </p>
          <p>
            <strong>Observações:</strong> {clientData.notes}
          </p>
          <p>
            <strong>Data:</strong> {format(selectedDate, "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Horário:</strong> {selectedTime}
          </p>
          <p>
            <strong>Cliente:</strong> {clientData.clientName}
          </p>
          <p>
            <strong>Email:</strong> {clientData.clientEmail}
          </p>
          <p>
            <strong>Telefone:</strong> {clientData.clientPhone}
          </p>
          <p>
            <strong>Pet:</strong> {clientData.petName}
          </p>
          <p>
            <strong>Espécie:</strong> {clientData.petSpecies}
          </p>
          <p>
            <strong>Raça:</strong> {clientData.petBreed}
          </p>
          <p>
            <strong>Idade:</strong> {clientData.petAge}
          </p>

          <button onClick={() => setFormStage(formStage - 1)}>Voltar</button>

          <button onClick={postAppointment}>Confirmar</button>
        </div>
      )}
    </div>
  );
}

export default Agendamento;
