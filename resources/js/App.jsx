import React from "react";
import Dashboard from "./components/Dashboard";
import InventoryAnalytics from "./components/InventoryAnalytics";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";

function App() {
    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container">
                <Dashboard />
                <InventoryAnalytics />
                <ProductList />
                <CategoryList />
            </div>
        </div>
    );
}

export default App;