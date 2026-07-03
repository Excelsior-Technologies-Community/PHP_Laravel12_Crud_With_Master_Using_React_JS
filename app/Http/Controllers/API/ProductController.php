<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display all products
     * Supports:
     * Search
     * Sort
     * Category Filter
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Global Search
        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhere('price', 'LIKE', "%{$search}%")
                    ->orWhere('stock', 'LIKE', "%{$search}%")
                    ->orWhereHas('category', function ($cat) use ($search) {

                        $cat->where('name', 'LIKE', "%{$search}%");
                    });
            });
        }

        // Filter Category
        if ($request->filled('category')) {

            $query->where('category_id', $request->category);
        }

        // Sorting
        switch ($request->sort) {

            case 'price_low':
                $query->orderBy('price');
                break;

            case 'price_high':
                $query->orderByDesc('price');
                break;

            case 'stock':
                $query->orderByDesc('stock');
                break;

            case 'latest':
                $query->latest();
                break;

            default:
                $query->latest();
        }

        return response()->json([
            'success' => true,
            'count' => $query->count(),
            'data' => $query->get()
        ]);
    }

    /**
     * Store Product
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',

        ]);

        if ($validator->fails()) {

            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create($request->all());

        return response()->json([

            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product->load('category')

        ], 201);
    }

    /**
     * Show Product
     */
    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {

            return response()->json([

                'success' => false,
                'message' => 'Product not found'

            ], 404);
        }

        return response()->json([

            'success' => true,
            'data' => $product

        ]);
    }

    /**
     * Update Product
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {

            return response()->json([

                'success' => false,
                'message' => 'Product not found'

            ], 404);
        }

        $validator = Validator::make($request->all(), [

            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',

        ]);

        if ($validator->fails()) {

            return response()->json([

                'success' => false,
                'errors' => $validator->errors()

            ], 422);
        }

        $product->update($request->all());

        return response()->json([

            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product->load('category')

        ]);
    }

    /**
     * Delete Product
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {

            return response()->json([

                'success' => false,
                'message' => 'Product not found'

            ], 404);
        }

        $product->delete();

        return response()->json([

            'success' => true,
            'message' => 'Product deleted successfully'

        ]);
    }

    /**
     * Dashboard Statistics
     */
    public function dashboard()
    {
        return response()->json([

            'success' => true,

            'total_products' => Product::count(),

            'total_categories' => Category::count(),

            'total_stock' => Product::sum('stock'),

            'low_stock_products' => Product::where('stock', '<', 10)->count(),

            'inventory_value' => Product::sum(DB::raw('price * stock'))

        ]);
    }

    /**
     * Low Stock Products
     */
    public function lowStock()
    {
        $products = Product::with('category')
            ->where('stock', '<', 10)
            ->orderBy('stock')
            ->get();

        return response()->json([

            'success' => true,

            'count' => $products->count(),

            'data' => $products

        ]);
    }
}