    var position = new google.maps.LatLng(37.574237,-122.064246);  //Sencha HQ

    // Tracking Marker Image
    var image = new google.maps.MarkerImage(
        'img/point.png',
        new google.maps.Size(32, 31),
        new google.maps.Point(0,0),
        new google.maps.Point(16, 31)
    );

    //var image = //new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
   
    var shadow = new google.maps.MarkerImage(
        'img/shadow.png',       
        new google.maps.Size(64, 52),
        new google.maps.Point(0,0),
        new google.maps.Point(-5, 42)
    );
        
    //var shadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
           
    var map = new Ext.Map({
        mapOptions : {
            center : new google.maps.LatLng(37.574237, -122.064246),  //nearby San Fran
            zoom : 12,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            navigationControl: true,
            navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }
        },
        plugins : [
            new Ext.plugin.GMap.Tracker({
                trackSuspended : true,   //suspend tracking initially
                highAccuracy   : false,
                marker : new google.maps.Marker({
                    position: position,
                    title : 'My Current Location',
                    shadow: shadow,
                    icon  : image
                  })
            }),
            new Ext.plugin.GMap.Traffic({ hidden : true })
        ],
        listeners : {
            maprender : function(comp, map){
                var marker = new google.maps.Marker({
                                 position: position,
                                 title : 'Sencha HQ',
                                 map: map
                            });

                google.maps.event.addListener(marker, 'click', function() {
                     infowindow.open(map, marker);
                });

                setTimeout( function(){ map.panTo (position); } , 1000);
            }
        }
    });

    var mapPanel = new Ext.Panel({
    	  title:  'Map',
//            fullscreen: true,  
//            dockedItems: [toolbar],
        items: [map]
    });