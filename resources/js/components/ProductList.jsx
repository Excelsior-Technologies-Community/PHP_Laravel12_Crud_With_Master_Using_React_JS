import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const [category, setCategory] = useState("");

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
                params: {
                    search: search,
                    sort: sort,
                    category: category,
                },
            });

            setProducts(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/categories");
            setCategories(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">📦 Product Management</h2>

            <div className="row mb-3">

                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <select
                        className="form-control"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="latest">Latest</option>
                        <option value="price_low">Price Low</option>
                        <option value="price_high">Price High</option>
                        <option value="stock">Stock</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>

                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {products.length > 0 ? (

                        products.map((product) => (

                            <tr key={product.id}>

                                <td>{product.id}</td>

                                <td>{product.name}</td>

                                <td>{product.description}</td>

                                <td>₹ {product.price}</td>

                                <td>{product.stock}</td>

                                <td>
                                    {product.category
                                        ? product.category.name
                                        : "-"}
                                </td>

                                <td>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            deleteProduct(product.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="7" className="text-center">
                                No Products Found
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default ProductList;