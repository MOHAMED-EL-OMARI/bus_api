const express = require("express");
const router = express.Router();
const { getConnection } = require("../db"); // Import the getConnection function

// Route to get all table names
router.get("/tables", (req, res) => {
    const connection = getConnection();
    if (!connection) {
        return res.json({ message: "Not connected to any database!" });
    }

    connection.query("SHOW TABLES", (err, results) => {
        if (err) {
            return res.json({ message: "Query error: " + err.message });
        }

        const tables = results.map((row) => Object.values(row)[0]);
        return res.json({ tables }); // Return to prevent further execution
    });
});

// Route to get table structure
router.get("/table-info", (req, res) => {
    const connection = getConnection();
    if (!connection) {
        return res.json({ message: "Not connected to any database!" });
    }

    connection.query("SHOW TABLES", (err, tables) => {
        if (err) {
            return res.json({
                message: "Error fetching tables: " + err.message,
            });
        }

        if (tables.length === 0) {
            return res.json({ tables: [] });
        }

        const tableInfo = [];
        let completedQueries = 0;
        let errorOccurred = false; // Track errors

        tables.forEach((tableRow) => {
            const tableName = Object.values(tableRow)[0];

            connection.query(
                `SHOW COLUMNS FROM ${tableName}`,
                (err, columns) => {
                    if (err) {
                        if (!errorOccurred) {
                            errorOccurred = true;
                            return res.json({
                                message:
                                    "Error fetching columns: " + err.message,
                            });
                        }
                    } else {
                        tableInfo.push({
                            tableName,
                            columns: columns.map((col) => ({
                                name: col.Field,
                                type: col.Type,
                                nullable: col.Null,
                                key: col.Key,
                                default: col.Default,
                                extra: col.Extra,
                            })),
                        });

                        completedQueries++;
                        if (
                            completedQueries === tables.length &&
                            !errorOccurred
                        ) {
                            res.json({ tables: tableInfo });
                        }
                    }
                }
            );
        });
    });
});

// Route to get table data
router.get("/table-data", (req, res) => {
    const connection = getConnection();
    if (!connection) {
        return res.json({ message: "Not connected to any database!" });
    }

    connection.query("SHOW TABLES", (err, tables) => {
        if (err) {
            return res.json({
                message: "Error fetching tables: " + err.message,
            });
        }

        if (tables.length === 0) {
            return res.json({ tablesData: [] });
        }

        const tablesData = [];
        let completedQueries = 0;
        let errorOccurred = false; // Track errors

        tables.forEach((tableRow) => {
            const tableName = Object.values(tableRow)[0];

            connection.query(
                `SHOW COLUMNS FROM ${tableName}`,
                (err, columns) => {
                    if (err) {
                        if (!errorOccurred) {
                            errorOccurred = true;
                            return res.json({
                                message:
                                    "Error fetching columns: " + err.message,
                            });
                        }
                    } else {
                        connection.query(
                            `SELECT * FROM ${tableName}`,
                            (err, data) => {
                                if (err) {
                                    if (!errorOccurred) {
                                        errorOccurred = true;
                                        return res.json({
                                            message:
                                                "Error fetching data: " +
                                                err.message,
                                        });
                                    }
                                } else {
                                    tablesData.push({
                                        tableName,
                                        columns: columns.map((col) => ({
                                            name: col.Field,
                                            type: col.Type,
                                        })),
                                        data: data,
                                    });

                                    completedQueries++;
                                    if (
                                        completedQueries === tables.length &&
                                        !errorOccurred
                                    ) {
                                        res.json({ tablesData });
                                    }
                                }
                            }
                        );
                    }
                }
            );
        });
    });
});

module.exports = router;
