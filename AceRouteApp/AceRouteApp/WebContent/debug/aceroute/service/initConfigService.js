Ext.ns('Ext.AceRoute.service');

// this service is for getting the config data from server
Ext.AceRoute.service.InitConfigService = Class.extend({
    
	init: function()
    {
		// here this service can go and fetch the latest config from the server
		this.initialzed = true;
		this.serviceCompleted = false;
    },
    
    startService: function(){
    	// go get the latest config from service
    	
    	// if not able to get the latest config from server, then check in the localstorage for the last saved client_mobi config, 
    	// if it's not there then use default otherwise use the one from localstorage;  
    	
    	// client_mobi = '0|5|15|30'
    	// 1. First number designates if geo-location is enabled. In above case, it is not enabled. 
    	// 2. Second number designates how often to record geo-location, above very 5 mins. 
    	// 3. Third: How often to send, above every 15 mins
    	// 4. Fourth number designates, how often to to fetch new order, above 30 mins
    	// If unable to fetch config, the use from last time. If not then use default.
    	
    	 
		var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
		 // https://acerouteqa.appspot.com/mobi?mtoken=aceroute.com|88001|7F00000101373F0EEC9F2FAC01593CE6&
		 //       action=saveresgeo&
		 //		  res_id=88001&
		 //		  geocode=200,200|300,300|400,400&
		 //       geo_time=1332403691938|1332403691940|1332403691950
		var textData = ajaxUtil.invokeUrlAndGetAsText(
				Ext.AceRoute.appUrl+"?action=getclient"+"&mtoken="+Ext.AceRoute.loginref);
		doc = new DOMParser().parseFromString(textData, "text/xml");
		console.log(' textData '+textData);
    	var configDataFromServer = doc.childNodes[0].childNodes[0].childNodes[3].firstChild.data; // get this from server // TODO
    	console.log(' configDataFromServer '+configDataFromServer);
    	if(typeof configDataFromServer !== 'undefined'){
    		console.log('initConfig Step 1, geolocation service config found from server.');
    		Ext.AceRoute.initConfig.geoLocation.client_mobi = configDataFromServer;
    		localStorage.setItem("client_mobi", Ext.AceRoute.initConfig.geoLocation.client_mobi );
    	}else{
    		if(typeof localStorage.getItem("client_mobi") !== 'object'){
    			console.log('initConfig Step 2, geolocation service config found in local storage.');
    			// there is an entry in the localstorage
    			Ext.AceRoute.initConfig.geoLocation.client_mobi = 
    				localStorage.getItem("client_mobi");
    		}else{
    			console.log('initConfig Step 3, geolocation service config will use default config.');
    			Ext.AceRoute.initConfig.geoLocation.client_mobi = 
    				Ext.AceRoute.initConfig.geoLocation.client_mobi_default;
    		}
    	}
    	
    	var configTokens = Ext.AceRoute.initConfig.geoLocation.client_mobi.split( "|" );
    	Ext.AceRoute.initConfig.geoLocation.isEnabled = configTokens[0];
    	Ext.AceRoute.initConfig.geoLocation.intervalToRecordGeoLoc = configTokens[1];
    	Ext.AceRoute.initConfig.geoLocation.intervalToSendGeoLoc = configTokens[2];
    	Ext.AceRoute.initConfig.geoLocation.intervalToFetchNewOrders = configTokens[3];
    	
    	if(typeof Ext.AceRoute.initConfig.geoLocation.intervalToRecordGeoLoc === 'undefined'){
    		Ext.AceRoute.initConfig.geoLocation.intervalToRecordGeoLoc = 5; // default 5 mins
    	}
    	
    	if(typeof Ext.AceRoute.initConfig.geoLocation.intervalToSendGeoLoc === 'undefined'){
    		Ext.AceRoute.initConfig.geoLocation.intervalToSendGeoLoc = 15; // default 15 mins
    	}
    	
    	console.log('Ext.AceRoute.initConfig.geoLocation.isEnabled:'+
    			Ext.AceRoute.initConfig.geoLocation.isEnabled);
    	console.log('Ext.AceRoute.initConfig.geoLocation.intervalToRecordGeoLoc:'+
    			Ext.AceRoute.initConfig.geoLocation.intervalToRecordGeoLoc);
    	console.log('Ext.AceRoute.initConfig.geoLocation.intervalToSendGeoLoc:'+
    			Ext.AceRoute.initConfig.geoLocation.intervalToSendGeoLoc);
    	
    	this.serviceCompleted = true;
    }
    
});