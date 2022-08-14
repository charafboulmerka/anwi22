try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {
}

import {CheckoutAddress} from './partials/address';
import {DiscountManagement} from './partials/discount';
class MainCheckout {
    constructor() {
        new CheckoutAddress().init();
        new DiscountManagement().init();
    }

    static showNotice(messageType, message, messageHeader = '') {
        toastr.clear();

        toastr.options = {
            closeButton: true,
            positionClass: 'toast-bottom-right',
            onclick: null,
            showDuration: 1000,
            hideDuration: 1000,
            timeOut: 10000,
            extendedTimeOut: 1000,
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut'
        };

        if (!messageHeader) {
            switch (messageType) {
                case 'error':
                    messageHeader = window.messages.error_header;
                    break;
                case 'success':
                    messageHeader = window.messages.success_header;
                    break;
            }
        }

        toastr[messageType](message, messageHeader);
    }

    init() {

        /* Meribout */

        /*if ( $('#address_name').val() == "") {
            $('#address_name').val("AAAA");
        }

        if ( $('#address_name').val() == "") {
            $('#address_name').val("BBBB");
        }*/

        $(document).on('change', '#address_wilaya', event => {
            event.preventDefault();
            loadShippingFeeAtTheFirstTime();
        });

        function getCommunesListByWilayaID(_self,wilaya_id)  {
            
            $.ajax({
                url: _self.data('url'),
                type: 'POST',
                data: {
                    wilaya_id: wilaya_id,
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: res => {
                    $('#address_commune').find('option').remove();
                    $.each(JSON.parse(res), function(i,commune) {
                        $('#address_commune').append($('<option>').val(commune.id).text(commune.name));
                    });                    
                },
                error: data => {
                    console.log("error");
                }
            });
            
            $('.shipping-info-loading').hide();
        }

        let  shippingForm = '#main-checkout-product-info';
        
        let disablePaymentMethodsForm = () => {
            $('.payment-info-loading').show();
            $('.payment-checkout-btn').prop('disabled', true);
        }

        let enablePaymentMethodsForm = () => {
            $('.payment-info-loading').hide();
            $('.payment-checkout-btn').prop('disabled', false);

            document.dispatchEvent(new CustomEvent('payment-form-reloaded'));
        }

        let loadShippingFeeAtTheFirstTime = () => {
            let shippingMethod = $(document).find('input[name=shipping_method]:checked').first();
            if (!shippingMethod.length) {
                shippingMethod = $(document).find('input[name=shipping_method]').first()
            }

            if (shippingMethod.length) {
                shippingMethod.trigger('click');

                disablePaymentMethodsForm();

                $('.mobile-total').text('...');

                const isAddressAvailable = $('.customer-address-payment-form #address_id option:selected').val();

                const addressForm = $('.customer-address-payment-form').clone();

                const selectedCountry = $('.customer-address-payment-form #address_country option:selected').val();
                const selectedState = $('.customer-address-payment-form #address_state option:selected').val();
                const selectedCity = $('.customer-address-payment-form #address_city option:selected').val();
                const wilaya_selected = $('#address_wilaya option:selected').val();

                $('.shipping-info-loading').show();
                let element = $('#address_commune');
                element.prop("disabled", true);
                $(shippingForm).load(window.location.href
                    + '?shipping_method=' + shippingMethod.val()
                    + '&shipping_option=' + shippingMethod.data('option')
                    /* Meribout */
                    + '&wilaya_id='+wilaya_selected
                    + ' ' + shippingForm + ' > *', () => {
                    if (!isAddressAvailable) {
                        $('.customer-address-payment-form').replaceWith(addressForm);
                        if (selectedCountry) {
                            $('.customer-address-payment-form #address_country').val(selectedCountry);
                        }

                        if (selectedState) {
                            $('.customer-address-payment-form #address_state').val(selectedState);
                        }

                        if (selectedCity) {
                            $('.customer-address-payment-form #address_city').val(selectedCity);
                        }
                    }

                    $("#address_wilaya option:selected").removeAttr("selected"); //Charaf
                    $('#address_wilaya option[value="'+wilaya_selected+'"]').attr('selected','selected');
                    getCommunesListByWilayaID($('#address_wilaya'),wilaya_selected);
                    enablePaymentMethodsForm();
                    element.prop("disabled", false);
                });
            }
        }

        loadShippingFeeAtTheFirstTime();

        let loadShippingFeeAtTheSecondTime = () => {
            const $marketplace = $('.checkout-products-marketplace');

            if (!$marketplace || !$marketplace.length) {
                return;
            }

            let shippingMethods = $(shippingForm).find('input.shipping_method_input');
            let methods = {
                'shipping_method': {},
                'shipping_option': {}
            };

            if (shippingMethods.length) {
                let storeIds = [];

                shippingMethods.map((i, shm) => {
                    let val = $(shm).filter(':checked').val();
                    let sId = $(shm).data('id');
                    if (!storeIds.includes(sId)) {
                        storeIds.push(sId);
                    }
                    if (val) {
                        methods['shipping_method'][sId] = val;
                        methods['shipping_option'][sId] = $(shm).data('option');
                    }
                });

                if (Object.keys(methods['shipping_method']).length !== storeIds.length) {
                    shippingMethods.map((i, shm) => {
                        let sId = $(shm).data('id');
                        if (!methods['shipping_method'][sId]) {
                            methods['shipping_method'][sId] = $(shm).val();
                            methods['shipping_option'][sId] = $(shm).data('option');
                            $(shm).prop('checked', true);
                        }
                    });
                }
            }

            disablePaymentMethodsForm();

            const isAddressAvailable = $('.customer-address-payment-form #address_id option:selected').val();

            const addressForm = $('.customer-address-payment-form').clone();

            const selectedCountry = $('.customer-address-payment-form #address_country option:selected').val();
            const selectedState = $('.customer-address-payment-form #address_state option:selected').val();
            const selectedCity = $('.customer-address-payment-form #address_city option:selected').val();
            const wilaya_selected = $('#address_wilaya option:selected').val(); //Charaf

            $('.shipping-info-loading').show();
            $(shippingForm).load(window.location.href + '?' 
            + $.param(methods) 
            + ' ' 
            /* Meribout */
            + '&wilaya_id='+wilaya_selected
            + shippingForm + ' > *', () => {
                if (!isAddressAvailable) {
                    $('.customer-address-payment-form').replaceWith(addressForm);
                    if (selectedCountry) {
                        $('.customer-address-payment-form #address_country').val(selectedCountry);
                    }

                    if (selectedState) {
                        $('.customer-address-payment-form #address_state').val(selectedState);
                    }

                    if (selectedCity) {
                        $('.customer-address-payment-form #address_city').val(selectedCity);
                    }
                }
                $('#address_wilaya option[value="'+wilaya_selected+'"]').attr('selected','selected'); //Charaf
                $('.shipping-info-loading').hide();
                enablePaymentMethodsForm();
            });
        }

        loadShippingFeeAtTheSecondTime();

        $(document).on('change', 'input.shipping_method_input', () => {
            loadShippingFeeAtTheSecondTime()
        });

        $(document).on('change', 'input[name=shipping_method]', event => {
            // Fixed: set shipping_option value based on shipping_method change:
            const $this = $(event.currentTarget);
            $('input[name=shipping_option]').val($this.data('option'));

            disablePaymentMethodsForm();

            $('.mobile-total').text('...');

            const isAddressAvailable = $('.customer-address-payment-form #address_id option:selected').val();

            const addressForm = $('.customer-address-payment-form').clone();

            const selectedCountry = $('.customer-address-payment-form #address_country option:selected').val();
            const selectedState = $('.customer-address-payment-form #address_state option:selected').val();
            const selectedCity = $('.customer-address-payment-form #address_city option:selected').val();
            const wilaya_selected = $('#address_wilaya option:selected').val(); //Charaf

            $('.shipping-info-loading').show();            
            $(shippingForm).load(window.location.href
                + '?shipping_method=' + $this.val()
                + '&shipping_option=' + $this.data('option')
                /* Charaf */
                + '&wilaya_id='+wilaya_selected
                + ' ' + shippingForm + ' > *', () => {
                if (!isAddressAvailable) {
                    $('.customer-address-payment-form').replaceWith(addressForm);
                    if (selectedCountry) {
                        $('.customer-address-payment-form #address_country').val(selectedCountry);
                    }

                    if (selectedState) {
                        $('.customer-address-payment-form #address_state').val(selectedState);
                    }

                    if (selectedCity) {
                        $('.customer-address-payment-form #address_city').val(selectedCity);
                    }
                }
                $('#address_wilaya option[value="'+wilaya_selected+'"]').attr('selected','selected'); //Charaf
                $('.shipping-info-loading').hide();
                enablePaymentMethodsForm();
            });
        });

        let validatedFormFields = () => {
            let addressId = $('#address_id').val();
            if (addressId && addressId !== 'new') {
                return true;
            }

            let validated = true;
            $.each($(document).find('.address-control-item-required'), (index, el) => {
                if (!$(el).val() || $(el).val() === 'null') {
                    validated = false;
                }
            });

            return validated;
        }

        $(document).on('change', '.customer-address-payment-form .address-control-item', event => {
            let _self = $(event.currentTarget);
            _self.closest('.form-group').find('.text-danger').remove();
            if (validatedFormFields()) {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: $('#save-shipping-information-url').val(),
                    data: new FormData(_self.closest('form')[0]),
                    contentType: false,
                    processData: false,
                    success: res => {
                        if (!res.error) {
                            disablePaymentMethodsForm();

                            let $wrapper = $(shippingForm);
                            if ($wrapper.length) {
                                $('.shipping-info-loading').show();
                                $wrapper.load(window.location.href + ' ' + shippingForm + ' > *', () => {
                                    $('.shipping-info-loading').hide();
                                    const isChecked = $wrapper.find('input[name=shipping_method]:checked');
                                    if (!isChecked) {
                                        $wrapper.find('input[name=shipping_method]:first-child').trigger('click'); // need to check again
                                    }
                                    enablePaymentMethodsForm();
                                });
                            }

                            loadShippingFeeAtTheSecondTime(); // marketplace
                        }
                    },
                    error: res => {
                        console.log(res);
                    }
                });
            }
        });
    }
}

$(document).ready(() => {
    new MainCheckout().init();

    window.MainCheckout = MainCheckout;
});
