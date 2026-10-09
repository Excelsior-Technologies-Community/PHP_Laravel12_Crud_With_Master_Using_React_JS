<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\InventoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display all products
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Global Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('sku', 'LIKE', "%{$search}%")
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
     * Store Product & Log Inventory
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

        $sku = $request->filled('sku') ? $request->sku : $this->generateSku();

        $product = Product::create([
            'sku' => $sku,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
        ]);

        // Audit Log
        InventoryLog::create([
            'product_id' => $product->id,
            'change_type' => 'initial',
            'old_stock' => 0,
            'new_stock' => $product->stock,
            'change_qty' => $product->stock,
            'notes' => 'Initial product creation'
        ]);

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
        $product = Product::with(['category', 'inventoryLogs'])->find($id);

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
     * Update Product & Audit Stock Changes
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

        $oldStock = $product->stock;
        $newStock = (int)$request->stock;

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $newStock,
            'category_id' => $request->category_id,
        ]);

        if ($oldStock !== $newStock) {
            InventoryLog::create([
                'product_id' => $product->id,
                'change_type' => $newStock > $oldStock ? 'stock_in' : 'stock_out',
                'old_stock' => $oldStock,
                'new_stock' => $newStock,
                'change_qty' => abs($newStock - $oldStock),
                'notes' => 'Manual stock update via master form'
            ]);
        }

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
     * Bulk Actions (Batch Delete, Batch Category Transfer, Stock Adjust)
     */
    public function bulkAction(Request $request)
    {
        $action = $request->input('action');
        $productIds = $request->input('product_ids', []);

        if (empty($productIds) || !is_array($productIds)) {
            return response()->json(['success' => false, 'message' => 'No products selected.'], 400);
        }

        if ($action === 'delete') {
            Product::whereIn('id', $productIds)->delete();
            return response()->json(['success' => true, 'message' => count($productIds) . ' products deleted in bulk.']);
        }

        if ($action === 'change_category') {
            $catId = $request->input('category_id');
            Product::whereIn('id', $productIds)->update(['category_id' => $catId]);
            return response()->json(['success' => true, 'message' => 'Bulk category updated for selected products.']);
        }

        if ($action === 'replenish_stock') {
            $qty = (int)$request->input('add_qty', 10);
            $products = Product::whereIn('id', $productIds)->get();
            foreach ($products as $p) {
                $old = $p->stock;
                $p->increment('stock', $qty);
                InventoryLog::create([
                    'product_id' => $p->id,
                    'change_type' => 'stock_in',
                    'old_stock' => $old,
                    'new_stock' => $old + $qty,
                    'change_qty' => $qty,
                    'notes' => 'Bulk stock replenishment'
                ]);
            }
            return response()->json(['success' => true, 'message' => 'Stock replenished for selected products.']);
        }

        return response()->json(['success' => false, 'message' => 'Invalid bulk action.'], 400);
    }

    /**
     * Bulk CSV File Import
     */
    public function importCsv(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['success' => false, 'message' => 'CSV file is required.'], 400);
        }

        $file = $request->file('file');
        $content = file_get_contents($file->getRealPath());
        $lines = explode("\n", str_replace("\r", "", $content));

        $imported = 0;
        $defaultCat = Category::first() ? Category::first()->id : 1;

        foreach ($lines as $i => $line) {
            if ($i === 0 || trim($line) === '') continue; // Skip header or empty
            $row = str_getcsv($line);
            if (count($row) < 3) continue;

            $name = trim($row[0]);
            $price = floatval($row[1] ?? 0);
            $stock = intval($row[2] ?? 0);
            $catId = intval($row[3] ?? $defaultCat);

            if ($name === '') continue;

            $product = Product::create([
                'sku' => $this->generateSku(),
                'name' => $name,
                'description' => $row[4] ?? 'Imported via CSV Engine',
                'price' => $price,
                'stock' => $stock,
                'category_id' => Category::find($catId) ? $catId : $defaultCat,
            ]);

            InventoryLog::create([
                'product_id' => $product->id,
                'change_type' => 'initial',
                'old_stock' => 0,
                'new_stock' => $stock,
                'change_qty' => $stock,
                'notes' => 'Imported via Bulk CSV Engine'
            ]);

            $imported++;
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully imported {$imported} products!",
            'count' => $imported
        ]);
    }

    /**
     * Inventory Audit Logs List API
     */
    public function inventoryAuditLogs()
    {
        $logs = InventoryLog::with('product.category')
            ->latest()
            ->take(30)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    /**
     * Category Asset Valuation for Chart.js
     */
    public function categoryAssetValuation()
    {
        $categories = Category::withCount('products')->get();
        $valuation = [];

        foreach ($categories as $cat) {
            $totalVal = Product::where('category_id', $cat->id)->sum(DB::raw('price * stock'));
            $totalStock = Product::where('category_id', $cat->id)->sum('stock');
            $valuation[] = [
                'category_id' => $cat->id,
                'category_name' => $cat->name,
                'product_count' => $cat->products_count,
                'total_stock' => $totalStock,
                'asset_value' => round($totalVal, 2)
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $valuation
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
            'inventory_value' => round(Product::sum(DB::raw('price * stock')), 2)
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

    private function generateSku()
    {
        $lastProduct = Product::latest('id')->first();
        $number = $lastProduct ? $lastProduct->id + 1 : 1;
        return 'PRD-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Product Statistics API
     */
    public function statistics()
    {
        $totalProducts = Product::count();
        $inStock = Product::where('stock', '>', 10)->count();
        $lowStock = Product::whereBetween('stock', [1, 10])->count();
        $outOfStock = Product::where('stock', 0)->count();
        $averagePrice = round(Product::avg('price'), 2);
        $highestPrice = Product::max('price');
        $lowestPrice = Product::min('price');
        $inventoryValue = Product::sum(DB::raw('price * stock'));

        return response()->json([
            'success' => true,
            'statistics' => [
                'total_products' => $totalProducts,
                'in_stock_products' => $inStock,
                'low_stock_products' => $lowStock,
                'out_of_stock_products' => $outOfStock,
                'average_price' => $averagePrice,
                'highest_price' => $highestPrice,
                'lowest_price' => $lowestPrice,
                'inventory_value' => round($inventoryValue, 2),
            ]
        ]);
    }
}
