define( [ "jquery", "stringUtil", "security", "mcomjs/components/media/CarouselController" ], function ( $, stringUtil, security, CarouselController ) {
    var selfSelect = {};

    selfSelect.pools = {
        "16904": {
            "domNode": ".carouselProductPool:first",
            "rowId": "",
            "regions": [ {
                "title": "Los Angeles",
                "mediaId": 3253000,
                "markup": ""
            }, {
                "title": "New York",
                "mediaId": 3253001,
                "markup": ""
            }, {
                "title": "Miami",
                "mediaId": 3253002,
                "markup": ""
            }, {
                "title": "Chicago",
                "mediaId": 3253004,
                "markup": ""
            }, {
                "title": "San Francisco",
                "mediaId": 3253006,
                "markup": ""
            }, {
                "title": "U.S.",
                "markup": ""
            } ]
        },
        "118": {
            "domNode": ".carouselProductPool:first",
            "rowId": "",
            "regions": [ {
                "title": "Los Angeles",
                "mediaId": 3253010,
                "markup": ""
            }, {
                "title": "New York",
                "mediaId": 3253011,
                "markup": ""
            }, {
                "title": "Miami",
                "mediaId": 3253012,
                "markup": ""
            }, {
                "title": "Dallas",
                "mediaId": 3253013,
                "markup": ""
            }, {
                "title": "Chicago",
                "mediaId": 3253014,
                "markup": ""
            }, {
                "title": "U.S.",
                "markup": ""
            } ]
        },
        "1": {
            "domNode": ".carouselProductPool:first",
            "rowId": "",
            "regions": [ {
                "title": "New York",
                "mediaId": 3253015,
                "markup": ""
            }, {
                "title": "Miami",
                "mediaId": 3253016,
                "markup": ""
            }, {
                "title": "Dallas",
                "mediaId": 3253017,
                "markup": ""
            }, {
                "title": "San Francisco",
                "mediaId": 3253023,
                "markup": ""
            }, {
                "title": "DC",
                "mediaId": 3253024,
                "markup": ""
            }, {
                "title": "U.S.",
                "markup": ""
            } ]
        }


    };

    selfSelect.setPoolId = function ( poolId ) {
        selfSelect.poolId = poolId;
    };

    selfSelect.setServiceURL = function ( serviceUrl ) {
        selfSelect.serviceUrl = serviceUrl;
    };


    selfSelect.setPoolId( security.preventXss( stringUtil.getURLParameter( "id" ) ) );
    selfSelect.setServiceURL( "/shop/catalog/product/productpool" );
    selfSelect.navHTML = "";

    //Click function for navigation links
    selfSelect.link = function ( e ) {
        e.preventDefault();
        var regionIndex = $( e.target ).attr( 'rel' );
        var pool = selfSelect.pools[ selfSelect.poolId ];
        //Check if markup has been stored
        if ( pool.regions[ regionIndex ].markup.length > 0 ) {
            //Draw stored markup
            selfSelect.drawPool( regionIndex );
        } else {
            //Get JSON and generate markup
            selfSelect.getMedia( regionIndex );
        }

    };

    selfSelect.init = function () {
        //Find pool in hardcoded list
        var pool = selfSelect.pools[ selfSelect.poolId ];

        //Check that a self select pool actually exists for this page.
        if ( pool != null ) {
            var domNode = $( pool.domNode );
            //Store default markup.
            pool.regions[ pool.regions.length - 1 ].markup = $( domNode )[ 0 ].outerHTML;
            pool.rowId = domNode.parent().find( '.panelRow' ).val();

            //Create Navigation
            selfSelect.navHTML = "<div  class='selfSelectNav'><ul><li>View:</li> \n";
            for ( var itr = 0; itr < pool.regions.length; itr++ ) {
                selfSelect.navHTML += "<li> \n<a href='#' class='selfSelectLink' rel='" + itr + "'>" + pool.regions[ itr ].title + "</a> \n</li> \n";
            }
            selfSelect.navHTML += "</ul></div>";

            //Add Self Select Navigation to Pool
            var pHeader = domNode.find( ".poolHeader" );

            pHeader.append( selfSelect.navHTML );

            $( '.selfSelectNav li:last a' ).addClass( 'active' );
            //Bind click event
            $( document ).on( 'click', '.selfSelectNav', selfSelect.link );

        }
    };


    //Get data 
    selfSelect.getMedia = function ( regionIndex ) {
        var pool = selfSelect.pools[ selfSelect.poolId ];
        //TODO AJAX CALL with pool.mediaId - Include regionIndex in callback
        $.ajax( {
            type: 'GET',
            url: selfSelect.serviceUrl,
            data: $.param( {
                "ppCatId": selfSelect.poolId,
                "ppMediaComponentId": "1420101000000000000" + pool.regions[ regionIndex ].mediaId,
                "ppCustomRowId": pool.rowId
            } ),
            dataType: 'html',
            success: function ( response ) {
                pool.regions[ regionIndex ].markup = response;
                selfSelect.drawPool( regionIndex );
            }
        } );
    };

    //Replace existing product pool with selected pool
    selfSelect.drawPool = function ( regionIndex ) {
        var pool = selfSelect.pools[ selfSelect.poolId ];
        var markup = pool.regions[ regionIndex ].markup;
        //Unbind events attached to nav that is being overwritten
        $( document ).off( 'click', '.selfSelectNav', selfSelect.link );

        var domNode = $( pool.domNode );
        domNode.replaceWith( markup );
        domNode = $( pool.domNode );
        var options = {
            bounce: false,
            disableMouse: true,
            disablePointer: true,
            disableTouch: true,
            scrollbars: false,
            scrollX: true,
            scrollY: false,
            snap: 'li'
        };
        //Add Self Select Navigation to Pool
        var pHeader = domNode.find( ".poolHeader" );
        pHeader.append( selfSelect.navHTML );
        //Bind click event
        $( document ).on( 'click', '.selfSelectNav', selfSelect.link );

        //Add New active state
        $( '.selfSelectNav a[rel="' + regionIndex + '"]' ).addClass( 'active' );

        if ( typeof window.baseUrlAssets !== 'undefined' ) {
            CarouselController.init( $( '.carousel-wrapper' ), options, window.baseUrlAssets, 1 );
            CarouselController.makeCarousel();
        }

    };

    $( document ).ready( function () {
        selfSelect.init();
    } );

    $( window ).unload( function () {
        $( document ).off( 'click', '.selfSelectNav', selfSelect.link );
    } );

    return {
        init: selfSelect.init,
        setPoolId: selfSelect.setPoolId,
        setServiceURL: selfSelect.setServiceURL
    };

} );