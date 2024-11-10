import React, { useState, useEffect } from "react";
import MaskedInput from "react-text-mask";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  color: #fff;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  width: 100%;
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
  text-align: left; /* Align label text to the left */
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #fff;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: #fff;
  box-sizing: border-box;
`;

const ClientForm = ({
  clientData,
  setClientData,
  advanceStage,
  RetrieveStage,
}) => {

  function handleChange(event) {
    const { name, value } = event.target;
    setClientData({ ...clientData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setClientData(clientData);
    advanceStage();
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormTitle>Dados da consulta</FormTitle>
        <FormGrid>
          <div>
            <FormField>
              <Label htmlFor="reason">Motivo da Consulta:</Label>
              <Select
                id="reason"
                name="reason"
                value={clientData.reason}
                onChange={handleChange}
                required
              >
                <option value="Checkup">Checkup</option>
                <option value="Vacinação">Vacinação</option>
                <option value="Banho e Tosa">Banho e Tosa</option>
                <option value="Outro">Outro</option>
              </Select>
            </FormField>
          </div>
          <div>
            <FormField>
              <Label htmlFor="notes">Observações:</Label>
              <Input
                type="text"
                id="notes"
                name="notes"
                value={clientData.notes}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </FormGrid>

        <FormTitle>Dados do Cliente e Pet</FormTitle>
        <FormGrid>
          <div>
            <FormField>
              <Label htmlFor="clientEmail">Email:</Label>
              <Input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={clientData.clientEmail}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField>
              <Label htmlFor="clientName">Nome do Cliente:</Label>
              <Input
                type="text"
                id="clientName"
                name="clientName"
                value={clientData.clientName}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField>
              <Label htmlFor="clientPhone">Telefone:</Label>
              <MaskedInput
                mask={[
                  "(",
                  /[1-9]/,
                  /\d/,
                  ")",
                  " ",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  "-",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
                value={clientData.clientPhone}
                onChange={handleChange}
                render={(ref, props) => (
                  <Input
                    ref={ref}
                    type="tel"
                    id="clientPhone"
                    name="clientPhone"
                    {...props}
                    required
                  />
                )}
              />
            </FormField>
          </div>
          <div>
            <FormField>
              <Label htmlFor="petName">Nome do Pet:</Label>
              <Input
                type="text"
                id="petName"
                name="petName"
                value={clientData.petName}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <Label htmlFor="petSpecies">Espécie:</Label>
              <Input
                type="text"
                id="petSpecies"
                name="petSpecies"
                value={clientData.petSpecies}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <Label htmlFor="petBreed">Raça:</Label>
              <Input
                type="text"
                id="petBreed"
                name="petBreed"
                value={clientData.petBreed}
                onChange={handleChange}
                required
              />
            </FormField>
            <FormField>
              <Label htmlFor="petAge">Idade:</Label>
              <Input
                type="number"
                id="petAge"
                name="petAge"
                value={clientData.petAge}
                onChange={handleChange}
                required
              />
            </FormField>
          </div>
        </FormGrid>

        <button onClick={RetrieveStage}>Voltar</button>
        <button type="submit">Avançar</button>
      </form>
    </FormContainer>
  );
};

export default ClientForm;
