
showOrderDetails = function(orderId){
	appTabPanelGlobal = appTabPanelGlobal;
	var appTabPanel = Ext.getCmp('appTabPanel');
	var orderListXmlPanel = Ext.getCmp('orderListXmlId');
	var orderStore = Ext.StoreMgr.get('orderStore');
	//orderId = orderId + '';
	var index = orderStore.findExact('id',orderId.toString());
  	var dataMatch = orderStore.getAt(index);
    var data = dataMatch.data;
    
    var orderStoreUpdate = new Ext.data.Store({ 
        model: "Order",
        storeId: "orderStoreUpdateId",
        proxy: {
            type: "localstorage",
            id: "id"            
        }
    });
    
    sessionCard = orderListXmlPanel.createEditOrderComp(data, orderStoreUpdate);
    // submit(url, reloadEntitiesSuccess, failure, messages, arguments);
    // Tell the parent panel to animate to the new card
    
    orderListXmlPanel.setActiveItem(sessionCard, 'slide');
    
    appTabPanel.setActiveItem(orderListXmlPanel, 'slide');
    appTabPanel.doLayout();
    orderListXmlPanel.doLayout();
    
    //appTabPanel1.doLayout();
    
	//alert('showOrderDetails');
}

navigateOnClick = function(orderId){
	
	var orderStore = Ext.StoreMgr.get('orderStore');
	//orderId = orderId + '';
	var index = orderStore.findExact('id',orderId.toString());
  	var dataMatch = orderStore.getAt(index);
    var data = dataMatch.data;
    
    var orderData = {
	    site_addr: data.site_addr,
       	site_geocode: data.site_geocode,
        start_dateWithoutTime: data.start_dateWithoutTime,
       	start_time: data.start_time,
       	data: data
	}; 
	var orderListXmlPanel = Ext.getCmp('orderListXmlId');
	orderListXmlPanel.showOrderAddressOnMap(orderData);
}

navigate = function(dLat, dLong){
	var currStartLat;
	var currStartLong;
	
	function success1 (position) {
	  currStartLat = position.coords.latitude; //'37.573664468203766'; 
	  currStartLong = position.coords.longitude; //'-122.06402778625488'; // 
	  window.plugins.navigationPlugin.navigate(currStartLat, 
	    		currStartLong , 
	    		dLat, dLong ,
	       function(r){},
	       function(e){
	    	   //alert(e)
	       }
	  );
  	}

    function error1(msg) { 
    }
	   
    if (navigator.geolocation) {
  	   navigator.geolocation.getCurrentPosition(success1, error1);
    } 
}

callAPhone = function(phone){
	
	if(typeof phone === 'undefined'){
		var orderListXmlPanel = Ext.getCmp('orderListXmlId');
		var orderStore = Ext.StoreMgr.get('orderStore');
		
		var currentOrderIndex = orderListXmlPanel.indexOfCurrentOrderSelected;
		var totalItemsInStore = orderStore.getCount();
		
		if((currentOrderIndex) < totalItemsInStore){
			orderListXmlPanel.indexOfCurrentOrderSelected = currentOrderIndex;
			var dataMatch = orderStore.getAt(currentOrderIndex);
		    var data = dataMatch.data;
		}
		
		var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
	    
	    var custContactXmlData = ajaxUtil.invokeUrlGetXml(
				Ext.AceRoute.appUrl+"?action=getcontact&cust_id="+data.cust_id+"&mtoken="+Ext.AceRoute.loginref);
	    var custContactStore
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: 'CustomerContact',
			    data : custContactXmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: 'contact'
			        }
			    }
			});
	    
	    var contactPhone = ''; 
	    
		var index = custContactStore.findExact('cust_id',data.cust_id);
		var dataMatch = custContactStore.getAt(index);
		if(typeof dataMatch !== 'undefined'){
			var d = dataMatch.data;
		    //console.log(' Order Priority '+d.priorityType);
		    contactPhone = d.contact_phone;
		}
		contactPhone = '7087246255';
		document.location.href = 'tel:'+contactPhone;
	
	}else{
		document.location.href = 'tel:'+phone;
	}
}