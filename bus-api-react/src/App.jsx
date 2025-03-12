import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DatabaseConnection from "./components/DatabaseConnection";
import Tables from "./components/Tables";
import TableData from "./components/TableData";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DatabaseConnection />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/table-data" element={<TableData />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
