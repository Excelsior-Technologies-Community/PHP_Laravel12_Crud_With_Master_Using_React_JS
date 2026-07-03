import React, { useEffect, useState } from "react";
import axios from "axios";

function CategoryList() {

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        fetchCategories();

    }, [search]);

    const fetchCategories = async () => {

        try {

            const response = await axios.get("/api/categories", {

                params: {

                    search: search,

                }

            });

            setCategories(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteCategory = async (id) => {

        if (!window.confirm("Delete Category?")) return;

        try {

            await axios.delete(`/api/categories/${id}`);

            fetchCategories();

        } catch (error) {

            alert(error.response.data.message);

        }

    };

    return (

        <div className="container mt-5">

            <h2 className="mb-4">

                📂 Category Management

            </h2>

            <input

                type="text"

                className="form-control mb-3"

                placeholder="Search Category..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

            />

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Description</th>

                        <th>Total Products</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        categories.length > 0 ?

                            categories.map(category => (

                                <tr key={category.id}>

                                    <td>{category.id}</td>

                                    <td>{category.name}</td>

                                    <td>{category.description}</td>

                                    <td>{category.products_count}</td>

                                    <td>

                                        <button

                                            className="btn btn-danger btn-sm"

                                            onClick={() => deleteCategory(category.id)}

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td colSpan="5" className="text-center">

                                    No Categories Found

                                </td>

                            </tr>

                    }

                </tbody>

            </table>

        </div>

    );

}

export default CategoryList;