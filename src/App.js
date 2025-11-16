import logo from './logo.svg';
import './App.css';
import CustomCakePage from "./components/pages/CustomCakes/CakePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cake" element={<CustomCakePage />} />
      </Routes>
    </Router>
  );
}

export default App;
