import React, { useEffect, useState } from "react";
import axios from "axios";

function InventoryAnalytics() {
    const [valuations, setValuations] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [valRes, logRes, lowRes] = await Promise.all([
                axios.get("/api/categories/valuation"),
                axios.get("/api/inventory/audit-logs"),
                axios.get("/api/products-low-stock")
            ]);
            setValuations(valRes.data.data || []);
            setAuditLogs(logRes.data.data || []);
            setLowStockProducts(lowRes.data.data || []);
        } catch (error) {
            console.error("Error fetching inventory analytics:", error);
        }
    };

    const replenishStock = async (productId) => {
        try {
            await axios.post("/api/products/bulk", {
                action: "replenish_stock",
                product_ids: [productId],
                add_qty: 15
            });
            fetchAnalytics();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                    <i className="fa-solid fa-chart-line me-2 text-warning"></i>
                    Inventory Analytics & Audit Trail Watchdog
                </h5>
                <button className="btn btn-sm btn-outline-light rounded-pill" onClick={fetchAnalytics}>
                    <i className="fa-solid fa-rotate me-1"></i> Refresh Data
                </button>
            </div>

            <div className="card-body p-4">
                {/* Low Stock Radar Box */}
                {lowStockProducts.length > 0 && (
                    <div class="alert alert-danger rounded-4 border-danger border-2 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0 text-danger">
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                Low-Stock Radar Watchdog ({lowStockProducts.length} Items Below Threshold)
                            </h6>
                            <span className="badge bg-danger">Critical Alert</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {lowStockProducts.map(p => (
                                <div key={p.id} className="bg-white p-2 rounded-3 border d-flex align-items-center gap-2 shadow-sm">
                                    <span className="fw-semibold text-dark">{p.name}</span>
                                    <span className="badge bg-danger">{p.stock} left</span>
                                    <button className="btn btn-sm btn-success py-0 px-2 rounded-pill" onClick={() => replenishStock(p.id)}>
                                        +15 Replenish
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="row g-4 mb-4">
                    {/* Category Asset Valuation Grid */}
                    <div className="col-lg-6">
                        <div className="border rounded-4 p-3 bg-light h-100">
                            <h6 className="fw-bold text-primary mb-3">
                                <i className="fa-solid fa-tags me-2"></i>Category Asset Valuation
                            </h6>
                            <div className="table-responsive">
                                <table className="table table-sm table-hover align-middle mb-0">
                                    <thead className="table-secondary">
                                        <tr>
                                            <th>Category</th>
                                            <th>Products</th>
                                            <th>Total Stock</th>
                                            <th>Asset Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {valuations.map(val => (
                                            <tr key={val.category_id}>
                                                <td className="fw-semibold">{val.category_name}</td>
                                                <td><span className="badge bg-info text-dark">{val.product_count}</span></td>
                                                <td>{val.total_stock} pcs</td>
                                                <td className="fw-bold text-success">₹ {val.asset_value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Movement Audit Logs */}
                    <div className="col-lg-6">
                        <div className="border rounded-4 p-3 bg-light h-100">
                            <h6 className="fw-bold text-primary mb-3">
                                <i className="fa-solid fa-list-check me-2"></i>Inventory Audit Logs
                            </h6>
                            <div className="table-responsive" style={{ maxHeight: "250px", overflowY: "auto" }}>
                                <table className="table table-sm align-middle mb-0">
                                    <thead className="table-secondary">
                                        <tr>
                                            <th>Product</th>
                                            <th>Type</th>
                                            <th>Old → New</th>
                                            <th>Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map(log => (
                                            <tr key={log.id}>
                                                <td className="fw-semibold text-truncate" style={{ maxWidth: "120px" }}>
                                                    {log.product ? log.product.name : "Product #" + log.product_id}
                                                </td>
                                                <td>
                                                    <span className={`badge ${log.change_type === 'stock_in' ? 'bg-success' : log.change_type === 'stock_out' ? 'bg-danger' : 'bg-primary'}`}>
                                                        {log.change_type}
                                                    </span>
                                                </td>
                                                <td className="font-monospace small">{log.old_stock} → {log.new_stock}</td>
                                                <td className="small text-muted">{log.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InventoryAnalytics;
