import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Gallary from "./pages/Gallary";
// import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallary />} />
      </Routes>
    </BrowserRouter>
  );
}
