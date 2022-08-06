<?php
/* Meribout */
namespace Botble\Ecommerce\Models;

use Botble\Base\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Botble\Ecommerce\Models\YalidineWilayas;

class YalidineCommunes extends BaseModel
{

    /**
     * @var string
     */
    protected $table = 'yalidine_communes';

    /**
     * @var array
     */
    protected $fillable = [
        'name',
        'wilaya_id',
        'wilaya_name'
    ];

    

    /**
     * @return HasOne
     */
    public function parentWilaya(): HasOne
    {
        return $this->hasOne(YalidineWilayas::class, 'id', 'wilaya_id');
    }

    protected static function boot()
    {
        parent::boot();
    }
}
