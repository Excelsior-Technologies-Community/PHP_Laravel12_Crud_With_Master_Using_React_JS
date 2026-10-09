<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryLog extends Model
{
    use HasFactory;

    protected $table = 'inventory_logs';

    protected $fillable = [
        'product_id',
        'change_type',
        'old_stock',
        'new_stock',
        'change_qty',
        'notes',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
