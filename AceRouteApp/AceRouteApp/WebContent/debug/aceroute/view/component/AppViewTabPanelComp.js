Ext.AceRoute.view.cfg = {};

var appTabPanelGlobal;
var orderMapPanelGlobal;
var orderDataGlobal;

Ext.AceRoute.view.OfflineStore = new Ext.data.Store({
    model: 'OfflineData',
    autoLoad: true
});

Ext.AceRoute.view.SpeakerStore = new Ext.data.Store({
    model: 'Speaker',
    getGroupString: function(r){
        return r.get('last_name')[0]
    }
});

Ext.AceRoute.view.AppTabPanel = Ext.extend(Ext.TabPanel, {
    
	id: 'appTabPanelId',
    fullscreen: true,
    tabBar: {
        ui: 'gray',
        dock: 'bottom', 
        //height: 60,
        layout: { pack: 'center' }    
    },  
    
    cardSwitchAnimation: false,   
    _controller: null, 
    systemOperationOptionSelected: 'refreshOrders', // default value
    
    initComponent: function() {
    	if (navigator.onLine) {
    		
    		var jobsListView = new Ext.AceRoute.view.SessionListXml({
    			id: 'orderListXmlId',
    			name: 'orderListXml',   
    			//styleHtmlContent: true, 
    			iconCls: 'doc_list',
                height: 60, 
                title: 'Jobs',
                //style: 'margin-top: 0.90em !important;', 
                confTitle: this.title,
                shortUrl: this.shortUrl 
    		});
    		
    		jobsListView.setMvcController(this._controller);
    		
    		var backDateButton = new Ext.SegmentedButton({  
                items: [{
                	text: 'Previous', 
                    dateData: 'Previous',
                    ui: 'back',
                    scope: this,
                    handler: this.goDateBack
                }],
                defaults: { flex: 1 },
                style: 'width: 100%'
            });
    		
            var nextDateButton = new Ext.SegmentedButton({
                items: [{
                	text: 'Next', 
                    dateData: 'Next',
                    ui: 'forward', 
                    scope: this,
                    handler: this.goDateNext
                }],
                defaults: { flex: 1 },
                style: 'width: 100%'
            });
            var dateButtons = new Ext.SegmentedButton({
                items: [
                        backDateButton,
                        nextDateButton
                ],
                defaults: { flex: 1 },
                style: 'width: 100%'   
            }); 
            
            var mapPanel = new Ext.Panel({ 
            	  id: "orderMapId",        
            	  name: "orderMap",
            	  title:  'Route',  
            	  iconCls: 'compass3',
                  items: [],
                  listeners: { 
                      activate: {  
                    	  fn: function(){
                    		  function mapObj(){
                				   this.geoCode;
                				   this.seqLabel;
                				   this.iconClr;
                				   this.orderStartDate;
                				   this.orderStartTime;
                				   this.orderAddress;
                				   this.orderName;
                    		  }
                    		  var mapObjArray = new Array();
                    		  
                    		  var orderListTab = this.getComponent('orderListXmlId');
                    		  var orderList;
                    		  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
                    		  
                    		  if(typeof orderListTab.list !== "undefined"){
                    			  var store = orderListTab.list.store;
                    			  if(typeof store !== "undefined"){
                    				  store.sort('start_time_millisec','ASC');
                    				  var data = store.data;
                    				  if(typeof data !== "undefined"){
                    					  var items = data.items;
                    					  if(items != null){
                    						  orderList = items;
                    						  for(var i=0; i < items.length; i++) {
                    							  var mObj = new mapObj();
                    							  var data = items[i].data;
                    							  
                    							  mObj.geoCode = data.site_geocode;
                    							  console.log(" start start_time_millisec date "+data.start_time_millisec);
                    							  console.log(" start start_time "+data.start_time);
                    							  mObj.seqLabel = i+1;
                    							  
                    							  var current_date = new Date();
                    							  var start_date = new Date(data.start_date);
                    							  var end_date = new Date(data.end_date);
                    							  var iconClr = CommonUtil.getIconColor(
                    									  current_date, start_date, end_date, data.order_wkfid );
                    							  
                    							  //console.log(" items[i].data.order_wkfid "+items[i].data.order_wkfid+' color '+iconClr);
                    							  mObj.iconClr = iconClr; 
                    							  mObj.orderStartDate = data.start_dateWithoutTime;
                               				      mObj.orderStartTime = data.start_time;
                               				      mObj.orderAddress = data.site_addr.formatAddress(",");
                               				      mObj.orderId = data.id;
                               				      mObj.orderName = data.order_name;
                               				      
                    							  mapObjArray.push(mObj);
//                    							  geoCodes.push(items[i].data.site_geocode);
//                    							  seqLabels.push(i+1);
                							  }
                    						  this.setMapObjArray(mapObjArray);
                    					  }
                    				  }
                            	  }
                    		  }
                    		  var orderData = undefined; // just for the sake to pass it to the function
                    		  if(!this._controller.isMapRenderingCompleteOnAddressClick){
                    			  this._controller.refreshMapTab(orderData, mapObjArray);
                    			  this._controller.isMapRenderingCompleteOnAddressClick = false; // reset
                    		  }
                    		  if(this._controller.isMapRenderingCompleteOnAddressClick){
                    			  //iconCls: 'chart2', this will happen once the control has come from "click on the address, which will bring the control here also"
                    			  this._controller.isMapRenderingCompleteOnAddressClick = false; // reset
                    		  }
                    	  }, 
                    	  scope: this 
                      }
                  },
            });     
            
            var systemPanel = new Ext.Panel({ 
	          	  id: "systemPanelId",        
	          	  name: "systemPanel",
	          	  title:  'System',  
	          	  iconCls: 'action',
	              items: [
					       {
								xtype:'panel',
								items: [
									{
										xtype:'fieldset',	
									    bodyBorder: false,
						    	        border: false,
						            	layout: {
						            	    type: 'hbox',
						            	    align: 'left'
						            	},
						//            	defaults: {
						//                    labelAlign: 'left',
						//                    labelWidth: '32%',
						//                    style: 'border-width: 0px',
						//                    border: false
						//                },
						                autoRender: true,
						                items:[   
							                 {
							        		    xtype: 'selectfield',
							                    name: 'orderAddUpdateOptionId',
							                    height: 27,
						//	                    layout: {
						//	                        type: 'auto',
						//	                        align: 'left'
						//	                    },
							                    store: Ext.AceRoute.store.systemOperationOptionsStore,
							                    displayField : 'systemOperationOptionName',
							                    valueField : 'systemOperationOptionId',
							                    listeners: { 
								                    change: { 
								                     	fn: function(src, value){
								                     		this.systemOperationOptionSelected = value;
								                     	},
								                     	scope: this 
								                     }
							                    }
							               },
							               {
							            	    xtype: 'button',
						        	    		text:'Refresh',
						        	            iconMask: true,
						        	            stretch: false,
						        	            scope: this,
						        	            handler: this.refreshSystemData
							               }
							           ]
									},
									{
										xtype:'fieldset',	
									    bodyBorder: false,
						    	        border: false,
						            	layout: {
						            	    type: 'hbox',
						            	    align: 'left'
						            	},
						//            	defaults: {
						//                    labelAlign: 'left',
						//                    labelWidth: '32%',
						//                    style: 'border-width: 0px',
						//                    border: false
						//                },
						                autoRender: true,
						                items:[   
							                 {
								            	    xtype: 'button',
							        	    		text:'LogOut',
							        	            iconMask: true,
							        	            stretch: false,
							        	            scope: this,
							        	            handler: this.logout
								            }
							           ]
									}
						            
								]
					       }
	            ]
            });
                    
            this.items = [   
//				{ 
//				    xtype: 'toolbar',
//				    ui: 'gray',
//				    items: dateButtons,
//				    layout: { pack: 'center' } 
//				},
                jobsListView,
                mapPanel,
                systemPanel
//            , {
//                title: 'Speakers',
//                iconCls: 'team1',
//                xtype: 'speakerlist'
//            }, {
//                title: 'Tweets',
//                iconCls: 'chat',
//                xtype: 'tweetlist',
//                hashtag: this.twitterSearch initializeData
//            }, {
//                title: 'Location',
//                iconCls: 'locate',
//                xtype: 'location',
//                coords: this.gmapCoords,
//                mapText: this.gmapText,
//                permLink: this.gmapLink,
//            }, {
//                title: 'About',
//                xtype: 'aboutlist',
//                iconCls: 'info',
//                pages: this.aboutPages
//            }
            
            ];
        } else {
            this.on('render', function(){
                this.el.mask('No internet connection.');
            }, this);
        }
    	
    	
    	
        Ext.AceRoute.view.cfg = {};
        Ext.AceRoute.view.cfg.shortUrl = this.shortUrl;
        Ext.AceRoute.view.cfg.title = this.title;
        Ext.AceRoute.view.AppTabPanel.superclass.initComponent.call(this);
    },
    setMapObjArray: function(mapObjArr){
    	this.mapObjArray = mapObjArr;
    },
    
    setMvcController: function(controller){
    	this._controller = controller;
    },
    
    removeMapTab: function(orderMapPanel, mapId){
    	orderMapPanel.remove(mapId);
    },
    
    insertMapTab: function(appTabPanel, orderMapPanel, orderData, mapObjArray){
    	var map;
    	var _self = this;
    	var posArray = new Array();
    	if(mapObjArray != null){
    		for(var index=0;index < mapObjArray.length;index++){
    			var geoCode = mapObjArray[index].geoCode;
        		var indexOfComma = geoCode.indexOf(",");
    	    	var latitude = geoCode.substring(0, indexOfComma);
    	    	latitude = latitude.trim();
    	    	var longitude = geoCode.substring(indexOfComma+1, geoCode.length);
    	    	longitude = longitude.trim();
    	    	
    	    	var position = new google.maps.LatLng(latitude,longitude);  //Sencha HQ
    	    	posArray.push(position);
    		}
    		
    		map = new Ext.Map({
	        	id: 'mapId',
	            mapOptions : {
	                center : new google.maps.LatLng(latitude, longitude), 
	                zoom : 8,
	                mapTypeId : google.maps.MapTypeId.ROADMAP,
	                navigationControl: true,
	                navigationControlOptions: {
	                        style: google.maps.NavigationControlStyle.DEFAULT
	                    }
	            },
	            listeners : {
	                maprender : function(comp, map){
	                	var pos;
	                	for(var index=0;index < mapObjArray.length;index++){
	                		if(mapObjArray[index].geoCode){
	                			
	                			var image = new google.maps.MarkerImage(
	                					'http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|'+mapObjArray[index].iconClr+'|10|b|'+mapObjArray[index].seqLabel);
	                			//var shadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
	                			
	                			var geoCode1 = mapObjArray[index].geoCode;
	                    		var indexOfComma1 = geoCode1.indexOf(",");
	                	    	var latitude1 = geoCode.substring(0, indexOfComma1);
	                	    	latitude1 = latitude1.trim();
	                	    	var longitude1 = geoCode1.substring(indexOfComma1+1, geoCode1.length);
	                	    	longitude1 = longitude1.trim();
	                	    	
	                			var marker = new google.maps.Marker({
	                                position: posArray[index],   
	                                title : 'My Current Location',
	                                shadow: shadow,
	                                icon  : image,
	                                map: map
	                            }); 
	                			var message = "<font size='2'>"+"<b>"+mapObjArray[index].seqLabel+"</b><br/>"+  
	                			              mapObjArray[index].orderName+"<br/>"+
	                						  mapObjArray[index].orderAddress+"<br/>"+
	                						  mapObjArray[index].orderStartDate+" "+
	                						  mapObjArray[index].orderStartTime+"</font>"+
	                						  "<input type='button' name='orderDetails' value='Order' class='x-button-label' onclick='showOrderDetails("+mapObjArray[index].orderId+")'/>"+
	                						  "<input type='button' name='navigate' value='Navigate' class='x-button-label' onclick='navigate("+ latitude1 + ","+ longitude1 +")'/>";
	                			
	                			console.log(" index "+index+" message "+message);
	                			this.attachMessage(map, marker, message, appTabPanel, orderMapPanel, orderData);
	                        	pos = posArray[index];
	                        	
	                        	setTimeout( function(){ map.panTo (pos); } , 1000);
	                        }
	                }
	            },
	            scope:this
	         }
	        });
	        appTabPanel.setActiveItem(orderMapPanel, 'slide');
	        appTabPanel.doLayout();
	        orderMapPanel.add(map);
	        orderMapPanel.doLayout();
	        
    	}else{
    		var geoCode = orderData.site_geocode;
    		var site_addr = orderData.site_addr;
            var start_dateWithoutTime = orderData.start_dateWithoutTime;
           	var start_time = orderData.start_time;
           	var orderDataComplete = orderData.data;
           		
	    	var indexOfComma = geoCode.indexOf(",");
	    	var latitude = geoCode.substring(0, indexOfComma);
	    	latitude = latitude.trim();
	    	var longitude = geoCode.substring(indexOfComma+1, geoCode.length);
	    	longitude = longitude.trim();
	    	var position = new google.maps.LatLng(latitude,longitude);  //Sencha HQ
	    	
	    	var current_date = new Date();
			var start_date = new Date(orderDataComplete.start_date);
			var end_date = new Date(orderDataComplete.end_date);
			var order_wkfid = orderDataComplete.order_wkfid;
			
	    	//var commonUtil = new Ext.AceRoute.util.CommonUtil();
	    	var iconClr = CommonUtil.getIconColor(
					  current_date, start_date, end_date, order_wkfid );
	    	var image = new google.maps.MarkerImage(
					'http://chart.apis.google.com/chart?chst=d_map_spin&chld=0.75|0|'+iconClr+'|8|b|'); //+mapObjArray[index].seqLabel);
	    	
//	    	// Tracking Marker Image
//	        var image = new google.maps.MarkerImage(
//	            'img/point.png',
//	            new google.maps.Size(32, 31),
//	            new google.maps.Point(0,0),    
//	            new google.maps.Point(16, 31)
//	        );
	        
	        var shadow = new google.maps.MarkerImage(
	            'img/shadow.png',       
	            new google.maps.Size(64, 52),
	            new google.maps.Point(0,0),
	            new google.maps.Point(-5, 42)
	        );
	        
//	        var shadow2 = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
	        map = new Ext.Map({
	        	id: 'mapId',
	            mapOptions : {
	                center : new google.maps.LatLng(latitude, longitude), 
	                zoom : 8,
	                mapTypeId : google.maps.MapTypeId.ROADMAP,
	                navigationControl: true,
	                navigationControlOptions: {
	                        style: google.maps.NavigationControlStyle.DEFAULT
	                    }
	            },
	//            plugins : [
	//                new Ext.plugin.GMap.Tracker({
	//                    trackSuspended : true,   //suspend tracking initially
	//                    highAccuracy   : false,
	//                    marker : marker
	//                }),   
	//                new Ext.plugin.GMap.Traffic({ hidden : true })
	//            ], 
	            listeners : {
	            	_self: this,
	                maprender : function(comp, map){
	//                	var marker = new google.maps.Marker({
	//                        position: position,   
	//                        title : 'My Current Location',
	//                        shadow: shadow,
	//                        icon  : image,
	//                        map: map
	//                      }); 
	////                	
	                	var marker = new google.maps.Marker({
	                        position: position,   
	                        title : 'My Current Location',
	                        shadow: shadow,
	                        icon  : image,
	                        map: map
	                      }); 
	                	
	                	var message = "<font size='2'>"+  
	                		site_addr.formatAddress(",")+"<br/>"+
	                		start_dateWithoutTime+" "+
	                		start_time+"</font>"+
	                		"<input type='button' name='orderDetails' value='Order' class='x-button-label' onclick='showOrderDetails("+orderData.data.id+")'/>"+
	                		"<input type='button' name='navigate' value='Navigate' class='x-button-label' onclick='navigate("+ latitude + ","+ longitude +")'/>";
						
						this.attachMessage(map, marker, message, appTabPanel, orderMapPanel, orderData);
	//                    
	//                    google.maps.event.addListener(marker, 'click', function() {
	//                         infowindow.open(map, marker);
	//                    });
	//
	                    setTimeout( function(){ map.panTo (position); } , 1000);
	                },
	                scope: this
	            }
	        });
	        appTabPanel.setActiveItem(orderMapPanel, 'slide');
	        appTabPanel.doLayout();
	        orderMapPanel.add(map);
	        orderMapPanel.doLayout();
    	}        
    },
    
    refreshSystemData: function(){
    	var systemOperationOptionSelected = this.systemOperationOptionSelected;
    	if(typeof systemOperationOptionSelected !== 'undefined'){
    		if(systemOperationOptionSelected == 'refreshOrders'){
    			var orderListTab = this.getComponent('orderListXmlId');
    			if(typeof orderListTab !== 'undefined'){
    				var dateData = orderListTab.dateButtons.items.get(0).dateData;
    				var dateDataString = dateData.toString().replaceAll('-','/');
    				orderListTab.changeDateString(dateDataString, dateData);
    			}
    		}
    	}
    },
    
    logout: function(){
//    	Ext.getCmp('orderListXmlId').destroy();
    	//Ext.getCmp('editOrderPanelOuterId').hide();
    	if(typeof Ext.getCmp('loginViewPanelId') !== 'undefined'){
    		Ext.getCmp('loginViewPanelId').destroy();
    	}
    	Ext.getCmp('systemPanelId').destroy();
    	try{
    		Ext.getCmp('appTabPanel').destroy();
    	}catch(err){
    		console.log('error while destroying appTabPanel '+err);
    	}
    	//loginController.loginView.loginPanelRef.destroy();
		new Ext.AceRoute.controller.LoginController(); 
		Ext.getCmp('loginViewPanelId').doComponentLayout();
//    	try{
//    		loginController.loginView.loginPanelRef.doComponentLayout(); //Ext.getCmp('loginViewId');
//    	}catch(err){
//    		
//    	}
//    	try{
//    		loginController.loginView.loginPanelRef.items.items[1].doComponentLayout(); //Ext.getCmp('loginViewId');
//    	}catch(err){
//    		
//    	}
		// now go onto the main app display
		
    },
    
    attachMessage: function(map, marker, message,appTabPanel, orderMapPanel, orderData){
    	appTabPanelGlobal = appTabPanel;
    	orderMapPanelGlobal = orderMapPanel;
    	orderDataGlobal = orderData;
    	
    	var infowindow = new google.maps.InfoWindow(
	      { content: message,
	        size: new google.maps.Size(30,30)
	        
	      });
	    
    	google.maps.event.addListener(marker, 'click', function() {
	       infowindow.open(map,marker);
	    });
    }
});


	   
  