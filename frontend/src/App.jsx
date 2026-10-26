import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PetList from "./components/PetList";
import PetDetails from "./components/PetDetails";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AdopterDashboard from "./pages/AdopterDashboard";
import ShelterDashboard from "./pages/ShelterDashboard";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public pages */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pets" element={<PetList />} />
                <Route path="/pets/:id" element={<PetDetails />} />

                {/* Adopter dashboard: support both URLs */}
                <Route
                    path="/adopter-dashboard"
                    element={<AdopterDashboard />}
                />
                <Route
                    path="/dashboard"
                    element={<AdopterDashboard />}
                />

                {/* Shelter dashboard */}
                <Route
                    path="/shelter-dashboard"
                    element={<ShelterDashboard />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
