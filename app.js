define( [ "jquery", "mcomjs/components/media/CarouselController", "cookie" ], function ( $, CarouselController, Cookie ) {
  var codes = {
  	"1006": "3253010",
  	"1008": "3253011",
  	"1010": "3253012",
  	"1012": "3253013",
  	"1014": "3253015"  	
  };
  
  $('.regionSet').on('click', function(e){
  	e.preventDefault();
  	var region = $(this).attr('rel');
  	document.cookie='herokukey=%7B%22EXPERIMENT%22%3A%5B'+region+'%5D%7D; path=/;';
  	location.reload();
  });
  
  var defaultCode = "2976897";
  
  var experiment = JSON.parse(Cookie.get("herokukey"));
  
  var passedCode = (null != experiment && codes[experiment["EXPERIMENT"]])?codes[experiment["EXPERIMENT"]]:defaultCode;
  
  $.ajax( {
    type: 'GET',
    url: '/shop/catalog/product/productpool',
    data: $.param( {
        "ppCatId": 13247,
        "ppMediaComponentId": "1420101000000000000" + passedCode,
        "ppCustomRowId": 8
    } ),
    dataType: 'html',
    success: function ( response ) {
      $("#row_101_8 #row8_column1").html(response.replace("shoes?id=13247","shoes?id=1324733").replace(/mcomjs/g, "../js/mcom").replace("MACYS.PanelRow", "//MACYS.PanelRow"));
      $("#row_101_8 .carouselProductPool").show();
    }
  });
});