define( [ "jquery", "mcomjs/components/media/CarouselController" ], function ( $, CarouselController ) {
  $.ajax( {
    type: 'GET',
    url: '/shop/catalog/product/productpool',
    data: $.param( {
        "ppCatId": 13247,
        "ppMediaComponentId": "1420101000000000000" +"3253010",
        "ppCustomRowId": 8
    } ),
    dataType: 'html',
    success: function ( response ) {
      $("#row_101_8 #row8_column1").html(response.replace("shoes?id=13247","shoes?id=1324733").replace(/mcomjs/g, "../js/mcom").replace("MACYS.PanelRow", "//MACYS.PanelRow"));
      $("#row_101_8 .carouselProductPool").show();
    }
  });
});