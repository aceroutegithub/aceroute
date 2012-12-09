Ext.ns('Ext.AceRoute.service');

Ext.AceRoute.service.GeoLocationService = Class.extend({
     
	init: function()
    {
		//var xmlWrapper1 = "<geolocation></geolocation>";
		var xmlWrapper1 = '';
		var xmlWrapperDoc1 = ''; // XmlUtil.createXmlDocument(xmlWrapper1);
		
		this.dataToCollectIntervalinMin = Ext.AceRoute.initConfig.geoLocation.intervalToRecordGeoLoc;
		this.dataToSendIntervalinMin = Ext.AceRoute.initConfig.geoLocation.intervalToSendGeoLoc;
		
		this.dataToCollectIntervalinMillis = this.dataToCollectIntervalinMin * 60 * 1000; // min * sec * milli secs
		this.dataToSendIntervalinMillis = this.dataToSendIntervalinMin * 60 * 1000; // min * sec * milli secs
    	
		this.xmlDoc = {
			xmlWrapper: xmlWrapper1,	
			xmlWrapperDoc: xmlWrapperDoc1
		};
		
		// here this service can go and fetch the latest config from the server
		this.initialzed = true;
    },
    
    startService: function(){
    	// 1. every 5 mins we have to get geo location, do it three times and then send the data to server. 
    	// 2. if sent successfully, then cleanup the local storage
    	//    else store it locally
    	// 3. repeat 1
    	 Ext.AceRoute.isGeoRecorderServiceRunning = true;
    	 var retrieveData = function(index, 
    			 delayToSendData, 
    			 callback, 
    			 delayToCollectData, 
    			 xmlWrapperDoc,
    			 geoDataCollected){
    		   console.log(' retrieveData delayToSendData '+delayToSendData);
    		   
    		   setTimeout(
						  function(){
							   callback();
						  },
						  delayToSendData);
			   
			   var collectData = function(i, delayToCollectData, callbackFunc ){
				   var locationXmlData;
				   function success (position) {
				  	  var lat = position.coords.latitude;
				  	  var lng = position.coords.longitude;
				  	  //locationXmlData = '<location><longitude>'+lng+'</longitude><latitude>'+lat+'</latitude></location>';
				  	  locationXmlData = lng+','+lat;
				  	  if(typeof locationXmlData !== "undefined"){
						  //var xmlWrapperDoc2 =  xmlWrapperDoc.xmlDoc + "|"+ locationXmlData; //XmlUtil.appendNode(xmlWrapperDoc.xmlDoc, locationXmlData); 
				  		   if(typeof xmlWrapperDoc.xmlDoc !== "undefined" &&
				  				 xmlWrapperDoc.xmlDoc != ''){
				  			   xmlWrapperDoc.xmlDoc =  xmlWrapperDoc.xmlDoc + "|"+ locationXmlData;
				  		   }else{
				  			   xmlWrapperDoc.xmlDoc =  locationXmlData;
				  		   }
				  		   var currentTime = CommonUtil.convertToUTC(new Date());
				      	   indexOfZero = currentTime.indexOf("-00");
				  	       var tsStampSub = currentTime.substring(0,indexOfZero);
				  	       tsStampSub = tsStampSub+"GMT+0000";
				  	       console.log(' tsStampSub '+tsStampSub);
				      	   var tsStamp = new Date(tsStampSub).getTime();
				      	   
				      	   if(typeof xmlWrapperDoc.time !== "undefined" &&
				      			 xmlWrapperDoc.time != ''){
				      		 xmlWrapperDoc.time = xmlWrapperDoc.time + "|" + tsStamp;
				      	   }else{
				      		 xmlWrapperDoc.time = tsStamp;
				      	   }
				      	   
						   console.log(' xmlWrapperDoc.xmlDoc '+xmlWrapperDoc.xmlDoc);
						   console.log(' xmlWrapperDoc.time '+xmlWrapperDoc.time);
					  }
				   }

				   function error(msg) {
				   }
				   
				   if (navigator.geolocation) {
			    	  navigator.geolocation.getCurrentPosition(success, error);
			       } 
				   
				   setTimeout(
						function(){
							  callbackFunc();
						},
						delayToCollectData
					);
			   };
			   
			   var geoLocationDataCollector = {
					 curVal1: 0,
					 endVal1: 3, // just let this run only once, use value "1" only for testing
					 run: function(){ 
						  if (this.curVal1 == this.endVal1){
							  geoDataCollected.isDataCollected = true;
							  return;
						  }
						  var self = this;
						  collectData(this.curVal, 
								  delayToCollectData, 
								  function(){self.run()}
						  		);
						  ++this.curVal1;
					 }
			   };
			   
			   geoLocationDataCollector.run();
	    };
    	
		var geoLocationSender = {
			 curVal: 0,
		     endVal: 1,
		     geoDataCollected: {
		    	 isDataCollected: false
		     },
		     xmlWrapper: {
		    	 xmlDoc: undefined,
		    	 time: undefined
		     },
		     xmlWrapperLastSent: {
		    	 xmlDoc: undefined,
		    	 time: undefined
		     },
			 run: function(){
				  
				 var currentTime = new Date();
				 var currentHour = currentTime.getHours();
				 console.log(' currentHour '+currentHour);
				 if(!(parseInt(currentHour) >= 9 && parseInt(currentHour) <= 24 )){ // TODO: remember to put "NOT" condition
					 console.log(' let the job get over... ');
					 //alert(XmlUtil.serializeToString(this.xmlWrapper.xmlDoc));
					 Ext.AceRoute.isGeoRecorderServiceRunning = false;
					 return; // TODO: remember to uncomment
				 }
				 
				 if(typeof this.xmlWrapper.xmlDoc !== "undefined"){
					 // that means job has been run, and the data has been collected so send the data to the server
					 if(typeof this.xmlWrapperLastSent.xmlDoc === "undefined"){
						 console.log(' this.xmlWrapperLastSent.xmlDoc === "undefined" ');
						 this.xmlWrapperLastSent.xmlDoc = this.xmlWrapper.xmlDoc;
						 this.xmlWrapperLastSent.time = this.xmlWrapper.time;
					 }
					 
					 // compare if the last sent Geo data is same as the current one then dont send 
					 // the current geo data to the server
					 if(typeof this.xmlWrapperLastSent.xmlDoc !== "undefined"){
						 var xmlDocStrCurrent = this.xmlWrapper.xmlDoc; //XmlUtil.serializeToString(this.xmlWrapper.xmlDoc);
						 var xmlDocStrLastSent = this.xmlWrapperLastSent.xmlDoc; //XmlUtil.serializeToString(this.xmlWrapperLastSent.xmlDoc);
						 
						 var timeStrCurrent = this.xmlWrapper.time; //XmlUtil.serializeToString(this.xmlWrapper.xmlDoc);
						 var timeStrLastSent = this.xmlWrapperLastSent.time; //XmlUtil.serializeToString(this.xmlWrapperLastSent.xmlDoc);
						 
						 // both this.xmlWrapperLastSent.xmlDoc and
						 console.log(' xmlDocStrCurrent '+xmlDocStrCurrent);
						 console.log(' xmlDocStrLastSent '+xmlDocStrLastSent);
						 
						 console.log(' timeStrCurrent '+timeStrCurrent);
						 console.log(' timeStrLastSent '+timeStrLastSent);
						 
						 if(xmlDocStrCurrent != xmlDocStrLastSent){
							 this.xmlWrapperLastSent.xmlDoc = xmlDocStrCurrent;
							 this.xmlWrapperLastSent.time = timeStrCurrent;
							 
							 // send the current geo data to server
							 console.log(' Sending xmlDocStrCurrent to server ');
							 
							 var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
							 var urlToPostDataTo = Ext.AceRoute.appUrl + 
							 		  "?mtoken="+Ext.AceRoute.loginref+
							 		  "&action=saveresgeo"+
							 		  "&res_id="+Ext.AceRoute.resId+
							 		  "&geocode="+this.xmlWrapperLastSent.xmlDoc+
							 		  "&geo_time="+this.xmlWrapperLastSent.time;
							 
							 console.log(' saveresgeo, urlToPostDataTo ==> '+urlToPostDataTo);
				             var operationStatus = ajaxUtil.invokeUrlAndGetAsText(urlToPostDataTo);
				             console.log(' saveresgeo, operationStatus ==> '+operationStatus);
						 }
						 // reset
						 var xmlWrapperTags = ''; //"<geolocation></geolocation>";
						 this.xmlWrapper.xmlDoc = xmlWrapperTags; //XmlUtil.createXmlDocument(xmlWrapperTags);
						 this.xmlWrapper.time = '';
					 }
				 }
				 
				 if (this.curVal == this.endVal){
//					  // 1. once data is retrieved, send it. 2. If the send fails then store this data in localstore and once 
//					  // connection is alive or the app is back online, send it again.
//					  // 3. And once the send is successful, clean the data up from localstore.
//					  alert(XmlUtil.serializeToString(this.xmlWrapper.xmlDoc));
					  return;
				  }
				  var self = this;
				  retrieveData(this.curVal,  
						  this.dataToSendIntervalinMillis, 
						  function(){self.run()}, 
						  this.dataToCollectIntervalinMillis, 
						  this.xmlWrapper,
						  this.geoDataCollected);
				  ++this.curVal;
			 }
		};
		geoLocationSender.dataToSendIntervalinMillis = this.dataToSendIntervalinMillis;
		geoLocationSender.dataToCollectIntervalinMillis = this.dataToCollectIntervalinMillis;
		
		geoLocationSender.xmlWrapper.xmlDoc = this.xmlDoc.xmlWrapperDoc;
		geoLocationSender.xmlWrapper.time = this.xmlDoc.time;
		
		geoLocationSender.run();
    }
    
});