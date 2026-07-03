import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const [stats, setStats] = useState({
        total_products: 0,
        total_categories: 0,
        total_stock: 0,
        low_stock_products: 0,
        inventory_value: 0,
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get("/api/dashboard");
            setStats(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                📊 Inventory Dashboard
            </h2>

            <div className="row">

                <div className="col-md-4 mb-3">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>Total Products</h5>

                            <h2>{stats.total_products}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-3">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>Total Categories</h5>

                            <h2>{stats.total_categories}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-3">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>Total Stock</h5>

                            <h2>{stats.total_stock}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 mb-3">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>Low Stock Products</h5>

                            <h2>{stats.low_stock_products}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 mb-3">

                    <div className="card shadow">

                        <div className="card-body">

                            <h5>Inventory Value</h5>

                            <h2>₹ {stats.inventory_value}</h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Dashboard;