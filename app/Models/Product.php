<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'description',
        'price',
        'stock',
        'category_id'
    ];

    protected $appends = [
        'inventory_status'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getInventoryStatusAttribute()
    {
        if ($this->stock == 0) {
            return 'Out of Stock';
        }

        if ($this->stock <= 10) {
            return 'Low Stock';
        }

        return 'In Stock';
    }
}