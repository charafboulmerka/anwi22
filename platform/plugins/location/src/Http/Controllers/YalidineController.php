<?php
/* Meribout */

namespace Botble\Location\Http\Controllers;

use Botble\Base\Http\Controllers\BaseController;
use Botble\Base\Http\Responses\BaseHttpResponse;
use Botble\Ecommerce\Models\YalidineWilayas;
use Illuminate\Http\Request;

class YalidineController extends BaseController
{
    protected $wilayas;

    public function __construct(YalidineWilayas $wilayas)
    {
        $this->wilayas = $wilayas;
    }

    /**
     * @param Request $request
     */
    
    public function ajaxGetCommunesByWilayaID(Request $request)
    {
        $this->wilayas->id = $request->input("wilaya_id");
        return $this->wilayas->variationCommunes()->get()->toJson();
    }
}
