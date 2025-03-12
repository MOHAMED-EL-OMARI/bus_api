import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TableData.css";

const TableData = () => {
    const [tablesData, setTablesData] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const connectionInfo = sessionStorage.getItem("dbConnection");
        if (!connectionInfo) {
            navigate("/");
            return;
        }

        fetchTableData();
    }, [navigate]);

    const fetchTableData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/table-data"
            );
            const data = await response.json();

            if (data.tablesData) {
                setTablesData(data.tablesData);
            } else {
                setError(data.message || "Failed to fetch table data");
            }
        } catch (error) {
            setError("Error fetching table data");
        }
    };

    return (
        <div className="table-data-container">
            <h2>Database Tables Data</h2>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="tables-data-list">
                    {tablesData.length === 0 ? (
                        <p>No tables found in the database</p>
                    ) : (
                        tablesData.map((table, index) => (
                            <div key={index} className="table-section">
                                <div className="table-scroll">
                                    <table>
                                        <tbody>
                                            <tr className="table-name-row">
                                                <td
                                                    colSpan={
                                                        table.columns.length
                                                    }
                                                >
                                                    {table.tableName}
                                                </td>
                                            </tr>
                                            <tr>
                                                {table.columns.map(
                                                    (column, colIndex) => (
                                                        <th key={colIndex}>
                                                            {column.name}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                            {table.data.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {table.columns.map(
                                                        (column, colIndex) => (
                                                            <td key={colIndex}>
                                                                {row[
                                                                    column.name
                                                                ] !== null
                                                                    ? row[
                                                                          column
                                                                              .name
                                                                      ].toString()
                                                                    : "NULL"}
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <div className="navigation-buttons">
                <button onClick={() => navigate("/tables")}>
                    Back to Tables Structure
                </button>
                <button onClick={() => navigate("/")}>
                    Back to Connection
                </button>
            </div>
        </div>
    );
};

export default TableData;
