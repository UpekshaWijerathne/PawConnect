import { BrowserRouter, Routes, Route } from "react-router-dom";
import PetList from "./components/PetList";
import PetDetails from "./components/PetDetails";
import Login from "./components/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/" element={<PetList />} />

                <Route
                    path="/pets/:id"
                    element={<PetDetails />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;