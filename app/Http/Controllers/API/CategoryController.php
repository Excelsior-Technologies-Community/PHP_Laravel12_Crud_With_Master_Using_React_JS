<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display Categories
     * Search + Product Count
     */
    public function index(Request $request)
    {
        $query = Category::withCount('products');

        // Search
        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");

            });
        }

        $categories = $query->latest()->get();

        return response()->json([

            'success' => true,

            'count' => $categories->count(),

            'data' => $categories

        ]);
    }

    /**
     * Store Category
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',

        ]);

        if ($validator->fails()) {

            return response()->json([

                'success' => false,

                'errors' => $validator->errors()

            ], 422);
        }

        $category = Category::create([

            'name' => $request->name,

            'description' => $request->description

        ]);

        return response()->json([

            'success' => true,

            'message' => 'Category created successfully.',

            'data' => $category

        ], 201);
    }

    /**
     * Show Category
     */
    public function show($id)
    {
        $category = Category::with('products')->find($id);

        if (!$category) {

            return response()->json([

                'success' => false,

                'message' => 'Category not found.'

            ], 404);
        }

        return response()->json([

            'success' => true,

            'total_products' => $category->products->count(),

            'data' => $category

        ]);
    }

    /**
     * Update Category
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {

            return response()->json([

                'success' => false,

                'message' => 'Category not found.'

            ], 404);
        }

        $validator = Validator::make($request->all(), [

            'name' => 'required|string|max:255|unique:categories,name,' . $id,

            'description' => 'nullable|string',

        ]);

        if ($validator->fails()) {

            return response()->json([

                'success' => false,

                'errors' => $validator->errors()

            ], 422);
        }

        $category->update([

            'name' => $request->name,

            'description' => $request->description

        ]);

        return response()->json([

            'success' => true,

            'message' => 'Category updated successfully.',

            'data' => $category

        ]);
    }

    /**
     * Delete Category
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {

            return response()->json([

                'success' => false,

                'message' => 'Category not found.'

            ], 404);
        }

        // Prevent delete if products exist
        if ($category->products()->count() > 0) {

            return response()->json([

                'success' => false,

                'message' => 'Cannot delete category because it contains products.'

            ], 400);
        }

        $category->delete();

        return response()->json([

            'success' => true,

            'message' => 'Category deleted successfully.'

        ]);
    }
}