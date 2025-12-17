<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create categories
        $categories = Category::factory(5)->create();

        // Create products for each category
        $categories->each(function ($category) {
            Product::factory(3)->create([
                'category_id' => $category->id
            ]);
        });
    }
}