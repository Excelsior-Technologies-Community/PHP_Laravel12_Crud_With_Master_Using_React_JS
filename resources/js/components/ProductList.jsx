import React, { useEffect, useState } from "react";
import axios from "axios";
import BarcodeModal from "./BarcodeModal";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const [category, setCategory] = useState("");

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState([]);

    // Modal States
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCsvModal, setShowCsvModal] = useState(false);
    const [selectedBarcodeProduct, setSelectedBarcodeProduct] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        price: "",
        stock: "",
        category_id: "",
        description: ""
    });
    const [newCategoryName, setNewCategoryName] = useState("");
    const [csvFile, setCsvFile] = useState(null);

    // Dynamic Variant Matrix Rows State
    const [variants, setVariants] = useState([
        { size: "M", color: "Black", price: "", stock: "" }
    ]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, sort, category]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/api/products", {
                params: { search, sort, category }
            });
            setProducts(response.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories");
            setCategories(response.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(products.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Bulk Actions
    const executeBulkAction = async (action, extraData = {}) => {
        if (selectedIds.length === 0) {
            alert("Please select at least one product.");
            return;
        }
        if (action === "delete" && !window.confirm(`Delete ${selectedIds.length} selected products?`)) {
            return;
        }

        try {
            await axios.post("/api/products/bulk", {
                action,
                product_ids: selectedIds,
                ...extraData
            });
            setSelectedIds([]);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    // Create / Update Product Submit
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct.id}`, formData);
            } else {
                await axios.post("/api/products", formData);
            }
            setShowProductModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert("Error saving product. Please check form values.");
        }
    };

    // Inline Master Add Category Submit
    const handleInlineCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const res = await axios.post("/api/categories", { name: newCategoryName });
            const newCat = res.data.data;
            setCategories([...categories, newCat]);
            setFormData({ ...formData, category_id: newCat.id });
            setNewCategoryName("");
            setShowCategoryModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    // CSV Import Submit
    const handleCsvImportSubmit = async (e) => {
        e.preventDefault();
        if (!csvFile) return;
        const uploadData = new FormData();
        uploadData.append("file", csvFile);

        try {
            const res = await axios.post("/api/products/import-csv", uploadData);
            alert(res.data.message || "CSV Imported!");
            setShowCsvModal(false);
            setCsvFile(null);
            fetchProducts();
        } catch (error) {
            alert("CSV Import failed.");
        }
    };

    const openEditModal = (p) => {
        setEditingProduct(p);
        setFormData({
            name: p.name,
            sku: p.sku || "",
            price: p.price,
            stock: p.stock,
            category_id: p.category_id,
            description: p.description || ""
        });
        setShowProductModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            sku: "",
            price: "",
            stock: "",
            category_id: categories.length > 0 ? categories[0].id : "",
            description: ""
        });
    };

    // Variant Row Management
    const addVariantRow = () => {
        setVariants([...variants, { size: "L", color: "Blue", price: formData.price, stock: "10" }]);
    };
    const removeVariantRow = (idx) => {
        setVariants(variants.filter((_, i) => i !== idx));
    };

    // CSV Export
    const exportToCsv = () => {
        const headers = ["ID", "SKU", "Name", "Price", "Stock", "Category", "Status"];
        const rows = products.map(p => [
            p.id,
            p.sku || "",
            `"${p.name}"`,
            p.price,
            p.stock,
            `"${p.category ? p.category.name : ''}"`,
            p.inventory_status
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "products_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="fw-bold m-0 text-primary">
                    <i className="fa-solid fa-boxes-stacked me-2"></i>Product Master & Variant Studio
                </h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-3 fw-bold" onClick={() => { resetForm(); setShowProductModal(true); }}>
                        <i className="fa-solid fa-plus me-1"></i> Add Product
                    </button>
                    <button className="btn btn-outline-success rounded-pill px-3" onClick={() => setShowCsvModal(true)}>
                        <i className="fa-solid fa-file-import me-1"></i> Bulk CSV Import
                    </button>
                    <button className="btn btn-outline-dark rounded-pill px-3" onClick={exportToCsv}>
                        <i className="fa-solid fa-file-csv me-1"></i> Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 p-3 bg-light">
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-white"><i className="fa-solid fa-magnifying-glass"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, SKU, price..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="latest">Sort: Latest Added</option>
                            <option value="price_low">Sort: Price Low to High</option>
                            <option value="price_high">Sort: Price High to Low</option>
                            <option value="stock">Sort: Highest Stock</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Filter: All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="alert alert-primary rounded-4 d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold"><i className="fa-solid fa-check-double me-2"></i>{selectedIds.length} Products Selected</span>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success rounded-pill" onClick={() => executeBulkAction("replenish_stock")}>
                            +10 Stock Replenish
                        </button>
                        <button className="btn btn-sm btn-danger rounded-pill" onClick={() => executeBulkAction("delete")}>
                            Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Product Table */}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: "40px" }}>
                                    <input type="checkbox" className="form-check-input" onChange={handleSelectAll} checked={selectedIds.length === products.length && products.length > 0} />
                                </th>
                                <th>SKU</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <input type="checkbox" className="form-check-input" checked={selectedIds.includes(p.id)} onChange={() => handleSelectOne(p.id)} />
                                        </td>
                                        <td><span className="badge bg-light text-dark font-monospace border">{p.sku || "PRD-" + p.id}</span></td>
                                        <td className="fw-bold text-dark">{p.name}</td>
                                        <td className="fw-semibold text-success">₹ {p.price}</td>
                                        <td>{p.stock} pcs</td>
                                        <td><span className="badge bg-info text-dark">{p.category ? p.category.name : "-"}</span></td>
                                        <td>
                                            <span className={`badge ${p.stock === 0 ? 'bg-danger' : p.stock <= 10 ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                {p.inventory_status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-primary me-1 rounded-pill" onClick={() => openEditModal(p)}>
                                                <i className="fa-solid fa-pen me-1"></i> Edit
                                            </button>
                                            <button className="btn btn-sm btn-outline-dark me-1 rounded-pill" onClick={() => setSelectedBarcodeProduct(p)}>
                                                <i className="fa-solid fa-barcode me-1"></i> Barcode
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => executeBulkAction("delete", { product_ids: [p.id] })}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">No products found matching criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PRODUCT ADD/EDIT MODAL */}
            {showProductModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold">
                                    {editingProduct ? "Edit Product" : "Add New Product & Variant Matrix"}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowProductModal(false)}></button>
                            </div>
                            <form onSubmit={handleProductSubmit}>
                                <div className="modal-body p-4">
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-8">
                                            <label className="form-label fw-semibold">Product Name</label>
                                            <input type="text" class="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">SKU (Auto-Generated if Empty)</label>
                                            <input type="text" class="form-control font-monospace" placeholder="PRD-00001" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Price (₹)</label>
                                            <input type="number" step="0.01" class="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Initial Stock Quantity</label>
                                            <input type="number" class="form-control" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <label className="form-label fw-semibold mb-0">Master Category</label>
                                                <button type="button" className="btn btn-link p-0 text-primary small fw-bold" onClick={() => setShowCategoryModal(true)}>
                                                    + Add Category
                                                </button>
                                            </div>
                                            <select class="form-select" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} required>
                                                <option value="">Select Category</option>
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dynamic Variant Matrix Box */}
                                    <div className="p-3 bg-light rounded-4 border mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold text-primary small"><i className="fa-solid fa-diagram-project me-1"></i>Dynamic Product Variant Matrix</span>
                                            <button type="button" className="btn btn-sm btn-outline-primary rounded-pill py-0" onClick={addVariantRow}>
                                                + Add Variant Row
                                            </button>
                                        </div>
                                        {variants.map((v, i) => (
                                            <div key={i} className="row g-2 align-items-center mb-2">
                                                <div className="col-3"><input type="text" className="form-control form-control-sm" placeholder="Size (e.g. L)" value={v.size} onChange={(e) => { const newV = [...variants]; newV[i].size = e.target.value; setVariants(newV); }} /></div>
                                                <div className="col-3"><input type="text" className="form-control form-control-sm" placeholder="Color (e.g. Red)" value={v.color} onChange={(e) => { const newV = [...variants]; newV[i].color = e.target.value; setVariants(newV); }} /></div>
                                                <div className="col-3"><input type="number" className="form-control form-control-sm" placeholder="Price" value={v.price} onChange={(e) => { const newV = [...variants]; newV[i].price = e.target.value; setVariants(newV); }} /></div>
                                                <div className="col-2"><input type="number" className="form-control form-control-sm" placeholder="Stock" value={v.stock} onChange={(e) => { const newV = [...variants]; newV[i].stock = e.target.value; setVariants(newV); }} /></div>
                                                <div className="col-1"><button type="button" className="btn btn-sm btn-outline-danger py-0" onClick={() => removeVariantRow(i)}>&times;</button></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowProductModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary rounded-pill fw-bold px-4">Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* INLINE MASTER ADD CATEGORY MODAL */}
            {showCategoryModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <div className="modal-header bg-dark text-white py-3">
                                <h5 className="modal-title fw-bold"><i className="fa-solid fa-folder-plus me-2 text-warning"></i>Inline Master Category Creator</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCategoryModal(false)}></button>
                            </div>
                            <form onSubmit={handleInlineCategorySubmit}>
                                <div className="modal-body p-4">
                                    <label className="form-label fw-semibold">New Category Name</label>
                                    <input type="text" className="form-control" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Smart Wearables" required />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-warning rounded-pill fw-bold px-4">Create Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* BULK CSV IMPORT MODAL */}
            {showCsvModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow">
                            <div className="modal-header bg-success text-white py-3">
                                <h5 className="modal-title fw-bold"><i className="fa-solid fa-file-csv me-2"></i>Bulk CSV Data Import Studio</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCsvModal(false)}></button>
                            </div>
                            <form onSubmit={handleCsvImportSubmit}>
                                <div className="modal-body p-4">
                                    <label className="form-label fw-semibold">Select CSV File</label>
                                    <input type="file" className="form-control mb-3" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} required />
                                    <small className="text-muted">CSV Format: Name, Price, Stock, Category_ID, Description</small>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowCsvModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success rounded-pill fw-bold px-4">Import CSV Products</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* BARCODE STICKER MODAL */}
            {selectedBarcodeProduct && (
                <BarcodeModal product={selectedBarcodeProduct} onClose={() => setSelectedBarcodeProduct(null)} />
            )}
        </div>
    );
}

export default ProductList;