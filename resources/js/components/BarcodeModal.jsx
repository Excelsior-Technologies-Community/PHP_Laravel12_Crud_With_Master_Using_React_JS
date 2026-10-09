import React from "react";

function BarcodeModal({ product, onClose }) {
    if (!product) return null;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(product.sku + ' - ' + product.name)}`;
    const barcodeText = product.sku || ("PRD-" + String(product.id).padStart(5, '0'));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal show d-block tab-index-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border-0 shadow-lg">
                    <div className="modal-header bg-primary text-white py-3">
                        <h5 className="modal-title fw-bold">
                            <i className="fa-solid fa-barcode me-2"></i>
                            SKU Barcode & Sticker Label Printer
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body text-center p-4">
                        <div className="border p-4 rounded-4 bg-white shadow-sm mb-3">
                            <h6 className="fw-bold text-dark mb-1">{product.name}</h6>
                            <p className="text-muted small mb-2">{product.category ? product.category.name : "General"}</p>
                            
                            {/* Barcode Visual Display */}
                            <div className="bg-light p-3 rounded border font-monospace my-3">
                                <div className="fs-3 fw-bold text-dark tracking-wider">
                                    |||| | ||||| ||| || |||| |||
                                </div>
                                <div className="fw-bold text-primary">{barcodeText}</div>
                            </div>

                            {/* QR Code */}
                            <img src={qrUrl} alt="QR Code" className="img-fluid border p-2 rounded bg-white" style={{ width: "140px" }} />
                            <div className="fw-bold text-success mt-2">Price: ₹ {product.price} | Stock: {product.stock} pcs</div>
                        </div>
                    </div>

                    <div className="modal-footer bg-light">
                        <button type="button" className="btn btn-secondary rounded-pill" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary rounded-pill fw-bold" onClick={handlePrint}>
                            <i className="fa-solid fa-print me-1"></i> Print Sticker Label
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BarcodeModal;
