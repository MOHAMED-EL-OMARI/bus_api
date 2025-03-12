import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tables.css";

const Tables = () => {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const connectionInfo = sessionStorage.getItem("dbConnection");
        if (!connectionInfo) {
            navigate("/");
            return;
        }

        fetchTables();
    }, [navigate]);

    const fetchTables = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/table-info");
            const data = await response.json();

            if (data.tables) {
                setTables(data.tables);
            } else {
                setError(data.message || "Failed to fetch tables");
            }
        } catch (error) {
            setError("Error fetching tables");
        }
    };

    return (
        <div className="tables-container">
            <h2>Database Structure</h2>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="tables-list">
                    {tables.length === 0 ? (
                        <p>No tables found in the database</p>
                    ) : (
                        <div>
                            {tables.map((table, index) => (
                                <div key={index} className="table-info">
                                    <div className="table-scroll">
                                        <table>
                                            <tbody>
                                                <tr className="table-name-row">
                                                    <td colSpan="6">{table.tableName}</td>
                                                </tr>
                                                <tr>
                                                    <th>Column Name</th>
                                                    <th>Type</th>
                                                    <th>Nullable</th>
                                                    <th>Key</th>
                                                    <th>Default</th>
                                                    <th>Extra</th>
                                                </tr>
                                                {table.columns.map((column, colIndex) => (
                                                    <tr key={colIndex}>
                                                        <td>{column.name}</td>
                                                        <td>{column.type}</td>
                                                        <td>{column.nullable}</td>
                                                        <td>{column.key}</td>
                                                        <td>{column.default || 'NULL'}</td>
                                                        <td>{column.extra}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="navigation-buttons">
                <button onClick={() => navigate("/table-data")}>View Table Data</button>
                <button onClick={() => navigate("/")} className="back-button">
                    Back to Connection
                </button>
            </div>
        </div>
    );
};

export default Tables;