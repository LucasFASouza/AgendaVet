import { Routes, Route, Link } from "react-router-dom";
import Agendamento from "./pages/Agendamento";
import Admin from "./pages/Admin";
import styled from "styled-components";

const AppContainer = styled.div`
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Agendamento />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
