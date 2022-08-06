<?php
/* Meribout */
namespace Botble\Ecommerce\Models;

use Botble\Base\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class YalidineWilayas extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'yalidine_wilayas';

    /**
     * @var array
     */
    protected $fillable = [
        'name',
        'yalidine_price',
        'anwi_price'
    ];

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @return HasMany
     */
    public function variationCommunes(): HasMany
    {
        return $this->hasMany(YalidineCommunes::class, 'wilaya_id','id');
    }

    protected static function boot()
    {
        parent::boot();
    }
}
