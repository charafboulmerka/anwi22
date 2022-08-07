<?php
/* Meribout */
namespace Botble\Ecommerce\Models;

use Botble\Base\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Botble\Ecommerce\Models\YalidineCommunes;

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

    /**
     * @return Price
     */
    public function getPriceByIDWilaya()
    {
        return $this->get("yalidine_price")->first()->yalidine_price;
    }

    protected static function boot()
    {
        parent::boot();
    }
}
