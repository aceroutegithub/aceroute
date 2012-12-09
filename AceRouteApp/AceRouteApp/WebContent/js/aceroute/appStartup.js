AceRoute = {};
AceRoute.appBaseUrl = 'http://192.168.0.4:8080/AceRouteMobile';
AceRoute.appUrl = AceRoute.appBaseUrl+'/dataReceiver.jsp';   
AceRoute.appUrlPost = AceRoute.appBaseUrl+'/dataReceiverPostAuthQA.jsp';

AceRoute.isDevSystem = true; 
AceRoute.numberOfDaysForwardAndBackward = 2;
AceRoute.orderSearchFromDate = '';
AceRoute.orderSearchToDate = '';
AceRoute.currentOrderSearchDate = '';
 
var customerXmlDataStore;
var customerSiteXmlDataStore;
var orderTypeXmlDataStore;
var partTypeXmlDataStore;
var resourceXmlDataStore;
var taskTypeTypeXmlDataStore;
var orderStatusTypeXmlDataStore;
var orderPriorityTypeXmlDataStore;

var ordersXmlDataStore;
var orderTasksXmlStore;
var orderPartsXmlStore;
var orderResourceXmlStore;
var orderPicsXmlStore;
var orderSignatureXmlStore;

var mtoken = 'aceroute.com|234001|7F000001013A567DEC4E05EA00AB436D';
//AceRoute.appUrl = 'https://acerouteqa.appspot.com/mobi';   
//AceRoute.appUrlPost = 'https://acerouteqa.appspot.com/mobi';
//AceRoute.appUrlImageGet = 'https://acerouteqa.appspot.com/mobi';   

var isAddNewOrderDetailPageCreated = 0;
var isAddNewOrderCustomerPageCreated = 0;
var isAddNewOrderDatePageCreated = 0;
var isAddNewOrderStatusPageCreated = 0;

jQuery.extend({
    getValues: function(url){
        var result = null;
        $.ajax(
            {
                url: url,
                type: 'get',
                dataType: "xml",
                async: false,
                cache: false,
                success: function(data) 
                {
                    result = data;
                }
            }
        );
       return result;
    }
});

$(document).ready(function(){
	initApplication();
});

var cityList = [
    ['Chicago', 41.850033, -87.6500523, 1],
    ['Illinois', 40.797177,-89.406738, 2]
];

var demoCenter = new google.maps.LatLng(41,-87);

var map;

function detectBrowser() {
	var useragent = navigator.userAgent;
	var mapdivMap = document.getElementById("map_canvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
		mapdivMap.style.width = '100%';
		mapdivMap.style.height = '100%';
	} else {
		mapdivMap.style.width = '600px';
		mapdivMap.style.height = '800px';
	}
};
	
function displayMap(orderData, centerLatLng, latitude, longitude)
{
	//detectBrowser();
	var shadow = new google.maps.MarkerImage(
            'img/shadow.png',       
            new google.maps.Size(64, 52),
            new google.maps.Point(0,0),
            new google.maps.Point(-5, 42)
        );
	function mapObj(){
		   this.geoCode;
		   this.seqLabel;
		   this.iconClr;
		   this.orderStartDate;
		   this.orderStartTime;
		   this.orderAddress;
		   this.orderName;
	}
	var startDate = orderData.find('start_date').text();
	var endDate = orderData.find('end_date').text();
	var startTime = getTime(startDate);
 	var endTime = getTime(endDate);
 	
	var order_wkfid = orderData.find('order_wkfid').text();
	var orderId = orderData.find('id').text();
	var siteAddr = orderData.find('site_addr').text();
	
	var orderName = orderData.find('order_name').text();
	var orderPO = orderData.find('order_po').text();
	var site_geocode = orderData.find('site_geocode').text();
	
	var resourceId = orderData.find('res_id').text();
	var resourceData = findDataById(resourceXmlDataStore,
			'data', 'res','res_id', resourceId);
	var resourceName = $(resourceData).find('res_name').text();
	
	var custContactId = orderData.find('cust_contactid').text();
	var custData = findDataById(customerXmlDataStore,
			'data', 'cust','cust_id', custContactId);
    var custName = $(custData).find("cust_name").text();
	
	var current_date = new Date();
	var start_date = new Date(startDate);
	var end_date = new Date(endDate);
	var iconClr = CommonUtil.getIconColor(
			  current_date, start_date, end_date, order_wkfid );
	
	var image = new google.maps.MarkerImage(
			'http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|'+iconClr+'|10|b|1');  
	var shadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
	//var shadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
	
    map = new google.maps.Map(
		document.getElementById('map_canvas_basic_map'), 
		{
	       zoom: 8,
	       center: centerLatLng,
	       mapTypeId: google.maps.MapTypeId.ROADMAP,
	       navigationControl: true,
	       navigationControlOptions: {
	           style: google.maps.NavigationControlStyle.DEFAULT
	       }
		}
	);
    var mObj = new mapObj();
	
	mObj.seqLabel = '';
	mObj.startTime = startTime;
    mObj.endTime = endTime;
    mObj.orderAddress = siteAddr.formatAddress(",");;
    mObj.orderId = orderId;
    mObj.orderName = orderName;
    mObj.orderPO = orderPO;
    mObj.resourceName = resourceName;
    mObj.custName = custName;
    
	var message = getMarkerMessage( mObj,
				latitude,
				longitude
			);
	
    var marker = new google.maps.Marker({
        position: centerLatLng,   
        title : 'Order Location',
        shadow: shadow,
        icon  : image,
        map: map
    });
    attachMessage(message, map, marker);
//    var message = "<font size='2'>"+  
//		"<input type='button' name='orderDetails' value='Edit' class='x-button-label' onclick='showOrderDetails(\'"+orderId+"\')'/>"+
//		"<input type='button' name='navigate' value='Navigate' class='x-button-label' onclick='navigate("+ latitude + ","+ longitude +")'/>";
//    var infowindow = new google.maps.InfoWindow(
//  	      { content: message,
//  	        size: new google.maps.Size(30,30)
//  	      }); 
//  	google.maps.event.addListener(marker, 'click', function() {
//       infowindow.open(map,marker);
//    });
}

//function addMarkers()
//{
//    var marker, i;
//    var infowindow = new google.maps.InfoWindow();
//    for (i = 0; i < cityList.length; i++) 
//    {  
//        marker = new google.maps.Marker({
//            position: new google.maps.LatLng(cityList[i][1], cityList[i][2]),
//            map: map,
//            title: cityList[i][0]
//        });
//
//        google.maps.event.addListener(marker, 'click', (function(marker, i) {
//            return function() {
//                infowindow.setContent(cityList[i][0]);
//                infowindow.open(map, marker);
//            }
//        })(marker, i));
//    }
//}

//$(document).ready(function() 
//{
//    $('.add-markers').click(function() {
//        addMarkers();
//    });
//});

function navigateMap(orderId){
	
	var orderData = findDataById(ordersXmlDataStore,
			'data', 'event','id', orderId);
    var siteGeoCode = $(orderData).find("site_geocode").text();
    console.log('siteGeoCode '+siteGeoCode);
    var indexOfComma = siteGeoCode.indexOf(",");
	var latitude = siteGeoCode.substring(0, indexOfComma);
	latitude = latitude.trim();
	var longitude = siteGeoCode.substring(indexOfComma+1, 
			siteGeoCode.length);
	longitude = longitude.trim();
	console.log('latitude '+latitude);
	var centerLatLng = new google.maps.LatLng(latitude,longitude);
    
	displayMap(orderData, centerLatLng, latitude, longitude);
	
}


//$('#gotoMapHref').live('click', function() {
//	if(navigator.geolocation) {
//		initialize()
//	}else{
//		initialize()
//	}
//});

////Following event is added to the top level navigation bars/tabs
// $('div[id="nav1"] a').live(
//         'click',
//         function() {
//             $(this).addClass('ui-btn-active');
//             $('div.content_div').hide();
//             $('div.def_content_div').hide();
//             $('div#' + $(this).attr('data-href')).show();
//             //The following line will show the div associated with the default subtab of the current tab (which was clicked)
//             //e.g "main" is the default subtab for the "headers" tab.
//             $('div#' + $(this).attr('data-href')).children(
//                     '[class="def_sub_content_div"]').show();
//
//         });
// //Following event is addred to the subtabs navigation bar which will show the div associated with it when clicked.
// $('div[id="nav2"] a').live('click', function() {
//     $(this).addClass('ui-btn-active');
//     $('div.sub_content_div').hide();
//     $('div.def_sub_content_div').hide();
//     $('div#' + $(this).attr('data-href')).show();
// });
 
 $("a[data-role=tab]").each(function () {
	    var anchor = $(this);
	    anchor.bind("click", function () {
	        $.mobile.changePage(anchor.attr("href"), {
	            transition: "none",
	            changeHash: false
	        });
	        return false;
	    });
	});

	$("div[data-role=page]").bind("pagebeforeshow", function (e, data) {
	    $.mobile.silentScroll(0);
	});
	
 function initApplication(){
	 
	 var timeForwardAndBackward = AceRoute.numberOfDaysForwardAndBackward * 24 * 60 * 60 * 1000; 
	 AceRoute.orderSearchFromDate = new Date((new Date()).getTime() - timeForwardAndBackward ); 
	 AceRoute.orderSearchToDate = new Date((new Date()).getTime() + timeForwardAndBackward );
	 
	 AceRoute.currentOrderSearchDate = new Date();
		 
	 AceRoute.orderSearchFromDateStr =
		 AceRoute.orderSearchFromDate.getFullYear() + "-"
	    	+ (AceRoute.orderSearchFromDate.getMonth()+1) + "-"
	    	+ AceRoute.orderSearchFromDate.getDate();
	    	
	 AceRoute.orderSearchToDateStr =
		 AceRoute.orderSearchToDate.getFullYear() + "-"
	    	+ (AceRoute.orderSearchToDate.getMonth()+1) + "-"
	    	+ AceRoute.orderSearchToDate.getDate();
	 
	 AceRoute.currentOrderSearchDateStr = AceRoute.currentOrderSearchDate.getFullYear() + "-"
		 	+ (AceRoute.currentOrderSearchDate.getMonth()+1) + "-"
			+ AceRoute.currentOrderSearchDate.getDate();
	 
	 console.log(' AceRoute.orderSearchFromDate '+AceRoute.orderSearchFromDateStr);
	 console.log(' AceRoute.orderSearchToDate '+AceRoute.orderSearchToDateStr);
	 
	 loadRefData();
	 loadOrders();
 }
 
 function loadRefData(){
	 customerXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getcustlist");
	 orderTypeXmlDataStore = $.getValues("orderType.xml");  //AceRoute.appUrl+"?mtoken="+mtoken+"&action=getordertype");
	 partTypeXmlDataStore = $.getValues("orderPartType.xml"); //AceRoute.appUrl+"?mtoken="+mtoken+"&action=getparttype");
	 resourceXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getres");
	 taskTypeTypeXmlDataStore = $.getValues("orderTaskType.xml"); //AceRoute.appUrl+"?mtoken="+mtoken+"&action=gettasktype");
	 orderStatusTypeXmlDataStore = $.getValues("orderStatusType.xml"); // no action url
	 orderPriorityTypeXmlDataStore = $.getValues("orderPriorityType.xml");  // no action url
 }
 
 function findDataById(xmlDataStore,
		 dataNodeName, 
		 childDataNodeName,
		 idNodeName, 
		 idValue){
	 
	 var returnObj;
	 $(xmlDataStore).find(dataNodeName).each(function(){
		$(this).find(childDataNodeName).each(function(){
			var idV = $(this).find(idNodeName).text();
			if(typeof idV !== "undefined"){
				idV = idV.trim();
			}
			if(idV === idValue){
				returnObj = $(this);
			}
		 });
	 });
	 return returnObj;
 }
 
 function setOrderResourceIdInSession(resourceId){
	 sessionStorage.resourceId = resourceId;
 }
 
 function loadOrders(){
	console.log(' inside loadOrders() ');
	var loaded = false;
//	 https://acerouteqa.appspot.com/mobi?mtoken=aceroute.com|88001|7F0000010137EC110B09B0B100A1E9B0&
//	 action=getorders&tz=US/Pacific&from=2012-01-30&to=2012-10-31&
	var getOrdersStr = AceRoute.appUrl+
	 	"?mtoken="+mtoken+"&action=getorders&tz=US/Pacific&from="+AceRoute.orderSearchFromDateStr+"&to="+AceRoute.orderSearchToDateStr;
	
	console.log(' getOrdersStr '+getOrdersStr);
	ordersXmlDataStore = $.getValues(getOrdersStr); //"orders.xml");
	 
	var htmlStr = '';
	$(ordersXmlDataStore).find('data').each(function(){
		$(this).find('event').each(function(){
			var orderData = $(this);
			
//			var cust_id = orderData.find('cust_id').text();
			var id = orderData.find('id').text();
			var orderName = orderData.find('order_name').text();
			var siteAddr = orderData.find('site_addr').text();
			var orderTypeId = orderData.find('order_typeid').text();
			
			siteAddr = siteAddr.formatAddress(',');
//			var custData = findDataById(customerXmlDataStore,
//					'data', 'cust','cust_id', cust_id);
		    var custName = $(orderData).find("cust_name").text();
//		    var custContactXmlStore = $.getValues(AceRoute.appUrl+
//					 "?mtoken="+mtoken+"&action=getcontact&cust_id="+cust_id);
//		    var custContactData = findDataById(custContactXmlStore,
//					'data', 'contact','cust_id', cust_id);
		    var contactName = $(orderData).find("contact_name").text();
		    
		    var orderTypeData = findDataById(orderTypeXmlDataStore,
					'data', 'ordertype','ordertype_id', orderTypeId);
		    var orderTypeName = $(orderTypeData).find("ordertype_name").text();
		    
			// ui-collapsible ui-collapsible-inset
			//htmlStr = '<h2>Filtered list</h2>'; 
			var startDate = orderData.find('start_date').text();
			var endDate = orderData.find('end_date').text();
			var startTime = getTime(startDate);
		 	var duration = getOrderDuration(startDate, endDate);
			
		 	htmlStr = htmlStr + 
			 	'<li style="padding: 0.8em 15px;">'+
			 		'<div class="orderlistOuterWrapper">'+
						'<div style="float: left;">'+
							'<div><label style="background-color:black;color:blue">'+startTime+'&nbsp;'+'</label></div>'+
							'<div><label style="background-color:black;color:blue">'+duration+' hrs&nbsp;</label></div>'+
							'<div><label>&nbsp;</label></div>'+
							'<div><label>&nbsp;</label></div>'+
						'</div>'+
						'<div>'+
							'<div class="orderlistOuterSecond">'+
								'<a href="#orderdetail" style="text-decoration: none;"'+
									' onclick="sessionStorage.order_id='+id+'">'+orderName+'</a>'+
							'</div>'+
							'<div class="orderlistOuterSecond">'+
								'<a href="#orderdetail" style="text-decoration: none;"'+
									'onclick="sessionStorage.order_id='+id+'">'+custName+'</a>'+
							'</div>'+
							'<div class="orderlistOuterSecond">'+
								'<a href="#orderdetail" style="text-decoration: none;"'+
									'onclick="sessionStorage.order_id='+id+'">'+siteAddr+'</a>'+
							'</div>'+
							
						'</div>'+	
					'</div>'+
					'<div>'+
						'<div><label>'+orderTypeName+'&nbsp;'+'</label></div>'+
						'<div><label>&nbsp;</label></div>'+
					'</div>'+
				    '<div data-role="navbar" class="ui-navbar ui-mini">'+
	                    '<ul class="ui-grid-a">'+
	                    	'<li class="ui-block-a" >'+
	                    		'<img alt="" src="img/phone.jpg" onclick="callAPhone()" height="30" width="50" />'+
	                    		'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
	                    		'<a id="gotoMapHref" href="#basic-map" data-transition="slide"><img src="img/maps1.png" onclick="navigateMap(\'' +id+ '\')" height="30" width="50"></a>'+
	                    	'</li>'+
	                    '</ul>'+
	                '</div>'+
	      	     '</li>';
		});
	});
	var orders_list = $('#orderlist ul');
	//orders_list.empty();
	//orders_list.html(htmlStr);
	orders_list.html(htmlStr);
//	setTimeout(1000, function(){ });
	if (orders_list.hasClass('ui-listview')) {
	    //this listview has already been initialized, so refresh it
		orders_list.listview('refresh');
	} else {
	    //this listview has not yet been initialized, so it gets initialized
		orders_list.listview();//or you can use .trigger('create');
	}
//	.listview('refresh');//trigger("create"); //.trigger("refresh");
	loaded = true;
	return loaded;
 }
 
 $('#page-2').live('pageshow', function(event, ui) {
	 // reset
	 isAddNewOrderDetailPageCreated = 0;
	 isAddNewOrderCustomerPageCreated = 0;
	 isAddNewOrderDatePageCreated = 0;
	 isAddNewOrderStatusPageCreated = 0;
 });

 $('#page-2').live("swipeleft", function() {
     console.log("binding to swipe-left on ");
     // on left swipe, add one day
     var timeForwardAndBackward = AceRoute.numberOfDaysForwardAndBackward * 24 * 60 * 60 * 1000; 
     var addOneDayToSwipeLeft = 1 * 24 * 60 * 60 * 1000;
    
     AceRoute.currentOrderSearchDate = new Date((new Date(AceRoute.currentOrderSearchDate)).getTime() 
    		 + addOneDayToSwipeLeft); 
	 
	 AceRoute.currentOrderSearchDateStr = AceRoute.currentOrderSearchDate.getFullYear() + "-"
		 	+ (AceRoute.currentOrderSearchDate.getMonth()+1) + "-"
			+ AceRoute.currentOrderSearchDate.getDate();
	 
     AceRoute.orderSearchFromDate = new Date((new Date(AceRoute.currentOrderSearchDate)).getTime() 
    		 - timeForwardAndBackward ); 
     AceRoute.orderSearchToDate = new Date((new Date(AceRoute.currentOrderSearchDate)).getTime() 
    		 + timeForwardAndBackward );
 	 
 	 AceRoute.orderSearchFromDateStr =
 		 AceRoute.orderSearchFromDate.getFullYear() + "-"
 	    	+ (AceRoute.orderSearchFromDate.getMonth()+1) + "-"
 	    	+ AceRoute.orderSearchFromDate.getDate();
 	    	
 	 AceRoute.orderSearchToDateStr =
 		 AceRoute.orderSearchToDate.getFullYear() + "-"
 	    	+ (AceRoute.orderSearchToDate.getMonth()+1) + "-"
 	    	+ AceRoute.orderSearchToDate.getDate();
 		 
 	 console.log(' dateFromChanged() AceRoute.orderSearchFromDate '+AceRoute.orderSearchFromDateStr);
 	 console.log(' dateFromChanged() AceRoute.orderSearchToDate '+AceRoute.orderSearchToDateStr);
 	 
 	 //$('#orderviewdate').css('display', 'none');
 	 $.mobile.loading( 'show', {
 			text: "Loading...",
 			textVisible: true,
 			theme: "a",
 			html: ""
 	 });
 	 var loaded = false;
 	 try{
 		 loaded = loadOrders();
 	 }catch(error){
 		 console.log(" error occurred while loading orders..."+error);
 	 }
 	 if(typeof loaded !== "undefined"){
 		 $.mobile.loading('hide');
 	 }
   
 });
 
 $('#page-2').live("swiperight", function() {
	    console.log("binding to swipe-rigth on ");
	    
	    // on right swipe, add one day
	     var timeForwardAndBackward = AceRoute.numberOfDaysForwardAndBackward * 24 * 60 * 60 * 1000; 
	     var subtractOneDayToSwipeRight = 1 * 24 * 60 * 60 * 1000;
	     
	     AceRoute.currentOrderSearchDate = new Date((new Date(AceRoute.currentOrderSearchDate)).getTime() 
	    		 - subtractOneDayToSwipeRight); 
		 
		 AceRoute.currentOrderSearchDateStr = AceRoute.currentOrderSearchDate.getFullYear() + "-"
			 	+ (AceRoute.currentOrderSearchDate.getMonth()+1) + "-"
				+ AceRoute.currentOrderSearchDate.getDate();
		 
	     AceRoute.orderSearchFromDate = new Date((new Date(AceRoute.currentOrderSearchDate)).getTime() 
	    		 - timeForwardAndBackward ); 
	     AceRoute.orderSearchToDate = new Date((new Date(AceRoute.currentOrderSearchDate)).getTime() 
	    		 + timeForwardAndBackward );
	 	 
	 	 AceRoute.orderSearchFromDateStr =
	 		 AceRoute.orderSearchFromDate.getFullYear() + "-"
	 	    	+ (AceRoute.orderSearchFromDate.getMonth()+1) + "-"
	 	    	+ AceRoute.orderSearchFromDate.getDate();
	 	    	
	 	 AceRoute.orderSearchToDateStr =
	 		 AceRoute.orderSearchToDate.getFullYear() + "-"
	 	    	+ (AceRoute.orderSearchToDate.getMonth()+1) + "-"
	 	    	+ AceRoute.orderSearchToDate.getDate();
	 		 
	 	 console.log(' dateFromChanged() AceRoute.orderSearchFromDate '+AceRoute.orderSearchFromDateStr);
	 	 console.log(' dateFromChanged() AceRoute.orderSearchToDate '+AceRoute.orderSearchToDateStr);
	 	 
	 	 //$('#orderviewdate').css('display', 'none');
	 	 $.mobile.loading( 'show', {
	 			text: "Loading...",
	 			textVisible: true,
	 			theme: "a",
	 			html: ""
	 	 });
	 	 var loaded = false;
	 	 try{
	 		 loaded = loadOrders();
	 	 }catch(error){
	 		 console.log(" error occurred while loading orders..."+error);
	 	 }
	 	 if(typeof loaded !== "undefined"){
	 		 $.mobile.loading('hide');
	 	 }
	 	 
 });
 
 function dateFromChanged(thisDate) {
	 
   console.log(' dateFromChanged() thisDate '+thisDate.value) 
   var timeForwardAndBackward = AceRoute.numberOfDaysForwardAndBackward * 24 * 60 * 60 * 1000; 
   AceRoute.orderSearchFromDate = new Date((new Date(thisDate.value)).getTime() - timeForwardAndBackward ); 
   AceRoute.orderSearchToDate = new Date((new Date(thisDate.value)).getTime() + timeForwardAndBackward );
	 
	 AceRoute.orderSearchFromDateStr =
		 AceRoute.orderSearchFromDate.getFullYear() + "-"
	    	+ (AceRoute.orderSearchFromDate.getMonth()+1) + "-"
	    	+ AceRoute.orderSearchFromDate.getDate();
	    	
	 AceRoute.orderSearchToDateStr =
		 AceRoute.orderSearchToDate.getFullYear() + "-"
	    	+ (AceRoute.orderSearchToDate.getMonth()+1) + "-"
	    	+ AceRoute.orderSearchToDate.getDate();
		 
	 console.log(' dateFromChanged() AceRoute.orderSearchFromDate '+AceRoute.orderSearchFromDateStr);
	 console.log(' dateFromChanged() AceRoute.orderSearchToDate '+AceRoute.orderSearchToDateStr);
	 
	 //$('#orderviewdate').css('display', 'none');
	 $.mobile.loading( 'show', {
			text: "Loading...",
			textVisible: true,
			theme: "a",
			html: ""
	 });
	 var loaded = false;
	 try{
		 loaded = loadOrders();
	 }catch(error){
		 console.log(" error occurred while loading orders..."+error);
	 }
	 if(typeof loaded !== "undefined"){
		 $.mobile.loading('hide');
	 }
 }
 
 $('#orderdetail').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderDetails(orderId);
 });
 
 $('#order-details').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderInfoDetails(orderId);
 });
 
 $('#order-date-time').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderDateDetails(orderId);
 });
 
 $('#order-status').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderStatusDetails(orderId);
 });
 
 $('#order-tasks').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderTasksDetails(orderId);
 });
 
 $('#order-task-edit-page').live('pageshow', function(event, ui) {
	 var orderTaskId = sessionStorage.order_task_id;
     getOrderTaskDetail(orderTaskId);
 });
 
 $('#order-task-add-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderTaskAddHtml(orderId);
 });
  
 $('#order-parts').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderPartsDetails(orderId);
 });
 
 $('#order-part-edit-page').live('pageshow', function(event, ui) {
	 var orderPartId = sessionStorage.order_part_id;
     getOrderPartDetail(orderPartId);
 });
 
 $('#order-part-add-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 getOrderPartAddHtml(orderId);
 });
 
 $('#order-resources').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderResourcesDetails(orderId);
 });
 
 $('#order-resource-edit-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 var orderResourceId = sessionStorage.resourceId;
	 getOrderResourceDetail(orderId, orderResourceId);
 });
 
 $('#order-resource-add-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 getOrderResourceAddHtml(orderId);
 });
 
 $('#order-signatures-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderSignaturesListPage(orderId);
 });
 
 $('#order-signature-edit-page').live('pageshow', function(event, ui) {
	 var fileId = sessionStorage.fileId;
     getOrderSignatureDetail(fileId);
 });
 
 $('#order-signature-add-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     addOrderSignature(orderId);
     if(document.getElementById('canvas') == null){
    	 drawingApp.init();
     }else{
    	  var canvas = document.getElementById('canvas');
    	  var canvasDiv = document.getElementById("canvasDiv");
    	  canvasDiv.removeChild(canvas);
     }
 });
 
 $('#order-pics-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderPicsDetail(orderId);
 });
 
 $('#order-pic-edit-page').live('pageshow', function(event, ui) {
	 var fileId = sessionStorage.fileId;
     getOrderPicDetail(fileId);
 });
 $('#order-pic-add-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     addOrderPic(orderId);
 });
 
 $('#button-pic-capture').live('click', function(event, ui) {
	 navigator.camera.getPicture(
	    function (imageDataFromCam) {
	    	alert('hello');
	    	imagePreviewComp.el.dom.innerHTML = 
	    		'<img style="display:block;width:200px;height:100px;" src="data:image/jpeg;base64,'+imageDataFromCam+'"/>'
	    	imageData = imageDataFromCam;	
	    	//alert(this.imageData);
	    },  
	    function(errorMessage){
	    	  alert("There has been an error, "+errorMessage);
	    }, 
	    { quality: 50 }
	);
 });

// $('#order-signatures-page').live('pageshow', function(event, ui) {
//	 var orderId = sessionStorage.order_id;
//     getOrderSignatureDetail(orderId);
// });
 
 $('#order-notes-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderNotesDetail(orderId);
 });
 $('#all-tasks-map').live('pageshow', function(event, ui) {
	var latitude, longitude;
	function success (position) {
 	     latitude = position.coords.latitude;
 	     longitude = position.coords.longitude;
 	     console.log(" current location latitude "+latitude+' longitude '+longitude);
 	     displayMapforAllOrders(ordersXmlDataStore, latitude, longitude);
	}
	function error(msg) {
		 alert(' error '+msg);
	}
	if (navigator.geolocation) {
	     navigator.geolocation.getCurrentPosition(success, error);
    }  
 });
 
 $('#button-map-edit-order').live('click', function(event, ui) {
//	 var orderId = sessionStorage.order_id;
//     getOrderDetails(orderId);
     document.location.href='#orderdetail';
 });
 
 $('#main-screen-menu').live('pageshow', function(event, ui) {
	 showMainMenuHtml();
 });
 
 $('#main-screen-menu-refreshnow').live('click', function(event, ui) {
	 // in the loadOrders method, there is already logic to fetch the orders
	 // based on the currently selected date, so it should be fine to just that method
	 // from here
	 loadOrders();
 });
  
 $('#main-screen-order-add-new-order').live('pageshow', function(event, ui) {
	 showAddNewOrderHtml();
 });

$('#order-add-new-order-details').live('pageshow', function(event, ui) {
	 if(isAddNewOrderDetailPageCreated == 0){
		 getAddNewOrderDetailPageHtml();
		 isAddNewOrderDetailPageCreated = 1;
	 }
});

$('#order-add-new-order-customer').live('pageshow', function(event, ui) {
	 if(isAddNewOrderCustomerPageCreated == 0){
		 getAddNewOrderCustomerPageHtml();
		 isAddNewOrderCustomerPageCreated = 1;
	 }
});

$('#order-add-new-order-date-time').live('pageshow', function(event, ui) {
	 if(isAddNewOrderDatePageCreated == 0){
		 getAddNewOrderDateDetailsHtml();
		 isAddNewOrderDatePageCreated = 1;
	 }
});

$('#order-add-new-order-status').live('pageshow', function(event, ui) {
	 if(isAddNewOrderStatusPageCreated == 0){
		 getAddNewOrderStatusDetails();
		 isAddNewOrderStatusPageCreated = 1;
	 }
});

$('#select-order-customer-name-new-order').live("change", function(event, ui){
   var custId = $(this).attr('value');
   // https://acerouteqa.appspot.com/mobi?mtoken=aceroute.com|88001|7F00000101390239165FD6890132C515&action=getsite&cust_id=197002
   customerSiteXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getsite&cust_id="+custId);
   var custSiteHtmlStr = getAddNewOrderCustomerSiteHtml(false);
   custSiteHtmlStr = custSiteHtmlStr.trim();
   
   var order_cust_site_add_new_order = $('#select-order-customer-site-new-order');
   order_cust_site_add_new_order.empty();
   order_cust_site_add_new_order.append(custSiteHtmlStr).selectmenu("refresh");
   //order_cust_site_add_new_order.html(custSiteHtmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
   
//   var order_cust_site_add_new_order_div = $('#select-order-customer-site-new-order-div');
//   order_cust_site_add_new_order_div.trigger("refresh");
});

$('#button-save-new-order').live('click', function(event, ui) {
	
	//  Add Order Working
	// 	loginref:12345
	// 	action:saveorder
	// 	type:true
	// 	cust_id:1318443439911
	// 	order_id:0
	// 	event_geocode:1
	// 	start_date:2011/11/15 10:30 -00:00
	// 	end_date:2011/11/15 13:30 -00:00
	// 	orderStartTime:1321353000000
	// 	orderEndTime:1321363800000
	// 	order_name:test 001
	// 	cust_siteid:1317418345779
	// 	cust_contactid:
	// 	order_po:
	// 	order_typeid:1313825751268
	// 	order_prtid:2
	// 	order_inst:
	// 	order_wkfid:1
	// 	order_recid:N/A
	// 	res_id:0
	// 	order_startwin:1:15 AM
	// 	order_endwin:2:15 AM
	// 	resource_addid:
	// 	order_notes:
	// 	order_flg:0|
	// 	reset:0
	// 	wkfid_upd:0
	// 	dragged:false
	// 	tstamp:1321742520000
	// 	Submit:Submit Form
		
	// add order working 11/10/2012 (mm/dd/yyyy)
//	mtoken:aceroute.com|234001|7F000001013A567DEC4E05EA00AB436D
//	action:saveorder
//	cust_id:197002
//	cust_siteid:197003
//	cust_contactid:
//	event_geocode:1
//	extsys_id:
//	start_date:2012/11/09 20:57 -00:00
//	end_date:2012/11/09 21:57 -00:00
//	order_desc:Some order desc
//	order_id:0
//	orderStartTime:1352494620000
//	orderEndTime:1352498220000
//	order_name:ON1110201201
//	order_po:ON1110201201
//	order_typeid:1290126896255
//	order_prtid:1
//	order_inst:Some13 message for resource. Now added to message and assigned to some resource
//	order_wkfid:0
//	order_recid:N/A
//	order_startwin:1352494620000
//	order_endwin:1352498220000
//	order_notes:
//	order_flg:0|
//	res_id:0
//	res_addid:
//	reset:0
//	type:true
//	tstamp:1352487420000
//	wkfid_upd:0
	
	//	Date | Start Time | Duration (required) done
	//	Customer (required)
	//	Site (required)
	//	Order Name (required) done
	//	PO/Group# done
	//	Assign To
	//	Status done
	//	Priority done
	//	Type done
	//	Promise Window done
	//	Instructions
	
//	INFO:  param mtoken  paramValue aceroute.com|234001|7F000001013A567DEC4E05EA00AB436D
//	INFO:  param action  paramValue saveorder
//	INFO:  param cust_id  paramValue 197002
//	INFO:  param cust_siteid  paramValue 197003
//	INFO:  param cust_contactid  paramValue 
//	INFO:  param event_geocode  paramValue 1
//	INFO:  param extsys_id  paramValue 
//	INFO:  param start_date  paramValue 2012/11/11 6:58 -00:00
//	INFO:  param end_date  paramValue 2012/11/11 7:58 -00:00
//	INFO:  param order_desc  paramValue Some order desc
//	INFO:  param order_id  paramValue 0
//	INFO:  param orderStartTime  paramValue 1352617080000
//	INFO:  param orderEndTime  paramValue 1352620680000
//	INFO:  param order_name  paramValue ON1111201205
//	INFO:  param order_po  paramValue ON1111201205
//	INFO:  param order_typeid  paramValue 1290126896255
//	INFO:  param order_prtid  paramValue 1
//	INFO:  param order_inst  paramValue Some13 message for resource. Now added to message and assigned to some resource
//	INFO:  param order_wkfid  paramValue 0
//	INFO:  param order_recid  paramValue N/A
//	INFO:  param order_startwin  paramValue 1352617080000
//	INFO:  param order_endwin  paramValue 1352620680000
//	INFO:  param order_notes  paramValue 
//	INFO:  param order_flg  paramValue 0||#]
//	[#|2012-11-11T20:28:42.075+0530|INFO|glassfish3.1.1|javax.enterprise.system.std.com.sun.enterprise.server.logging|_ThreadID=20;_ThreadName=Thread-2;| param res_id  paramValue 0
//	INFO:  param res_addid  paramValue 
//	INFO:  param reset  paramValue 0
//	INFO:  param type  paramValue true
//	INFO:  param tstamp  paramValue 1352645880000
//	INFO:  param wkfid_upd  paramValue 0
//
//	INFO: <data><ajaxres><success><![CDATA[true]]></success><id><![CDATA[272003]]></id></ajaxres></data>
	
	//var loginref = "12345";
	var action = "saveorder";
	var type = "true";
	var cust_id = "197002";
	var order_id = 0;
	var event_geocode = 1;
	var extsys_id = '';
	// 	start_date:2011/11/15 10:30 -00:00
	// 	end_date:2011/11/15 13:30 -00:00
	// 	orderStartTime:1321353000000
	// 	orderEndTime:1321363800000
	// 	order_name:test 001
	var cust_siteid = "197003";
	var cust_contactid = "";
	// 	order_po:
	// 	order_typeid:1313825751268
	// 	order_prtid:2
	var order_inst = "";
    var order_wkfid = "1";
    var order_recid = "N/A";
	var res_id = 0;
	// 	order_startwin:1:15 AM
	// 	order_endwin:2:15 AM
	var resource_addid = "";
	var order_notes = "";
	var order_flg = "0|";
	var reset = 0;
	var	 wkfid_upd = 0;
	var dragged = "false"
	var tstamp = "1321742520000";
	
	var orderName = document.getElementById('orderNameNew').value;
	if(orderName != null || typeof orderName !== "undefined"){
		orderName = orderName.trim();
	}
	
	var orderPoNew = document.getElementById('orderPoNew').value;
	if(orderPoNew != null || typeof orderPoNew !== "undefined"){
		orderPoNew = orderPoNew.trim();
	}
	
	var orderTypeNewOrder = document.getElementById('select-order-type-new-order').value;
	if(orderTypeNewOrder != null || typeof orderTypeNewOrder !== "undefined"){
		orderTypeNewOrder = orderTypeNewOrder.trim();
	}
	
	var orderPriorityNewOrder = document.getElementById('select-order-priority-new-order').value;
	if(orderPriorityNewOrder != null || typeof orderPriorityNewOrder !== "undefined"){
		orderPriorityNewOrder = orderPriorityNewOrder.trim();
	}
	
	var orderCustNameNewOrder = document.getElementById('select-order-customer-name-new-order').value;
	if(orderCustNameNewOrder != null || typeof orderCustNameNewOrder !== "undefined"){
		orderCustNameNewOrder = orderCustNameNewOrder.trim();
	}
	var orderCustSiteNewOrder = document.getElementById('select-order-customer-site-new-order').value;
	if(orderCustSiteNewOrder != null || typeof orderCustSiteNewOrder !== "undefined"){
		orderCustSiteNewOrder = orderCustSiteNewOrder.trim();
	}
	
	var orderTypeNewOrder = document.getElementById('select-order-type-new-order').value;
	if(orderTypeNewOrder != null || typeof orderTypeNewOrder !== "undefined"){
		orderTypeNewOrder = orderTypeNewOrder.trim();
	}
	var orderPriorityNewOrder = document.getElementById('select-order-priority-new-order').value;
	if(orderPriorityNewOrder != null || typeof orderPriorityNewOrder !== "undefined"){
		orderPriorityNewOrder = orderPriorityNewOrder.trim();
	}
	
	var orderStatusNewOrder = document.getElementById('select-new-order-status').value;
	if(orderStatusNewOrder != null || typeof orderStatusNewOrder !== "undefined"){
		orderStatusNewOrder = orderStatusNewOrder.trim();
	}
	
	var newOrderStartDate = document.getElementById('newOrderStartDate').value;
//	var newOrderEndDate = document.getElementById('newOrderEndDate').value;
	var newOrderStartTime = document.getElementById('newOrderStartTime').value;
	var newOrderEndTime = document.getElementById('newOrderEndTime').value;
	var newOrderDuration = document.getElementById('newOrderDuration').value;
	
	var startTimeIndexOfColumn = newOrderStartTime.indexOf(":");
	var startTimeHour = newOrderStartTime.slice(0,startTimeIndexOfColumn);
	var startTimeMinute;
	var indexOfAmPm;
	
	if((newOrderStartTime.indexOf("AM") > 0) || (newOrderStartTime.indexOf("PM") > 0)){
		if(newOrderStartTime.indexOf("AM") > 0){
			indexOfAmPm = newOrderStartTime.indexOf("AM");
			startTimeMinute = newOrderStartTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
		}
		if(newOrderStartTime.indexOf("PM") > 0){
			indexOfAmPm = newOrderStartTime.indexOf("PM");
			startTimeHour = parseInt(startTimeHour) + 12; 
			startTimeMinute = newOrderStartTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
		}
	}
	
	var startTimeInMilliSec; 
	if(typeof startTimeHour !== "undefined"){
		startTimeInMilliSec = ((parseInt(startTimeHour))*60 + parseInt(startTimeMinute))*60*1000;
	}
	
	var startDateTemp = new Date((new Date(newOrderStartDate)).getTime() + startTimeInMilliSec ); 
	
	var indexOfColumn = newOrderDuration.indexOf(":");
	var eventDurationHour = newOrderDuration.slice(0,indexOfColumn);
	var eventDurationMinute = newOrderDuration.slice(indexOfColumn+1);
	var eventTotalTimeInMilliSec; 
	if(typeof eventDurationHour !== "undefined"){
		eventTotalTimeInMilliSec = ((parseInt(eventDurationHour))*60 + parseInt(eventDurationMinute))*60*1000;
	}
	
	var endDateTemp = new Date(startDateTemp.getTime() + eventTotalTimeInMilliSec); 
	
	var startDateUtc = CommonUtil.convertToUTC(startDateTemp);
	var endDateUtc = CommonUtil.convertToUTC(endDateTemp);
	
	var indexOfZero = startDateUtc.indexOf("-00");
    var startDateSub = startDateUtc.substring(0,indexOfZero);
    startDateSub = startDateSub+"GMT+0000";
    
    indexOfZero = endDateUtc.indexOf("-00");
    var endDateSub = endDateUtc.substring(0,indexOfZero);
    endDateSub = endDateSub+"GMT+0000";
	  
	console.log(' startDateSub '+startDateSub);
	console.log(' endDateSub '+endDateSub);
	
	var orderStartTime = (new Date(startDateSub)).getTime();
	var orderEndTime = (new Date(endDateSub)).getTime();
	
	var orderStartWindow = newOrderStartTime; 
	var orderEndWindow = newOrderEndTime; 
	
	var tsSt = CommonUtil.convertToUTC(new Date());
	indexOfZero = tsSt.indexOf("-00");
    var tsStampSub = tsSt.substring(0,indexOfZero);
    tsStampSub = tsStampSub+"GMT+0000";
    
	console.log(' tsStampSub '+tsStampSub);
	
	var tsStamp = new Date(tsStampSub).getTime();
	
	var result = null;
    $.ajax(
         {
             url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
             type: 'post',
             data: {
            	mtoken: mtoken,
            	//loginref: "aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08",
         		action: "saveorder",
         		
         		cust_id : orderCustNameNewOrder, // "197002",
         		cust_siteid : orderCustSiteNewOrder, //"197003",
         		cust_contactid : "",
         		event_geocode : 1,
         		extsys_id: '',
         		
         		start_date: startDateUtc,
         		end_date: endDateUtc,
         		
         		order_desc: 'Some order desc',
         		order_id : '0',
         		orderStartTime: orderStartTime,
         		orderEndTime: orderEndTime,
         		order_name: orderName,
         		
	         	order_po: orderPoNew,
	         	order_typeid: orderTypeNewOrder, //"1290126896255",
	         	order_prtid: orderPriorityNewOrder, //"2",
	         	order_inst : "Some13 message for resource. Now added to message and assigned to some resource",
	            order_wkfid : orderStatusNewOrder, //"1",
	            order_recid : "N/A",
	         	order_startwin: orderStartTime,
	         	order_endwin: orderEndTime,
	         	order_notes : "",
	         	order_flg : "0|",
	         	
	         	res_id : "0",
	         	res_addid: "",
	         	reset : "0",
	         	
	         	type: "true",
	         	//dragged : "false",
	         	tstamp : tsStamp,
	         	wkfid_upd : 0
             },
             async: false,
             cache: false,
             success: function(data) 
             {
                 result = data;
             }
         }
     );
     alert(result);
     
//	 alert("About to submit");
});
 
$('#order-detail-page-save').live('click', function(event, ui) {
	
	//  Add Order Working
	// 	loginref:12345
	// 	action:saveorder
	// 	type:true
	// 	cust_id:1318443439911
	// 	order_id:0
	// 	event_geocode:1
	// 	start_date:2011/11/15 10:30 -00:00
	// 	end_date:2011/11/15 13:30 -00:00
	// 	orderStartTime:1321353000000
	// 	orderEndTime:1321363800000
	// 	order_name:test 001
	// 	cust_siteid:1317418345779
	// 	cust_contactid:
	// 	order_po:
	// 	order_typeid:1313825751268
	// 	order_prtid:2
	// 	order_inst:
	// 	order_wkfid:1
	// 	order_recid:N/A
	// 	res_id:0
	// 	order_startwin:1:15 AM
	// 	order_endwin:2:15 AM
	// 	resource_addid:
	// 	order_notes:
	// 	order_flg:0|
	// 	reset:0
	// 	wkfid_upd:0
	// 	dragged:false
	// 	tstamp:1321742520000
	// 	Submit:Submit Form
		
	// add order working 11/10/2012 (mm/dd/yyyy)
//	mtoken:aceroute.com|234001|7F000001013A567DEC4E05EA00AB436D
//	action:saveorder
//	cust_id:197002
//	cust_siteid:197003
//	cust_contactid:
//	event_geocode:1
//	extsys_id:
//	start_date:2012/11/09 20:57 -00:00
//	end_date:2012/11/09 21:57 -00:00
//	order_desc:Some order desc
//	order_id:0
//	orderStartTime:1352494620000
//	orderEndTime:1352498220000
//	order_name:ON1110201201
//	order_po:ON1110201201
//	order_typeid:1290126896255
//	order_prtid:1
//	order_inst:Some13 message for resource. Now added to message and assigned to some resource
//	order_wkfid:0
//	order_recid:N/A
//	order_startwin:1352494620000
//	order_endwin:1352498220000
//	order_notes:
//	order_flg:0|
//	res_id:0
//	res_addid:
//	reset:0
//	type:true
//	tstamp:1352487420000
//	wkfid_upd:0
	
	//	Date | Start Time | Duration (required) done
	//	Customer (required)
	//	Site (required)
	//	Order Name (required) done
	//	PO/Group# done
	//	Assign To
	//	Status done
	//	Priority done
	//	Type done
	//	Promise Window done
	//	Instructions
	
	var orderId = sessionStorage.order_id;
	var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 
	//var loginref = "12345";
	var action = "saveorder";
	var type = "false";
	var order_id = 0;
	var event_geocode = 1;
	var extsys_id = '';
	// 	start_date:2011/11/15 10:30 -00:00
	// 	end_date:2011/11/15 13:30 -00:00
	// 	orderStartTime:1321353000000
	// 	orderEndTime:1321363800000
	// 	order_name:test 001
	// 	order_po:
	// 	order_typeid:1313825751268
	// 	order_prtid:2
	var order_inst = "";
    var order_wkfid = "";
    var order_recid = "N/A";
	var res_id = 0;
	// 	order_startwin:1:15 AM
	// 	order_endwin:2:15 AM
	var res_addid = "";
	var order_notes = "";
	var order_flg = "0|";
	var reset = 0;
	var	wkfid_upd = 0;
	var dragged = "false"
	var tstamp = "1321742520000";
	
	var orderInst = document.getElementById('orderInst').value;
	if( orderInst != null || typeof orderInst !== "undefined"){
		 orderInst = orderInst.trim();
	}
	
	var order_desc = orderData.find('order_desc').text();
	if( order_desc != null || typeof order_desc !== "undefined"){
		order_desc = order_desc.trim();
	}
	var order_name = orderData.find('order_name').text();
	if( order_name != null || typeof order_name !== "undefined"){
		order_name = order_name.trim();
	}
	var order_po = orderData.find('order_po').text();
	if( order_po != null || typeof order_po !== "undefined"){
		order_po = order_po.trim();
	}
	res_id = orderData.find('res_id').text();
	if( res_id != null || typeof res_id !== "undefined"){
		res_id = res_id.trim();
	}
	res_addid = orderData.find('res_addid').text();
	if( res_addid != null || typeof res_addid !== "undefined"){
		res_addid = res_addid.trim();
	}
	var start_date_utc = orderData.find('start_date').text();
	if( start_date_utc != null || typeof start_date_utc !== "undefined"){
		start_date_utc = start_date_utc.trim();
	}
	var end_date_utc = orderData.find('end_date').text();
	if( end_date_utc != null || typeof end_date_utc !== "undefined"){
		end_date_utc = end_date_utc.trim();
	}
	var start_time = orderData.find('order_startwin').text();
	if( start_time != null || typeof start_time !== "undefined"){
		start_time = start_time.trim();
	}
	var end_time = orderData.find('order_endwin').text();
	if( end_time != null || typeof end_time !== "undefined"){
		end_time = end_time.trim();
	}
	//	var orderName = document.getElementById('orderNameNew').value;
//	if(orderName != null || typeof orderName !== "undefined"){
//		orderName = orderName.trim();
//	}
//	
//	var orderPoNew = document.getElementById('orderPoNew').value;
//	if(orderPoNew != null || typeof orderPoNew !== "undefined"){
//		orderPoNew = orderPoNew.trim();
//	}
	
	var orderTypeUpdateOrder = document.getElementById('select-order-type-update-order').value;
	if(orderTypeUpdateOrder != null || typeof orderTypeUpdateOrder !== "undefined"){
		orderTypeUpdateOrder = orderTypeUpdateOrder.trim();
	}
	
	var orderPriorityUpdateOrder = document.getElementById('select-order-priority-update-order').value;
	if(orderPriorityUpdateOrder != null || typeof orderPriorityUpdateOrder !== "undefined"){
		orderPriorityUpdateOrder = orderPriorityUpdateOrder.trim();
	}
	
//	var orderCustNameNewOrder = document.getElementById('select-order-customer-name-new-order').value;
//	if(orderCustNameNewOrder != null || typeof orderCustNameNewOrder !== "undefined"){
//		orderCustNameNewOrder = orderCustNameNewOrder.trim();
//	}
//	var orderCustSiteNewOrder = document.getElementById('select-order-customer-site-new-order').value;
//	if(orderCustSiteNewOrder != null || typeof orderCustSiteNewOrder !== "undefined"){
//		orderCustSiteNewOrder = orderCustSiteNewOrder.trim();
//	}
	order_wkfid = orderData.find('order_wkfid').text();
	if( order_wkfid != null || typeof order_wkfid !== "undefined"){
		order_wkfid = order_wkfid.trim();
	}
//	var orderStatusUpdateOrder = document.getElementById('orderStatusId').value;
//	if(orderStatusUpdateOrder != null || typeof orderStatusUpdateOrder !== "undefined"){
//		orderStatusUpdateOrder = orderStatusUpdateOrder.trim();
//	}
	
//	var newOrderStartDate = document.getElementById('orderUpdateStartDate').value;
////	var newOrderEndDate = document.getElementById('newOrderEndDate').value;
//	var newOrderStartTime = document.getElementById('startTimeDateBox').value;
//	var newOrderEndTime = document.getElementById('endTimeDateBox').value;
//	var newOrderDuration = document.getElementById('duration').value;
//	
//	var startTimeIndexOfColumn = newOrderStartTime.indexOf(":");
//	var startTimeHour = newOrderStartTime.slice(0,startTimeIndexOfColumn);
//	var startTimeMinute;
//	var indexOfAmPm;
//	
//	if((newOrderStartTime.indexOf("AM") > 0) || (newOrderStartTime.indexOf("PM") > 0)){
//		if(newOrderStartTime.indexOf("AM") > 0){
//			indexOfAmPm = newOrderStartTime.indexOf("AM");
//			startTimeMinute = newOrderStartTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
//		}
//		if(newOrderStartTime.indexOf("PM") > 0){
//			indexOfAmPm = newOrderStartTime.indexOf("PM");
//			startTimeHour = parseInt(startTimeHour) + 12; 
//			startTimeMinute = startTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
//		}
//	}
//	
//	var startTimeInMilliSec; 
//	if(typeof startTimeHour !== "undefined"){
//		startTimeInMilliSec = ((parseInt(startTimeHour))*60 + parseInt(startTimeMinute))*60*1000;
//	}
//	
//	var startDateTemp = new Date((new Date(newOrderStartDate)).getTime() + startTimeInMilliSec ); 
//	
//	var indexOfColumn = newOrderDuration.indexOf(":");
//	var eventDurationHour = newOrderDuration.slice(0,indexOfColumn);
//	var eventDurationMinute = newOrderDuration.slice(indexOfColumn+1);
//	var eventTotalTimeInMilliSec; 
//	if(typeof eventDurationHour !== "undefined"){
//		eventTotalTimeInMilliSec = ((parseInt(eventDurationHour))*60 + parseInt(eventDurationMinute))*60*1000;
//	}
//	
//	var endDateTemp = new Date(startDateTemp.getTime() + eventTotalTimeInMilliSec); 
//	
	var startDateUtc = start_date_utc; //CommonUtil.convertToUTC(startDateTemp);
	var endDateUtc = end_date_utc;
	
	var indexOfZero = startDateUtc.indexOf("-00");
    var startDateSub = startDateUtc.substring(0,indexOfZero);
    startDateSub = startDateSub+"GMT+0000";
    
    indexOfZero = endDateUtc.indexOf("-00");
    var endDateSub = endDateUtc.substring(0,indexOfZero);
    endDateSub = endDateSub+"GMT+0000";
	  
	console.log(' startDateSub '+startDateSub);
	console.log(' endDateSub '+endDateSub);

	var orderStartTime = (new Date(startDateSub)).getTime();
	var orderEndTime = (new Date(endDateSub)).getTime();
	
	var orderStartWindow = start_time; //newOrderStartTime; 
	var orderEndWindow = end_time; //newOrderEndTime; 
	
	var tsSt = CommonUtil.convertToUTC(new Date());
	indexOfZero = tsSt.indexOf("-00");
    var tsStampSub = tsSt.substring(0,indexOfZero);
    tsStampSub = tsStampSub+"GMT+0000";
    
	console.log(' tsStampSub '+tsStampSub);
	
	var tsStamp = new Date(tsStampSub).getTime();
	
	var result = null;
    $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	//loginref: "aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08",
     		action: "saveorder",
     		cust_id : "197002",
     		cust_siteid : "197003",
     		cust_contactid : "",
     		event_geocode: 1,
     		extsys_id: '',
     		
     		start_date: startDateUtc,
     		end_date: endDateUtc,
     		
     		order_desc: order_desc,
     		order_id : orderId,
     		orderStartTime: orderStartTime,
     		orderEndTime: orderEndTime,
     		order_name: order_name,
     		
         	order_po: order_po,
         	order_typeid: orderTypeUpdateOrder, //"1290126896255",
         	order_prtid: orderPriorityUpdateOrder, //"2",
         	order_inst : orderInst,
            order_wkfid : order_wkfid, //"1",
            order_recid : "N/A",
         	order_startwin: orderStartTime,
         	order_endwin: orderEndTime,
         	order_notes : "",
         	order_flg : "0|",
         	
         	res_id : res_id,
         	res_addid: res_addid,
         	reset : "0",
         	
         	type: "false",
         	//dragged : "false",
         	tstamp : tsStamp,
         	wkfid_upd : 0
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     }
   );
  alert(result);
//	 alert("About to submit");
});

$('#order-date-time-page-save').live('click', function(event, ui) {
	
	var orderId = sessionStorage.order_id;
	var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 
	//var loginref = "12345";
	var action = "saveorder";
	var type = "false";
	var order_id = 0;
	var event_geocode = 1;
	var extsys_id = '';
	// 	start_date:2011/11/15 10:30 -00:00
	// 	end_date:2011/11/15 13:30 -00:00
	// 	orderStartTime:1321353000000
	// 	orderEndTime:1321363800000
	// 	order_name:test 001
	// 	order_po:
	// 	order_typeid:1313825751268
	// 	order_prtid:2
	var order_inst = "";
    var order_wkfid = "";
    var order_recid = "N/A";
	var res_id = 0;
	// 	order_startwin:1:15 AM
	// 	order_endwin:2:15 AM
	var res_addid = "";
	var order_notes = "";
	var order_flg = "0|";
	var reset = 0;
	var	wkfid_upd = 0;
	var dragged = "false"
	var tstamp = "1321742520000";
	
	var orderInst = document.getElementById('orderInst').value;
	if( orderInst != null || typeof orderInst !== "undefined"){
		 orderInst = orderInst.trim();
	}
	
	var order_desc = orderData.find('order_desc').text();
	if( order_desc != null || typeof order_desc !== "undefined"){
		order_desc = order_desc.trim();
	}
	var order_name = orderData.find('order_name').text();
	if( order_name != null || typeof order_name !== "undefined"){
		order_name = order_name.trim();
	}
	var order_po = orderData.find('order_po').text();
	if( order_po != null || typeof order_po !== "undefined"){
		order_po = order_po.trim();
	}
	res_id = orderData.find('res_id').text();
	if( res_id != null || typeof res_id !== "undefined"){
		res_id = res_id.trim();
	}
	res_addid = orderData.find('res_addid').text();
	if( res_addid != null || typeof res_addid !== "undefined"){
		res_addid = res_addid.trim();
	}
	var start_date_utc = orderData.find('start_date').text();
	if( start_date_utc != null || typeof start_date_utc !== "undefined"){
		start_date_utc = start_date_utc.trim();
	}
	var end_date_utc = orderData.find('end_date').text();
	if( end_date_utc != null || typeof end_date_utc !== "undefined"){
		end_date_utc = end_date_utc.trim();
	}
	var start_time = orderData.find('order_startwin').text();
	if( start_time != null || typeof start_time !== "undefined"){
		start_time = start_time.trim();
	}
	var end_time = orderData.find('order_endwin').text();
	if( end_time != null || typeof end_time !== "undefined"){
		end_time = end_time.trim();
	}
	//	var orderName = document.getElementById('orderNameNew').value;
//	if(orderName != null || typeof orderName !== "undefined"){
//		orderName = orderName.trim();
//	}
//	
//	var orderPoNew = document.getElementById('orderPoNew').value;
//	if(orderPoNew != null || typeof orderPoNew !== "undefined"){
//		orderPoNew = orderPoNew.trim();
//	}
	
	var orderTypeUpdateOrder = document.getElementById('select-order-type-update-order').value;
	if(orderTypeUpdateOrder != null || typeof orderTypeUpdateOrder !== "undefined"){
		orderTypeUpdateOrder = orderTypeUpdateOrder.trim();
	}
	
	var orderPriorityUpdateOrder = document.getElementById('select-order-priority-update-order').value;
	if(orderPriorityUpdateOrder != null || typeof orderPriorityUpdateOrder !== "undefined"){
		orderPriorityUpdateOrder = orderPriorityUpdateOrder.trim();
	}
	
//	var orderCustNameNewOrder = document.getElementById('select-order-customer-name-new-order').value;
//	if(orderCustNameNewOrder != null || typeof orderCustNameNewOrder !== "undefined"){
//		orderCustNameNewOrder = orderCustNameNewOrder.trim();
//	}
//	var orderCustSiteNewOrder = document.getElementById('select-order-customer-site-new-order').value;
//	if(orderCustSiteNewOrder != null || typeof orderCustSiteNewOrder !== "undefined"){
//		orderCustSiteNewOrder = orderCustSiteNewOrder.trim();
//	}
	order_wkfid = orderData.find('order_wkfid').text();
	if( order_wkfid != null || typeof order_wkfid !== "undefined"){
		order_wkfid = order_wkfid.trim();
	}
//	var orderStatusUpdateOrder = document.getElementById('orderStatusId').value;
//	if(orderStatusUpdateOrder != null || typeof orderStatusUpdateOrder !== "undefined"){
//		orderStatusUpdateOrder = orderStatusUpdateOrder.trim();
//	}
	
//	var newOrderStartDate = document.getElementById('orderUpdateStartDate').value;
////	var newOrderEndDate = document.getElementById('newOrderEndDate').value;
//	var newOrderStartTime = document.getElementById('startTimeDateBox').value;
//	var newOrderEndTime = document.getElementById('endTimeDateBox').value;
//	var newOrderDuration = document.getElementById('duration').value;
//	
//	var startTimeIndexOfColumn = newOrderStartTime.indexOf(":");
//	var startTimeHour = newOrderStartTime.slice(0,startTimeIndexOfColumn);
//	var startTimeMinute;
//	var indexOfAmPm;
//	
//	if((newOrderStartTime.indexOf("AM") > 0) || (newOrderStartTime.indexOf("PM") > 0)){
//		if(newOrderStartTime.indexOf("AM") > 0){
//			indexOfAmPm = newOrderStartTime.indexOf("AM");
//			startTimeMinute = newOrderStartTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
//		}
//		if(newOrderStartTime.indexOf("PM") > 0){
//			indexOfAmPm = newOrderStartTime.indexOf("PM");
//			startTimeHour = parseInt(startTimeHour) + 12; 
//			startTimeMinute = startTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
//		}
//	}
//	
//	var startTimeInMilliSec; 
//	if(typeof startTimeHour !== "undefined"){
//		startTimeInMilliSec = ((parseInt(startTimeHour))*60 + parseInt(startTimeMinute))*60*1000;
//	}
//	
//	var startDateTemp = new Date((new Date(newOrderStartDate)).getTime() + startTimeInMilliSec ); 
//	
//	var indexOfColumn = newOrderDuration.indexOf(":");
//	var eventDurationHour = newOrderDuration.slice(0,indexOfColumn);
//	var eventDurationMinute = newOrderDuration.slice(indexOfColumn+1);
//	var eventTotalTimeInMilliSec; 
//	if(typeof eventDurationHour !== "undefined"){
//		eventTotalTimeInMilliSec = ((parseInt(eventDurationHour))*60 + parseInt(eventDurationMinute))*60*1000;
//	}
//	
//	var endDateTemp = new Date(startDateTemp.getTime() + eventTotalTimeInMilliSec); 
//	
	var startDateUtc = start_date_utc; //CommonUtil.convertToUTC(startDateTemp);
	var endDateUtc = end_date_utc;
	
	var indexOfZero = startDateUtc.indexOf("-00");
    var startDateSub = startDateUtc.substring(0,indexOfZero);
    startDateSub = startDateSub+"GMT+0000";
    
    indexOfZero = endDateUtc.indexOf("-00");
    var endDateSub = endDateUtc.substring(0,indexOfZero);
    endDateSub = endDateSub+"GMT+0000";
	  
	console.log(' startDateSub '+startDateSub);
	console.log(' endDateSub '+endDateSub);

	var orderStartTime = (new Date(startDateSub)).getTime();
	var orderEndTime = (new Date(endDateSub)).getTime();
	
	var orderStartWindow = start_time; //newOrderStartTime; 
	var orderEndWindow = end_time; //newOrderEndTime; 
	
	var tsSt = CommonUtil.convertToUTC(new Date());
	indexOfZero = tsSt.indexOf("-00");
    var tsStampSub = tsSt.substring(0,indexOfZero);
    tsStampSub = tsStampSub+"GMT+0000";
    
	console.log(' tsStampSub '+tsStampSub);
	
	var tsStamp = new Date(tsStampSub).getTime();
	
	var result = null;
    $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	//loginref: "aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08",
     		action: "saveorder",
     		cust_id : "197002",
     		cust_siteid : "197003",
     		cust_contactid : "",
     		event_geocode: 1,
     		extsys_id: '',
     		
     		start_date: startDateUtc,
     		end_date: endDateUtc,
     		
     		order_desc: order_desc,
     		order_id : orderId,
     		orderStartTime: orderStartTime,
     		orderEndTime: orderEndTime,
     		order_name: order_name,
     		
         	order_po: order_po,
         	order_typeid: orderTypeUpdateOrder, //"1290126896255",
         	order_prtid: orderPriorityUpdateOrder, //"2",
         	order_inst : orderInst,
            order_wkfid : order_wkfid, //"1",
            order_recid : "N/A",
         	order_startwin: orderStartTime,
         	order_endwin: orderEndTime,
         	order_notes : "",
         	order_flg : "0|",
         	
         	res_id : res_id,
         	res_addid: res_addid,
         	reset : "0",
         	
         	type: "false",
         	//dragged : "false",
         	tstamp : tsStamp,
         	wkfid_upd : 0
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     }
   );
  alert(result);
//	 alert("About to submit");
});

$('#order-status-page-save').live('click', function(event, ui) {
	
	var orderId = sessionStorage.order_id;
	var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 
	//var loginref = "12345";
	var action = "saveorder";
	var type = "false";
	var order_id = 0;
	var event_geocode = 1;
	var extsys_id = '';
	// 	start_date:2011/11/15 10:30 -00:00
	// 	end_date:2011/11/15 13:30 -00:00
	// 	orderStartTime:1321353000000
	// 	orderEndTime:1321363800000
	// 	order_name:test 001
	// 	order_po:
	// 	order_typeid:1313825751268
	// 	order_prtid:2
	var order_inst = "";
    var order_wkfid = "";
    var order_recid = "N/A";
	var res_id = 0;
	// 	order_startwin:1:15 AM
	// 	order_endwin:2:15 AM
	var res_addid = "";
	var order_notes = "";
	var order_flg = "0|";
	var reset = 0;
	var	wkfid_upd = 0;
	var dragged = "false"
	var tstamp = "1321742520000";
	
	var order_desc = orderData.find('order_desc').text();
	if( order_desc != null || typeof order_desc !== "undefined"){
		order_desc = order_desc.trim();
	}
	var orderInst = orderData.find('order_inst').text();
	if( orderInst != null || typeof orderInst !== "undefined"){
		 orderInst = orderInst.trim();
	}
	var order_name = orderData.find('order_name').text();
	if( order_name != null || typeof order_name !== "undefined"){
		order_name = order_name.trim();
	}
	var order_po = orderData.find('order_po').text();
	if( order_po != null || typeof order_po !== "undefined"){
		order_po = order_po.trim();
	}
	var order_prtid = orderData.find('order_prtid').text();
	if( order_prtid != null || typeof order_prtid !== "undefined"){
		order_prtid = order_prtid.trim();
	}
	var order_typeid = orderData.find('order_typeid').text();
	if( order_typeid != null || typeof order_typeid !== "undefined"){
		order_typeid = order_typeid.trim();
	}
	
	res_id = orderData.find('res_id').text();
	if( res_id != null || typeof res_id !== "undefined"){
		res_id = res_id.trim();
	}
	res_addid = orderData.find('res_addid').text();
	if( res_addid != null || typeof res_addid !== "undefined"){
		res_addid = res_addid.trim();
	}
	var start_date_utc = orderData.find('start_date').text();
	if( start_date_utc != null || typeof start_date_utc !== "undefined"){
		start_date_utc = start_date_utc.trim();
	}
	var end_date_utc = orderData.find('end_date').text();
	if( end_date_utc != null || typeof end_date_utc !== "undefined"){
		end_date_utc = end_date_utc.trim();
	}
	var start_time = orderData.find('order_startwin').text();
	if( start_time != null || typeof start_time !== "undefined"){
		start_time = start_time.trim();
	}
	var end_time = orderData.find('order_endwin').text();
	if( end_time != null || typeof end_time !== "undefined"){
		end_time = end_time.trim();
	}
	
//	var orderCustNameNewOrder = document.getElementById('select-order-customer-name-new-order').value;
//	if(orderCustNameNewOrder != null || typeof orderCustNameNewOrder !== "undefined"){
//		orderCustNameNewOrder = orderCustNameNewOrder.trim();
//	}
//	var orderCustSiteNewOrder = document.getElementById('select-order-customer-site-new-order').value;
//	if(orderCustSiteNewOrder != null || typeof orderCustSiteNewOrder !== "undefined"){
//		orderCustSiteNewOrder = orderCustSiteNewOrder.trim();
//	}

	var orderStatusUpdateOrder = document.getElementById('orderStatusId').value;
	if(orderStatusUpdateOrder != null || typeof orderStatusUpdateOrder !== "undefined"){
		orderStatusUpdateOrder = orderStatusUpdateOrder.trim();
	}
	var orderStatusListValue = (orderStatusUpdateOrder / 10) -1;
	
//	var newOrderStartDate = document.getElementById('orderUpdateStartDate').value;
////	var newOrderEndDate = document.getElementById('newOrderEndDate').value;
//	var newOrderStartTime = document.getElementById('startTimeDateBox').value;
//	var newOrderEndTime = document.getElementById('endTimeDateBox').value;
//	var newOrderDuration = document.getElementById('duration').value;
//	
//	var startTimeIndexOfColumn = newOrderStartTime.indexOf(":");
//	var startTimeHour = newOrderStartTime.slice(0,startTimeIndexOfColumn);
//	var startTimeMinute;
//	var indexOfAmPm;
//	
//	if((newOrderStartTime.indexOf("AM") > 0) || (newOrderStartTime.indexOf("PM") > 0)){
//		if(newOrderStartTime.indexOf("AM") > 0){
//			indexOfAmPm = newOrderStartTime.indexOf("AM");
//			startTimeMinute = newOrderStartTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
//		}
//		if(newOrderStartTime.indexOf("PM") > 0){
//			indexOfAmPm = newOrderStartTime.indexOf("PM");
//			startTimeHour = parseInt(startTimeHour) + 12; 
//			startTimeMinute = startTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
//		}
//	}
//	
//	var startTimeInMilliSec; 
//	if(typeof startTimeHour !== "undefined"){
//		startTimeInMilliSec = ((parseInt(startTimeHour))*60 + parseInt(startTimeMinute))*60*1000;
//	}
//	
//	var startDateTemp = new Date((new Date(newOrderStartDate)).getTime() + startTimeInMilliSec ); 
//	
//	var indexOfColumn = newOrderDuration.indexOf(":");
//	var eventDurationHour = newOrderDuration.slice(0,indexOfColumn);
//	var eventDurationMinute = newOrderDuration.slice(indexOfColumn+1);
//	var eventTotalTimeInMilliSec; 
//	if(typeof eventDurationHour !== "undefined"){
//		eventTotalTimeInMilliSec = ((parseInt(eventDurationHour))*60 + parseInt(eventDurationMinute))*60*1000;
//	}
//	
//	var endDateTemp = new Date(startDateTemp.getTime() + eventTotalTimeInMilliSec); 
//	
	var startDateUtc = start_date_utc; //CommonUtil.convertToUTC(startDateTemp);
	var endDateUtc = end_date_utc;
	
	var indexOfZero = startDateUtc.indexOf("-00");
    var startDateSub = startDateUtc.substring(0,indexOfZero);
    startDateSub = startDateSub+"GMT+0000";
    
    indexOfZero = endDateUtc.indexOf("-00");
    var endDateSub = endDateUtc.substring(0,indexOfZero);
    endDateSub = endDateSub+"GMT+0000";
	  
	console.log(' startDateSub '+startDateSub);
	console.log(' endDateSub '+endDateSub);

	var orderStartTime = (new Date(startDateSub)).getTime();
	var orderEndTime = (new Date(endDateSub)).getTime();
	
	var orderStartWindow = start_time; //newOrderStartTime; 
	var orderEndWindow = end_time; //newOrderEndTime; 
	
	var tsSt = CommonUtil.convertToUTC(new Date());
	indexOfZero = tsSt.indexOf("-00");
    var tsStampSub = tsSt.substring(0,indexOfZero);
    tsStampSub = tsStampSub+"GMT+0000";
    
	console.log(' tsStampSub '+tsStampSub);
	
	var tsStamp = new Date(tsStampSub).getTime();
	
	var result = null;
    $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	action: "saveorder",
     		cust_id : "197002",
     		cust_siteid : "197003",
     		cust_contactid : "",
     		event_geocode: 1,
     		extsys_id: '',
     		
     		start_date: startDateUtc,
     		end_date: endDateUtc,
     		
     		order_desc: order_desc,
     		order_id : orderId,
     		orderStartTime: orderStartTime,
     		orderEndTime: orderEndTime,
     		order_name: order_name,
     		
         	order_po: order_po,
         	order_typeid: order_typeid, //"1290126896255",
         	order_prtid: order_prtid, //"2",
         	order_inst : orderInst,
            order_wkfid : orderStatusListValue, //"1",
            order_recid : "N/A",
         	order_startwin: orderStartTime,
         	order_endwin: orderEndTime,
         	order_notes : "",
         	order_flg : "0|",
         	
         	res_id : res_id,
         	res_addid: res_addid,
         	reset : "0",
         	
         	type: "false",
         	//dragged : "false",
         	tstamp : tsStamp,
         	wkfid_upd : 0
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     }
   );
   alert(result);
 //	 alert("About to submit");
 });

 $('#order-task-add').live('click', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 
	 var taskTypeId = document.getElementById('select-order-task-add').value;
	 if(taskTypeId != null || typeof taskTypeId !== "undefined"){
		 taskTypeId = taskTypeId.trim();
	 } 
	 var taskHrsAdd = document.getElementById('taskHrsAdd').value;
	 if(taskHrsAdd != null || typeof taskHrsAdd !== "undefined"){
		 taskHrsAdd = taskHrsAdd.trim();
	 }
 	 	 	
	 var ordertask_id = 0; // new task for this order
	 var ordertask_typeid = 1; // res id, TODO
	 var tstamp = new Date().getTime();
	 
	 var result = null;
     $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	action: "saveordertask",
	  		order_id: orderId,
	  	    ordertask_id: ordertask_id, // new task for this order
	  	    ordertask_hrs: taskHrsAdd,
	  	    ordertask_typeid: ordertask_typeid, // res id, TODO
	        task_id: taskTypeId,
	  		tstamp:	tstamp
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     });
	 alert(result);
	 
//		var url = Ext.AceRoute.appUrl;
//   	    var loginref = Ext.AceRoute.loginref;
//	  		var action = "saveordertask";
//	  		var order_id = this.editTask_orderId;
//	  		var ordertask_id = this.editTask_ordertaskId; // new task for this order
//	  		var ordertask_hrs = this.editTask_orderTaskHrs;
//	  		var ordertask_typeid = 1; // res id, TODO
//	  		var task_id = this.editTask_taskTypeId;
//	  		var tstamp = new Date().getTime();
		
//		action:	action,
//       	//loginref: loginref,
//       	mtoken: Ext.AceRoute.loginref,
//	  		order_id: order_id,
//	  	    ordertask_id: ordertask_id, // new task for this order
//	  	    ordertask_hrs: ordertask_hrs,
//	  	    ordertask_typeid: ordertask_typeid, // res id, TODO
//	        task_id: task_id,
//	  		tstamp:	tstamp
 });

 $('#order-task-edit-save').live('click', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 var orderTaskId = sessionStorage.order_task_id;
	 
	 var taskTypeId = document.getElementById('select-order-task').value;
	 if(taskTypeId != null || typeof taskTypeId !== "undefined"){
		 taskTypeId = taskTypeId.trim();
	 } 
	 var taskHrs = document.getElementById('taskHrs').value;
	 if(taskHrs != null || typeof taskHrs !== "undefined"){
		 taskHrs = taskHrs.trim();
	 }
 	 	 	
	 var tstamp = new Date().getTime();
	 
	 var result = null;
     $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	action: "saveordertask",
	  		order_id: orderId,
	  	    ordertask_id: orderTaskId, // new task for this order
	  	    ordertask_hrs: taskHrs,
	  	    task_id: taskTypeId,
	  		tstamp:	tstamp
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     });
	 alert(result);
	 
//		action:	action,
//       	//loginref: loginref,
//       	mtoken: Ext.AceRoute.loginref,
//	  		order_id: order_id,
//	  	    ordertask_id: ordertask_id, // new task for this order
//	  	    ordertask_hrs: ordertask_hrs,
//	  	    ordertask_typeid: ordertask_typeid, // res id, TODO
//	        task_id: task_id,
//	  		tstamp:	tstamp
 });
 
 $('#order-task-edit-delete').live('click', function(event, ui) {
	 var orderTaskId = sessionStorage.order_task_id;
	 var result = null;
     $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	action: "deleteordertask",
	  		ordertask_id: orderTaskId
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     });
	 alert(result);
 });
 
 $('#order-part-add').live('click', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 
	 var partTypeId = document.getElementById('select-order-part-add').value;
	 if(partTypeId != null || typeof partTypeId !== "undefined"){
		 partTypeId = partTypeId.trim();
	 } 
	 var partQtyAdd = document.getElementById('partQtyAdd').value;
	 if(partQtyAdd != null || typeof partQtyAdd !== "undefined"){
		 partQtyAdd = partQtyAdd.trim();
	 }
 	 	 	
	 var orderpart_id = 0; // new task for this order
	 //var ordertask_typeid = 1; // res id, TODO
	 var tstamp = new Date().getTime();
	 
	 var result = null;
     $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	action: "saveorderpart",
	  		order_id: orderId,
	  		orderpart_id: orderpart_id, // new task for this order
	  		orderpart_qty: partQtyAdd,
	  		//orderpart_typeid: ordertask_typeid, // res id, TODO
	        part_id: partTypeId,
	  		tstamp:	tstamp
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     });
	 alert(result);
	 
//		var url = Ext.AceRoute.appUrl;
//   	    var loginref = Ext.AceRoute.loginref;
//	  		var action = "saveordertask";
//	  		var order_id = this.editTask_orderId;
//	  		var ordertask_id = this.editTask_ordertaskId; // new task for this order
//	  		var ordertask_hrs = this.editTask_orderTaskHrs;
//	  		var ordertask_typeid = 1; // res id, TODO
//	  		var task_id = this.editTask_taskTypeId;
//	  		var tstamp = new Date().getTime();
		
//		action:	action,
//       	//loginref: loginref,
//       	mtoken: Ext.AceRoute.loginref,
//	  		order_id: order_id,
//	  	    ordertask_id: ordertask_id, // new task for this order
//	  	    ordertask_hrs: ordertask_hrs,
//	  	    ordertask_typeid: ordertask_typeid, // res id, TODO
//	        task_id: task_id,
//	  		tstamp:	tstamp
 });
 
 $('#order-part-edit-save').live('click', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 var orderPartId = sessionStorage.order_part_id;
	 
	 var partTypeId = document.getElementById('select-order-part').value;
	 if(partTypeId != null || typeof partTypeId !== "undefined"){
		 partTypeId = partTypeId.trim();
	 } 
	 var partQty = document.getElementById('partQty').value;
	 if(partQty != null || typeof partQty !== "undefined"){
		 partQty = partQty.trim();
	 }
 	 	 	
	 var tstamp = new Date().getTime();
	 
	 var result = null;
     $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	 mtoken: mtoken,
         	 action: "saveorderpart",
 	  		 order_id: orderId,
 	  		 orderpart_id: orderPartId, 
 	  		 orderpart_qty: partQty,
 	  		 //orderpart_typeid: ordertask_typeid, // res id, TODO
 	         part_id: partTypeId,
 	  		 tstamp:	tstamp
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     });
	 alert(result);
	 
//		action:	action,
//       	//loginref: loginref,
//       	mtoken: Ext.AceRoute.loginref,
//	  		order_id: order_id,
//	  	    ordertask_id: ordertask_id, // new task for this order
//	  	    ordertask_hrs: ordertask_hrs,
//	  	    ordertask_typeid: ordertask_typeid, // res id, TODO
//	        task_id: task_id,
//	  		tstamp:	tstamp
 });
  
 $('#order-part-edit-delete').live('click', function(event, ui) {
	 var orderPartId = sessionStorage.order_part_id;
	 var result = null;
     $.ajax({
         url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
         type: 'post',
         data: {
        	mtoken: mtoken,
        	action: "deleteorderpart",
        	orderpart_id: orderPartId
         },
         async: false,
         cache: false,
         success: function(data) 
         {
             result = data;
         }
     });
	 alert(result);
 });
 
 $('#button-signature-save').live('click', function(event, ui) {
	 var orderId = sessionStorage.order_id;
	 var file_geocode = 1; 
 	 var file_type = 2; // for signature
	 var jpegImage = drawingApp.save();
	 var result = null;
     $.ajax(
         {
             url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
             type: 'post',
             data: {
            	mtoken: mtoken,
             	action:	"savefile",
             	order_id: orderId,
             	contentType:"application/x-www-form-urlencoded",
     	  	    file_geocode: file_geocode, // new task for this order
     	  	    file_type: file_type,
     	  		file: jpegImage 
             },
             async: false,
             cache: false,
             success: function(data) 
             {
                 result = data;
             }
         }
     );
     alert(result);
 });

 
 $('#order-resource-add').live('click', function(event, ui) {
	 
	 var orderId = sessionStorage.order_id;
	 var orderResId = document.getElementById('select-order-resource-add').value;
	 
	 var orderData = findDataById(ordersXmlDataStore,
	 			'data', 'event','id', orderId);
	 var res_id = orderData.find('res_id').text();
	 if( res_id != null || typeof res_id !== "undefined"){
	 	 res_id = res_id.trim();
	 }
	 
	 var res_addid = orderData.find('res_addid').text();
	 
	 if(typeof res_addid !== "undefined" && res_addid !== ""){
		   res_addid = res_addid + "|" + orderResId;
	 }else{
		   res_addid = orderResId;
	 }
 	
 	//var loginref = "12345";
 	var action = "saveorder";
 	
 	var order_desc = orderData.find('order_desc').text();
 	if( order_desc != null || typeof order_desc !== "undefined"){
 		order_desc = order_desc.trim();
 	}
 	var orderInst = orderData.find('order_inst').text();
 	if( orderInst != null || typeof orderInst !== "undefined"){
 		 orderInst = orderInst.trim();
 	}
 	var order_name = orderData.find('order_name').text();
 	if( order_name != null || typeof order_name !== "undefined"){
 		order_name = order_name.trim();
 	}
 	var order_po = orderData.find('order_po').text();
 	if( order_po != null || typeof order_po !== "undefined"){
 		order_po = order_po.trim();
 	}
 	var order_prtid = orderData.find('order_prtid').text();
 	if( order_prtid != null || typeof order_prtid !== "undefined"){
 		order_prtid = order_prtid.trim();
 	}
 	var order_typeid = orderData.find('order_typeid').text();
 	if( order_typeid != null || typeof order_typeid !== "undefined"){
 		order_typeid = order_typeid.trim();
 	}
 		
 	var start_date_utc = orderData.find('start_date').text();
 	if( start_date_utc != null || typeof start_date_utc !== "undefined"){
 		start_date_utc = start_date_utc.trim();
 	}
 	var end_date_utc = orderData.find('end_date').text();
 	if( end_date_utc != null || typeof end_date_utc !== "undefined"){
 		end_date_utc = end_date_utc.trim();
 	}
 	var start_time = orderData.find('order_startwin').text();
 	if( start_time != null || typeof start_time !== "undefined"){
 		start_time = start_time.trim();
 	}
 	var end_time = orderData.find('order_endwin').text();
 	if( end_time != null || typeof end_time !== "undefined"){
 		end_time = end_time.trim();
 	}
 	
 	var order_wkfid = orderData.find('order_wkfid').text();
 	if( order_wkfid != null || typeof order_wkfid !== "undefined"){
 		order_wkfid = order_wkfid.trim();
 	}
 	
 	var startDateUtc = start_date_utc; //CommonUtil.convertToUTC(startDateTemp);
 	var endDateUtc = end_date_utc;
 	
 	var indexOfZero = startDateUtc.indexOf("-00");
    var startDateSub = startDateUtc.substring(0,indexOfZero);
    startDateSub = startDateSub+"GMT+0000";
     
    indexOfZero = endDateUtc.indexOf("-00");
    var endDateSub = endDateUtc.substring(0,indexOfZero);
    endDateSub = endDateSub+"GMT+0000";
 	  
 	console.log(' startDateSub '+startDateSub);
 	console.log(' endDateSub '+endDateSub);

 	var orderStartTime = (new Date(startDateSub)).getTime();
 	var orderEndTime = (new Date(endDateSub)).getTime();
 	
 	var orderStartWindow = start_time; //newOrderStartTime; 
 	var orderEndWindow = end_time; //newOrderEndTime; 
 	
 	var tsSt = CommonUtil.convertToUTC(new Date());
 	indexOfZero = tsSt.indexOf("-00");
    var tsStampSub = tsSt.substring(0,indexOfZero);
    tsStampSub = tsStampSub+"GMT+0000";
     
 	console.log(' tsStampSub '+tsStampSub);
 	
 	var tsStamp = new Date(tsStampSub).getTime();
 	
 	var result = null;
    $.ajax({
          url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
          type: 'post',
          data: {
         	mtoken: mtoken,
         	action: "saveorder",
      		cust_id : "197002",
      		cust_siteid : "197003",
      		cust_contactid : "",
      		event_geocode: 1,
      		extsys_id: '',
      		
      		start_date: startDateUtc,
      		end_date: endDateUtc,
      		
      		order_desc: order_desc,
      		order_id : orderId,
      		orderStartTime: orderStartTime,
      		orderEndTime: orderEndTime,
      		order_name: order_name,
      		
          	order_po: order_po,
          	order_typeid: order_typeid, 
          	order_prtid: order_prtid, 
          	order_inst : orderInst,
            order_wkfid : order_wkfid, 
            order_recid : "N/A",
          	order_startwin: orderStartTime,
          	order_endwin: orderEndTime,
          	order_notes : "",
          	order_flg : "0|",
          	
          	res_id : res_id,
          	res_addid: res_addid,
          	reset : "0",
          	
          	type: "false",
          	//dragged : "false",
          	tstamp : tsStamp,
          	wkfid_upd : 0
          },
          async: false,
          cache: false,
          success: function(data) 
          {
              result = data;
          }
      }
    );
	alert(result);
 });
 
 $('#order-resource-edit-delete').live('click', function(event, ui) {
	 
	 var orderId = sessionStorage.order_id;
	 var orderResId = sessionStorage.resourceId;
	 var orderData = findDataById(ordersXmlDataStore,
	 			'data', 'event','id', orderId);
	 
	 var res_addid = orderData.find('res_addid').text(); // vwData.res_addid; //default
	 
 	 var newResAddId = '';
 	 console.log(" before delete, res_addid "+res_addid);
 	 if(typeof res_addid !== "undefined"){
 	 	if(res_addid.indexOf(orderResId) >= 0){
 			var index = res_addid.indexOf(orderResId);
 			if(index >= 0){
 				var resources = res_addid.split("|");
 				for(i=0; i<resources.length; i++){
 					if(resources[i] !== orderResId){
 						newResAddId += resources[i] + "|";
 					} 
 				}
 			}
 	 	}
 	 }
 	
 	//var loginref = "12345";
 	var action = "saveorder";
 	
 	var order_desc = orderData.find('order_desc').text();
 	if( order_desc != null || typeof order_desc !== "undefined"){
 		order_desc = order_desc.trim();
 	}
 	var orderInst = orderData.find('order_inst').text();
 	if( orderInst != null || typeof orderInst !== "undefined"){
 		 orderInst = orderInst.trim();
 	}
 	var order_name = orderData.find('order_name').text();
 	if( order_name != null || typeof order_name !== "undefined"){
 		order_name = order_name.trim();
 	}
 	var order_po = orderData.find('order_po').text();
 	if( order_po != null || typeof order_po !== "undefined"){
 		order_po = order_po.trim();
 	}
 	var order_prtid = orderData.find('order_prtid').text();
 	if( order_prtid != null || typeof order_prtid !== "undefined"){
 		order_prtid = order_prtid.trim();
 	}
 	var order_typeid = orderData.find('order_typeid').text();
 	if( order_typeid != null || typeof order_typeid !== "undefined"){
 		order_typeid = order_typeid.trim();
 	}
 	
 	var res_id = orderData.find('res_id').text();
 	if( res_id != null || typeof res_id !== "undefined"){
 		res_id = res_id.trim();
 	}
 	
 	var start_date_utc = orderData.find('start_date').text();
 	if( start_date_utc != null || typeof start_date_utc !== "undefined"){
 		start_date_utc = start_date_utc.trim();
 	}
 	var end_date_utc = orderData.find('end_date').text();
 	if( end_date_utc != null || typeof end_date_utc !== "undefined"){
 		end_date_utc = end_date_utc.trim();
 	}
 	var start_time = orderData.find('order_startwin').text();
 	if( start_time != null || typeof start_time !== "undefined"){
 		start_time = start_time.trim();
 	}
 	var end_time = orderData.find('order_endwin').text();
 	if( end_time != null || typeof end_time !== "undefined"){
 		end_time = end_time.trim();
 	}
 	
 	var order_wkfid = orderData.find('order_wkfid').text();
 	if( order_wkfid != null || typeof order_wkfid !== "undefined"){
 		order_wkfid = order_wkfid.trim();
 	}
 	
 	var startDateUtc = start_date_utc; //CommonUtil.convertToUTC(startDateTemp);
 	var endDateUtc = end_date_utc;
 	
 	var indexOfZero = startDateUtc.indexOf("-00");
    var startDateSub = startDateUtc.substring(0,indexOfZero);
    startDateSub = startDateSub+"GMT+0000";
     
    indexOfZero = endDateUtc.indexOf("-00");
    var endDateSub = endDateUtc.substring(0,indexOfZero);
    endDateSub = endDateSub+"GMT+0000";
 	  
 	console.log(' startDateSub '+startDateSub);
 	console.log(' endDateSub '+endDateSub);

 	var orderStartTime = (new Date(startDateSub)).getTime();
 	var orderEndTime = (new Date(endDateSub)).getTime();
 	
 	var orderStartWindow = start_time; //newOrderStartTime; 
 	var orderEndWindow = end_time; //newOrderEndTime; 
 	
 	var tsSt = CommonUtil.convertToUTC(new Date());
 	indexOfZero = tsSt.indexOf("-00");
    var tsStampSub = tsSt.substring(0,indexOfZero);
    tsStampSub = tsStampSub+"GMT+0000";
     
 	console.log(' tsStampSub '+tsStampSub);
 	
 	var tsStamp = new Date(tsStampSub).getTime();
 	
 	var result = null;
    $.ajax({
          url: AceRoute.appBaseUrl+'/dataReceiverPost.jsp',
          type: 'post',
          data: {
         	mtoken: mtoken,
         	action: "saveorder",
      		cust_id : "197002",
      		cust_siteid : "197003",
      		cust_contactid : "",
      		event_geocode: 1,
      		extsys_id: '',
      		
      		start_date: startDateUtc,
      		end_date: endDateUtc,
      		
      		order_desc: order_desc,
      		order_id : orderId,
      		orderStartTime: orderStartTime,
      		orderEndTime: orderEndTime,
      		order_name: order_name,
      		
          	order_po: order_po,
          	order_typeid: order_typeid, 
          	order_prtid: order_prtid, 
          	order_inst : orderInst,
            order_wkfid : order_wkfid, 
            order_recid : "N/A",
          	order_startwin: orderStartTime,
          	order_endwin: orderEndTime,
          	order_notes : "",
          	order_flg : "0|",
          	
          	res_id : res_id,
          	res_addid: res_addid,
          	reset : "0",
          	
          	type: "false",
          	//dragged : "false",
          	tstamp : tsStamp,
          	wkfid_upd : 0
          },
          async: false,
          cache: false,
          success: function(data) 
          {
              result = data;
          }
      }
    );
	alert(result);
 });
  
 function displayMapforAllOrders(ordersDataStore, latitude, longitude){
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
	 	var latitude,longitude; 
	    
		//displayMap(orderData, centerLatLng, latitude, longitude);
		$(ordersDataStore).find('data').each(function(){
			var i = 0;
			$(this).find('event').each(function(){
				
			    var orderData = $(this);
			    var mObj = new mapObj();
			   
			    var startDate = orderData.find('start_date').text();
				var endDate = orderData.find('end_date').text();
				var startTime = getTime(startDate);
			 	var endTime = getTime(endDate);
			 	var duration = getOrderDuration(startDate, endDate);
			 	
			 	var order_wkfid = orderData.find('order_wkfid').text();
				var orderId = orderData.find('id').text();
				var orderName = orderData.find('order_name').text();
				var orderPO = orderData.find('order_po').text();
				var site_geocode = orderData.find('site_geocode').text();
				var siteAddr = orderData.find('site_addr').text();
				
				var resourceId = orderData.find('res_id').text();
				var resourceData = findDataById(resourceXmlDataStore,
						'data', 'res','res_id', resourceId);
				var resourceName = $(resourceData).find('res_name').text();
				
				var custContactId = orderData.find('cust_contactid').text();
				var custData = findDataById(customerXmlDataStore,
						'data', 'cust','cust_id', custContactId);
			    var custName = $(custData).find("cust_name").text();
			    
				var current_date = new Date();
				var start_date = new Date(startDate);
				var end_date = new Date(endDate);
				var iconClr = CommonUtil.getIconColor(
						  current_date, start_date, end_date, order_wkfid );
				
				mObj.geoCode = site_geocode;
				mObj.seqLabel = i;
				mObj.iconClr = iconClr; 
				mObj.startTime = startTime;
			    mObj.endTime = endTime;
			    mObj.orderAddress = siteAddr.formatAddress(",");
			    mObj.orderId = orderId;
			    mObj.orderName = orderName;
			    mObj.orderPO = orderPO;
			    mObj.resourceName = resourceName;
			    mObj.custName = custName;
			    
				mapObjArray.push(mObj);
				i++;
			});
		 });
//	 	var orderId = sessionStorage.order_id;
//	 	var orderData = findDataById(ordersXmlDataStore,
//				'data', 'event','id', orderId);
//	    var siteGeoCode = $(orderData).find("site_geocode").text();
//	    console.log('siteGeoCode '+siteGeoCode);
//	    var indexOfComma = siteGeoCode.indexOf(",");
//		var latitude = siteGeoCode.substring(0, indexOfComma);
//		latitude = latitude.trim();
//		var longitude = siteGeoCode.substring(indexOfComma+1, 
//				siteGeoCode.length);
//		longitude = longitude.trim();
		console.log('latitude '+latitude);
	 	
	 	if(AceRoute.isDevSystem || 
	 		(typeof latitude === "undefined" && typeof longitude === "undefined") )
	 	{
	 		if(mapObjArray != null && mapObjArray.length > 0){
	 			var mObject = mapObjArray[0];
	 		 	var orderId = mObject.orderId; //sessionStorage.order_id;
	 		 	console.log(' mObject orderId '+orderId);
	 		 	var orderData = findDataById(ordersXmlDataStore,
	 					'data', 'event','id', orderId);
	 		    var siteGeoCode = $(orderData).find("site_geocode").text();
	 		    console.log('siteGeoCode '+siteGeoCode);
	 		    var indexOfComma = siteGeoCode.indexOf(",");
	 			var latitude = siteGeoCode.substring(0, indexOfComma);
	 			latitude = latitude.trim();
	 			var longitude = siteGeoCode.substring(indexOfComma+1, 
	 					siteGeoCode.length);
	 			longitude = longitude.trim();
	 			console.log('latitude '+latitude+' longitude '+longitude);
	 		}
	 	}
	 	
		var centerLatLng = new google.maps.LatLng(latitude,longitude);
		
		var posArray = new Array();
	 	 if(mapObjArray != null){
	 		for(var index=0;index < mapObjArray.length;index++){
	 			var geoCode = mapObjArray[index].geoCode;
	     		var indexOfComma = geoCode.indexOf(",");
	 	    	var latitude = geoCode.substring(0, indexOfComma);
	 	    	latitude = latitude.trim();
	 	    	var longitude = geoCode.substring(indexOfComma+1, geoCode.length);
	 	    	longitude = longitude.trim();
	 	    	console.log(' latitude '+latitude+' longitude '+longitude);
	 	    	var position = new google.maps.LatLng(latitude,longitude);  //Sencha HQ
	 	    	posArray.push(position);
	 		}
	 	 }
	 	 
	 	map = new google.maps.Map(
	 			document.getElementById('map_canvas'), 
	 			{
	 		       zoom: 8,
	 		       center: centerLatLng,
	 		       mapTypeId: google.maps.MapTypeId.ROADMAP,
	 		       navigationControl: true,
	 		       navigationControlOptions: {
	 		           style: google.maps.NavigationControlStyle.DEFAULT
	 		       }
	 			}
	 		);
	 	
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
	                //shadow: shadow,
	                icon  : image,
	                map: map
	            }); 
				var mObj = new mapObj();
				
				mObj.seqLabel = mapObjArray[index].seqLabel;
				mObj.startTime = mapObjArray[index].startTime;
			    mObj.endTime = mapObjArray[index].endTime;
			    mObj.orderAddress = mapObjArray[index].orderAddress;
			    mObj.orderId = mapObjArray[index].orderId;
			    mObj.orderName = mapObjArray[index].orderName;
			    mObj.orderPO = mapObjArray[index].orderPO;
			    mObj.resourceName = mapObjArray[index].resourceName;
			    mObj.custName = mapObjArray[index].custName;
			    
				var message = getMarkerMessage( mObj,
							latitude1,
							longitude1
						);
				attachMessage(message,map, marker );
//				var styleIcon = new StyledIcon(StyledIconTypes.BUBBLE,{color:"green",text:message});
//			    var styleMaker1 = new StyledMarker({styleIcon:styleIcon,position:new google.maps.LatLng(37.383477473067, -121.880502070713),map:map});
//			    var styleMaker2 = new StyledMarker({styleIcon:styleIcon,position:new google.maps.LatLng(37.263477473067, -121.880502070713),map:map});
			    
//				//console.log(" index "+index+" message "+message);
//				//this.attachMessage(map, marker, message, appTabPanel, orderMapPanel, orderData);
				
//	        	pos = posArray[index];
//	        	console.log(pos);
//	        	map.panTo (pos);
//	        	setTimeout( function(){ map.panTo (pos); } , 1000);
	        }
		}
 }
 
 function attachMessage(message,map, marker ){
	 var infowindow = new google.maps.InfoWindow(
	  	      { content: message,
	  	        size: new google.maps.Size(30,30)
	  	      }); 
	 	google.maps.event.addListener(marker, 'click', function() {
//	       infowindow.open(map,marker);
	 		var infoBox = new InfoBox({message: message, latlng: marker.getPosition(), map: map});
	   });
 }
 
 function getMarkerMessage(mObj,
			latitude1,
			longitude1
	){
	    var time = mObj.startTime+" - "+mObj.endTime;
		var message = "<div class='displayOrderDetailOnMap'>" +
					  "		<b>"+mObj.seqLabel+"</b><br/>"+  
				      " <div class='elementsWrapper'> <div class='elements-label'>Time: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <div class='elements-value'>"+time+" </div><div class='clear'></div></div>"+
				      " <div class='elementsWrapper'> <div class='elements-label'>Worker: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <div class='elements-value'>"+mObj.resourceName+" </div><div class='clear'></div></div>"+
				      " <div class='elementsWrapper'> <div class='elements-label'>Order: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <div class='elements-value'>"+mObj.orderName+" </div><div class='clear'></div></div>"+
				      " <div class='elementsWrapper'> <div class='elements-label'>ID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <div class='elements-value'>"+mObj.orderPO+" </div><div class='clear'></div></div>"+
				      " <div class='elementsWrapper'> <div class='elements-label'>Customer: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <div class='elements-value'>"+mObj.custName+" </div><div class='clear'></div></div>"+
				      " <div class='elementsWrapper'> <div class='elements-label'>Address: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <div class='elements-value'>"+mObj.orderAddress+"</div><div class='clear'></div></div>"+
							  //mapObjArray[index].orderStartDate+" "+
							  //mapObjArray[index].orderStartTime+
					  //"		<input type='button' name='button-map-navigate-address' value='Navigate' class='x-button-label' onclick='navigate("+ latitude1 + ","+ longitude1 +")'/>"+
					  "		<a style='display:inline-block;	font-size: 10pt; width:70px; height:15px; padding:5px; " +
					  "					border:1px #D7D7D7 solid; text-align:center; text-decoration:none; " +
					  "					color:#666666;  " +
					  "					-webkit-border-radius: 6em 6em 6em 6em;"+
					  "					-moz-border-radius: 6em 6em 6em 6em;"+
					  "					border-radius: 6em 6em 6em 6em;" +
					  "					background: -webkit-gradient(linear, 0% 85%, 0% 100%, from(white), to(red));' " +
					  "					href='html/aceroute.html#orderdetail' data-transition='slide'" +
					  "					onclick='sessionStorage.order_id="+mObj.orderId+"'>Navigate</a>"+
					  
					  "		<a style='display:inline-block;	font-size: 10pt; width:50px; height:15px; padding:5px; " +
					  "					border:1px #D7D7D7 solid; text-align:center; text-decoration:none; " +
					  "					color:#666666;  " +
					  "					-webkit-border-radius: 6em 6em 6em 6em;"+
					  "					-moz-border-radius: 6em 6em 6em 6em;"+
					  "					border-radius: 6em 6em 6em 6em;" +
					  "					background: -webkit-gradient(linear, 0% 85%, 0% 100%, from(white), to(red));' " +
					  "					href='html/aceroute.html#orderdetail' data-transition='slide'" +
					  "					onclick='sessionStorage.order_id="+mObj.orderId+"' >Edit</a>"+
					  "</div>";
		console.log(' message '+message);
		return message;
 }
 
 function getOrderDetails(orderId){
	 
	 var orderHtmlStr = '';
	 var customerHtmlStr = '';
	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
 	 
	 orderHtmlStr = getOrderDataHtml(orderData);
	 customerHtmlStr = getCustomerDataHtml(orderData);
	 
	 var orders_data = $('#order-detail-div-overall');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(orderHtmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
	
	 var orderHtmlFooterStr = getOrderDataFooterHtml(orderData);
	 var orders_data_footer = $('#order-detail-div-overall-footer');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data_footer.html(orderHtmlFooterStr).trigger("create");//trigger("create"); //.trigger("refresh");
	 //	var customer_data = $('#customerinfo #customerfields');
	 //	//orders_list.empty();
	 //	//orders_list.html(htmlStr);
	 //	customer_data.html(customerHtmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function getOrderInfoDetails(orderId){
	 var htmlStr = '';
	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 
	 var cust_id = orderData.find('cust_id').text();
	 if( cust_id != null || typeof cust_id !== "undefined"){
		 cust_id = cust_id.trim();
	 }
	 var custName = orderData.find('cust_name').text();
	 if( custName != null || typeof custName !== "undefined"){
		 custName = custName.trim();
	 }
	 var contactName = orderData.find('contact_name').text();
	 if( contactName != null || typeof contactName !== "undefined"){
		 contactName = contactName.trim();
	 }
	 var orderName = orderData.find('order_name').text();
	 if( orderName != null || typeof orderName !== "undefined"){
		 orderName = orderName.trim();
	 }
	 var orderPO = orderData.find('order_po').text();
	 if( orderPO != null || typeof orderPO !== "undefined"){
		 orderPO = orderPO.trim();
	 }
	 var orderInst = orderData.find('order_inst').text();
	 if( orderInst != null || typeof orderInst !== "undefined"){
		 orderInst = orderInst.trim();
	 }
	 var orderTypeId = orderData.find('order_typeid').text();
	 if( orderTypeId != null || typeof orderTypeId !== "undefined"){
		 orderTypeId = orderTypeId.trim();
	 }
	 var orderPrtId = orderData.find('order_prtid').text();
	 if( orderPrtId != null || typeof orderPrtId !== "undefined"){
		 orderPrtId = orderPrtId.trim();
	 }
	 
	 var siteAddr = orderData.find('site_addr').text();
	 // siteAddr = siteAddr.formatAddress(',');
	 
//	 var custData = findDataById(customerXmlDataStore,
//				'data', 'cust','cust_id', cust_id);
//	 var custName = $(custData).find("cust_name").text();
	 
//	 var custContactXmlStore = $.getValues(AceRoute.appUrl+
//				 "?mtoken="+mtoken+"&action=getcontact&cust_id="+cust_id);
//	 var custContactData = findDataById(custContactXmlStore,
//				'data', 'contact','cust_id', cust_id);
//	 var contactName = $(custContactData).find("contact_name").text();
	 
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 htmlStr = htmlStr + '<div class="orderlistOuterWrapper">'+
		'<div>'+
			'<label for="name">Customer Name:</label>'+
			'<div data-role="fieldcontain">'+
		  	    '<input name=\"custName\" type=\"text\" value ="'+custName+ '" id=\"custName\" />'+
		  	'</div>'+
		  	'<label for="name">Address:</label>'+
			'<div data-role="fieldcontain">'+
		  	    '<input name=\"siteAddr\" type=\"text\" value ="'+siteAddr+ '" id=\"custName\" />'+
		  	'</div>'+
		  	'<label for="name">Contact Name:</label>'+
			'<div data-role="fieldcontain">'+
		  	    '<input name=\"contactName\" type=\"text\" value ="'+contactName+ '" id=\"custName\" />'+
		  	'</div>'+
		  	'<label for="name">PO#:</label>'+
			'<div data-role="fieldcontain">'+
		  	    '<input name=\"orderPO\" id=\"orderPO\" type=\"text\" value ="'+orderPO+ '" id=\"custName\" />'+
		  	'</div>'+
		  	'<label for="name">Instructions:</label>'+
			'<div data-role="fieldcontain">'+
		  	    '<input name=\"orderInst\" id=\"orderInst\" type=\"text\" value ="'+orderInst+ '" id=\"custName\" />'+
		  	'</div>'+
		  	
		'</div>'+	
	'</div>';
	 
	 var orderTypehtmlStr = "";
	 orderTypehtmlStr = orderTypehtmlStr + '<label for="select-order-type-update-order" class="select">Order Type</label>';
	 orderTypehtmlStr = orderTypehtmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 orderTypehtmlStr = orderTypehtmlStr + '<select name="select-order-type-update-order" id="select-order-type-update-order" data-native-menu="false">';
	 
	 $(orderTypeXmlDataStore).find('data').each(function(){
		$(this).find('ordertype').each(function(){
			var orderTypeIdLocal = $(this).find('ordertype_id').text();
			if( orderTypeIdLocal != null || typeof orderTypeIdLocal !== "undefined"){
				orderTypeIdLocal = orderTypeIdLocal.trim();
			}
			var orderTypeName = $(this).find('ordertype_name').text();
			if(orderTypeId == orderTypeIdLocal){
				orderTypehtmlStr = orderTypehtmlStr + '	<option value="'+orderTypeIdLocal+'" selected="selected">'+orderTypeName+'</option>';
			}else{
				orderTypehtmlStr = orderTypehtmlStr + '	<option value="'+orderTypeIdLocal+'">'+orderTypeName+'</option>';
			}
		});
	 });
	 orderTypehtmlStr = orderTypehtmlStr + '	</select>';
	 orderTypehtmlStr = orderTypehtmlStr + '</div>';
	 
	 var orderPriorityhtmlStr = "";
	 //orderPriorityhtmlStr = orderPriorityhtmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '<label for="select-order-priority-update-order" class="select">Priority</label>';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '<select name="select-order-priority-update-order" id="select-order-priority-update-order" data-native-menu="false">';
	 
	 $(orderPriorityTypeXmlDataStore).find('data').each(function(){
		$(this).find('orderpriority').each(function(){
			var orderPriorityId = $(this).find('orderpriority_id').text();
			if( orderPriorityId != null || typeof orderPriorityId !== "undefined"){
				orderPriorityId = orderPriorityId.trim();
			}
			var orderPriorityName = $(this).find('orderpriority_name').text();
			if(orderPrtId == orderPriorityId){
				orderPriorityhtmlStr = orderPriorityhtmlStr + '	<option value="'+orderPriorityId+'" selected="selected">'+orderPriorityName+'</option>';
			}else{
				orderPriorityhtmlStr = orderPriorityhtmlStr + '	<option value="'+orderPriorityId+'">'+orderPriorityName+'</option>';
			}
		});
	 });
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '	</select>';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '</div>';
	 
	 htmlStr = htmlStr + orderTypehtmlStr + orderPriorityhtmlStr;
//	 var startDateHtml = getStartDateHtml(startDate);
//	 htmlStr = htmlStr + startDateHtml;
//	    
	 var orders_data = $('#order-details-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function showMainMenuHtml(){
	 var htmlStr = "";
//	 htmlStr = htmlStr + '		<li><a href="#order-details" data-role="tab" data-icon="grid" class="ui-btn-active">Details</a></li>';
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 htmlStr = htmlStr + '<div data-role="navbar">';
	 htmlStr = htmlStr + '	<ul>';
	 htmlStr = htmlStr + '		<li><a href="#main-screen-menu-preferences" data-role="tab" data-icon="grid" class="ui-btn-active">Preferences</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#main-screen-menu-refreshnow" data-role="tab" data-icon="grid">Refresh Now</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#main-screen-menu-logout" data-role="tab" data-icon="grid">Logout</a></li>';
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + ' </div>';
	 var orders_data = $('#main-screen-menu-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 //orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
	 
//	 htmlStr = "";
//	 htmlStr = htmlStr + '<div data-role="navbar">';
//	 htmlStr = htmlStr + '	<ul>';
//	 htmlStr = htmlStr + '		<li><div class="ui-block-b" style="width: 25%;"><button id="button-save-new-order" type="button" data-theme="a">Save</button></div></li>';
//	 htmlStr = htmlStr + '	</ul>';
//	 htmlStr = htmlStr + ' </div>';
//	 
//	 var orders_data_footer = $('#order-add-new-div-footer');
//	 //orders_list.empty();
//	 //orders_list.html(htmlStr);
//	 orders_data_footer.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function showAddNewOrderHtml(){
	 
	 var htmlStr = "";
//	 htmlStr = htmlStr + '		<li><a href="#order-details" data-role="tab" data-icon="grid" class="ui-btn-active">Details</a></li>';
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 htmlStr = htmlStr + '<div data-role="navbar">';
	 htmlStr = htmlStr + '	<ul>';
	 htmlStr = htmlStr + '		<li><a href="#order-add-new-order-details" data-role="tab" data-icon="grid" class="ui-btn-active">Details</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-add-new-order-customer" data-role="tab" data-icon="grid">Customer</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-add-new-order-date-time" data-role="tab" data-icon="grid">Date/Time</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-add-new-order-status" data-role="tab" data-icon="grid">Status</a></li>';
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + ' </div>';
	 var orders_data = $('#order-add-new-order-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
	 
//	 htmlStr = "";
//	 htmlStr = htmlStr + '<div data-role="navbar">';
//	 htmlStr = htmlStr + '	<ul>';
//	 htmlStr = htmlStr + '		<li><div class="ui-block-b" style="width: 25%;"><button id="button-save-new-order" type="button" data-theme="a">Save</button></div></li>';
//	 htmlStr = htmlStr + '	</ul>';
//	 htmlStr = htmlStr + ' </div>';
//	 
//	 var orders_data_footer = $('#order-add-new-div-footer');
//	 //orders_list.empty();
//	 //orders_list.html(htmlStr);
//	 orders_data_footer.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function getAddNewOrderDetailPageHtml(){
	
	 var orderAddNewHtmlStr = "";
	 
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 htmlStr = htmlStr + '<label for="name">Order Name</label>';
	 htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
	 htmlStr = htmlStr + '			<input type="text" name="orderNameNew" id="orderNameNew" value=""/>';
     htmlStr = htmlStr + '		</div>';
	    
     htmlStr = htmlStr + '<label for="name">Order PO#</label>';
	 htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
	 htmlStr = htmlStr + '			<input type="text" name="orderPoNew" id="orderPoNew" value=""/>';
     htmlStr = htmlStr + '		</div>';
     orderAddNewHtmlStr = orderAddNewHtmlStr + htmlStr;
     
	 var orderTypehtmlStr = "";
	 orderTypehtmlStr = orderTypehtmlStr + '<label for="select-order-type-new-order" class="select">Tasks:</label>';
	 orderTypehtmlStr = orderTypehtmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 orderTypehtmlStr = orderTypehtmlStr + '<select name="select-order-type-new-order" id="select-order-type-new-order" data-native-menu="false">';
	 
	 $(orderTypeXmlDataStore).find('data').each(function(){
			$(this).find('ordertype').each(function(){
			var orderTypeId = $(this).find('ordertype_id').text();
			var orderTypeName = $(this).find('ordertype_name').text();
			orderTypehtmlStr = orderTypehtmlStr + '	<option value="'+orderTypeId+'">'+orderTypeName+'</option>';
		});
	 });
	 orderTypehtmlStr = orderTypehtmlStr + '	</select>';
	 orderTypehtmlStr = orderTypehtmlStr + '</div>';
	 
	 var orderPriorityhtmlStr = "";
	 //orderPriorityhtmlStr = orderPriorityhtmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '<label for="select-order-priority-new-order" class="select">Priority</label>';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '<select name="select-order-priority-new-order" id="select-order-priority-new-order" data-native-menu="false">';
	 
	 $(orderPriorityTypeXmlDataStore).find('data').each(function(){
			$(this).find('orderpriority').each(function(){
			var orderPriorityId = $(this).find('orderpriority_id').text();
			var orderPriorityName = $(this).find('orderpriority_name').text();
			orderPriorityhtmlStr = orderPriorityhtmlStr + '	<option value="'+orderPriorityId+'">'+orderPriorityName+'</option>';
		});
	 });
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '	</select>';
	 orderPriorityhtmlStr = orderPriorityhtmlStr + '</div>';
	 orderAddNewHtmlStr = orderAddNewHtmlStr + orderTypehtmlStr + orderPriorityhtmlStr;
	 
	 var order_add_new_order = $('#order-add-new-order-details-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 order_add_new_order.html(orderAddNewHtmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
	 
 }
 
 function getAddNewOrderCustomerPageHtml(){
		
	 var orderAddNewHtmlStr = "";
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	
     orderAddNewHtmlStr = orderAddNewHtmlStr + htmlStr;
     
	 var custhtmlStr = "";
	 custhtmlStr = custhtmlStr + '<label for="select-order-customer-name-new-order" class="select">Customer Name</label>';
	 custhtmlStr = custhtmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 custhtmlStr = custhtmlStr + '<select name="select-order-customer-name-new-order" id="select-order-customer-name-new-order" data-native-menu="false">';
	 
	 var firstcustid = '';
	 $(customerXmlDataStore).find('data').each(function(){
		$(this).find('cust').each(function(){
			var custId = $(this).find('cust_id').text();
			var custName = $(this).find('cust_name').text();
			if(firstcustid == ''){
				firstcustid = custId; 
			}
			custhtmlStr = custhtmlStr + '	<option value="'+custId+'">'+custName+'</option>';
		});
	 });
	 custhtmlStr = custhtmlStr + '	</select>';
	 custhtmlStr = custhtmlStr + '</div>';
	 
	 var custSiteHtmlStr = getAddNewOrderCustomerSiteHtml(true);
	 orderAddNewHtmlStr = orderAddNewHtmlStr + custhtmlStr + custSiteHtmlStr;
	 
	 var order_add_new_order = $('#order-add-new-order-customer-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 order_add_new_order.html(orderAddNewHtmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
	 
	 console.log(' firstcustid '+firstcustid);
	 
	 // https://acerouteqa.appspot.com/mobi?mtoken=aceroute.com|88001|7F00000101390239165FD6890132C515&action=getsite&cust_id=197002
	 customerSiteXmlDataStore = $.getValues(AceRoute.appUrl+
				 "?mtoken="+mtoken+"&action=getsite&cust_id="+firstcustid);
	 var custSiteHtmlStr = getAddNewOrderCustomerSiteHtml(false);
	 custSiteHtmlStr = custSiteHtmlStr.trim();
	   
	 var order_cust_site_add_new_order = $('#select-order-customer-site-new-order');
	 order_cust_site_add_new_order.empty();
	 order_cust_site_add_new_order.append(custSiteHtmlStr).selectmenu("refresh");
	 
 }
 
 function getAddNewOrderCustomerSiteHtml(createNew){
	 var custSiteHtmlStr = "";
	 if(createNew){
		 custSiteHtmlStr = custSiteHtmlStr + '<label for="select-order-customer-site-new-order" class="select">Customer Site</label>';
		 custSiteHtmlStr = custSiteHtmlStr + '<div id="select-order-customer-site-new-order-div" data-role="fieldcontain"  style="width: 35%;">';
		 custSiteHtmlStr = custSiteHtmlStr + '<select name="select-order-customer-site-new-order" id="select-order-customer-site-new-order" data-native-menu="false">';
		 
		 if(typeof customerSiteXmlDataStore !== "undefined"){
			 //https://acerouteqa.appspot.com/mobi?mtoken=aceroute.com|88001|7F00000101390239165FD6890132C515&action=getsite&cust_id=197002
			 $(customerSiteXmlDataStore).find('data').each(function(){
					$(this).find('site').each(function(){ 
					var siteId = $(this).find('site_id').text();
					var siteName = $(this).find('site_name').text();
					custSiteHtmlStr = custSiteHtmlStr + '	<option value="'+siteId+'">'+siteName+'</option>';
				});
			 });
		 }
		 custSiteHtmlStr = custSiteHtmlStr + '	</select>';
		 custSiteHtmlStr = custSiteHtmlStr + '</div>';
	 }else{
		 if(typeof customerSiteXmlDataStore !== "undefined"){
			 $(customerSiteXmlDataStore).find('data').each(function(){
				$(this).find('site').each(function(){ 
					var siteId = $(this).find('site_id').text();
					var siteName = $(this).find('site_name').text();
					custSiteHtmlStr = custSiteHtmlStr + '	<option value="'+siteId+'">'+siteName+'</option>';
				});
			 });
		 }
	 }
	return custSiteHtmlStr;
 }
 
 function getAddNewOrderDateDetailsHtml(){
	 
	 var htmlStr = '';
	 
	 var startDate = new Date();
	 var endDate = new Date();
	 
     var startDateHtml = getAddNewOrderStartDateHtml(startDate);
     htmlStr = htmlStr + startDateHtml;
//     var endDateHtml = getAddNewOrderEndDateHtml(endDate);
// 	 htmlStr = htmlStr + endDateHtml;
 	 
     var startTime = getTime(startDate);
 	 var startTimeHtml = getAddNewOrderStartTimeHtml(startTime);
 	 htmlStr = htmlStr + startTimeHtml;
 	
 	 var endTime = getTime(endDate);
 	 var endTimeHtml = getAddNewOrderEndTimeHtml(endTime);
 	 htmlStr = htmlStr + endTimeHtml;
// 	 
 	 var duration = '01:00';
 	 var durationHtml = getAddNewOrderDurationHtml(duration);
	 htmlStr = htmlStr + durationHtml;
 	 
//	 var startDateHtml = getStartDateHtml(startDate);
//	 htmlStr = htmlStr + startDateHtml;
//	    
	 var orders_data = $('#order-add-new-order-date-time-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function getAddNewOrderStatusDetails(){
	 var htmlStr = '';
	  
	 htmlStr = getAddNewOrderStatusHtml();
	 
	 var orders_data = $('#order-add-new-order-status-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function getAddNewOrderStatusHtml(){
	 var orderStatushtmlStr = "";
	 orderStatushtmlStr = orderStatushtmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     orderStatushtmlStr = orderStatushtmlStr + '<label for="select-new-order-status" class="select">Status</label>';
	 orderStatushtmlStr = orderStatushtmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 orderStatushtmlStr = orderStatushtmlStr + '<select name="select-new-order-status" id="select-new-order-status" data-native-menu="false">';
	 
	 $(orderStatusTypeXmlDataStore).find('data').each(function(){
			$(this).find('orderstatus').each(function(){
			var orderStatusId = $(this).find('orderstatus_id').text();
			var orderStatusName = $(this).find('orderstatus_name').text();
			orderStatushtmlStr = orderStatushtmlStr + '	<option value="'+orderStatusId+'">'+orderStatusName+'</option>';
		});
	 });
	 orderStatushtmlStr = orderStatushtmlStr + '	</select>';
	 orderStatushtmlStr = orderStatushtmlStr + '</div>';
	 return orderStatushtmlStr;
 }
 
 function getOrderDateDetails(orderId){
	 var htmlStr = '';
	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 
	 var cust_id = orderData.find('cust_id').text();
	 var orderName = orderData.find('order_name').text();
	 var orderPO = orderData.find('order_po').text();
	 var orderInst = orderData.find('order_inst').text();
	 
	 // ui-collapsible ui-collapsible-inset
	 //htmlStr = '<h2>Filtered list</h2>'; 
	 var startDate = orderData.find('start_date').text();
	 console.log(' order update startDate '+startDate);
	 var endDate = orderData.find('end_date').text();
	 console.log(' order update endDate '+endDate);
	 var startTime = getTime(startDate);
	 console.log(' order update startTime '+startTime);
 	 var duration = getOrderDuration(startDate, endDate);
 	 console.log(' order update duration '+duration);
	 
     var startDateHtml = getStartDateHtml(startDate);
     htmlStr = htmlStr + startDateHtml;
     var endDateHtml = getEndDateHtml(endDate);
 	 htmlStr = htmlStr + endDateHtml;
 	 
     var startTime = getTime(startDate);
 	 var startTimeHtml = getStartTimeHtml(startTime);
 	 htmlStr = htmlStr + startTimeHtml;
 	
 	 var endTime = getTime(endDate);
 	 var endTimeHtml = getEndTimeHtml(endTime);
 	 htmlStr = htmlStr + endTimeHtml;
 	 
 	 var durationHtml = getDurationHtml(duration);
	 htmlStr = htmlStr + durationHtml;
 	 
//	 var startDateHtml = getStartDateHtml(startDate);
//	 htmlStr = htmlStr + startDateHtml;
//	    
	 var orders_data = $('#order-date-time-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function getOrderStatusDetails(orderId){
	 var htmlStr = '';
	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 
	 var statusId = orderData.find('order_wkfid').text();
	 htmlStr = getOrderStatusHtml(statusId);
	 
	 var orders_data = $('#order-status-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
	 
 }
 
 function getOrderTasksDetails(orderId){
	 var htmlStr = '';
	
// 	 orderTasksXmlStore = $.getValues(AceRoute.appUrl+
//			 "?mtoken="+mtoken+"&action=getordertask"+"&order_id="+orderId);
	 
//	 orderTasksXmlStore = $.getValues("orderTasks.xml");
	 
//	 action=saveordertask&mtoken=aceroute.com%7C234001%7C7F000001013A67B8BCDE29B10060E277&order_id=229008&ordertask_id=0&ordertask_hrs=1&ordertask_typeid=1&task_id=1290126960973&tstamp=1350359930540
//	 Request URL:https://acerouteqa.appspot.com/mobi?action=getordertask&order_id=229008&mtoken=aceroute.com|234001|7F000001013A67B8BCDE29B10060E277&0.7000447215978056
//	 <data>
	//	 <tasktype>
		//	 <task_id>
		//	 <![CDATA[ 1290126960973 ]]>
		//	 </task_id>
		//	 <task_name>
		//	 <![CDATA[ task1 ]]>
		//	 </task_name>
		//	 <task_desc>
		//	 <![CDATA[ null ]]>
		//	 </task_desc>
		//	 <task_uprice>
		//	 <![CDATA[ 1.75 ]]>
		//	 </task_uprice>
		//	 <task_unit>
		//	 <![CDATA[ 35 ]]>
		//	 </task_unit>
		//	 <extsys_id>
		//	 <![CDATA[ null ]]>
		//	 </extsys_id>
		//	 <update_time>
		//	 <![CDATA[ null ]]>
		//	 </update_time>
	//	 </tasktype>
	//	 <tasktype>
		//	 <task_id>
		//	 <![CDATA[ 122001 ]]>
		//	 </task_id>
		//	 <task_name>
		//	 <![CDATA[ task 2 ]]>
		//	 </task_name>
		//	 <task_desc>
		//	 <![CDATA[ null ]]>
		//	 </task_desc>
		//	 <task_uprice>
		//	 <![CDATA[ 1000 ]]>
		//	 </task_uprice>
		//	 <task_unit>
		//	 <![CDATA[ 8 ]]>
		//	 </task_unit>
		//	 <extsys_id>
		//	 <![CDATA[ ]]>
		//	 </extsys_id>
		//	 <update_time>
		//	 <![CDATA[ null ]]>
		//	 </update_time>
	//	 </tasktype>
//	 </data>
	 htmlStr = getOrderTasksHtml(orderTasksXmlStore);
	 
	 var orders_data = $('#order-tasks-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderTaskDetail(orderTaskId){
	 
	 var orderTaskId = sessionStorage.order_task_id;
	 
	 var orderTaskData = findDataById(orderTasksXmlStore,
				'data', 'ordertask','ordertask_id', orderTaskId);
	 var order_taskId = orderTaskData.find('task_id').text();
	 var orderTaskHrs = orderTaskData.find('ordertask_hrs').text(); 
	 var taskRefData = findDataById(taskTypeTypeXmlDataStore,
			'data', 'tasktype','task_id', order_taskId);
	 var taskName = taskRefData.find('task_name').text();
	 
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-status" class="select">Tasks:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-task" id="select-order-task" data-native-menu="false">';
	 
 	 $(taskTypeTypeXmlDataStore).find('data').each(function(){
 		$(this).find('tasktype').each(function(){
			var taskId = $(this).find('task_id').text();
			taskId = taskId.trim();
			var taskName = $(this).find('task_name').text();
			if(taskId == order_taskId){
				htmlStr = htmlStr + '	<option value="'+taskId+'" selected="selected">'+taskName+'</option>';
			}else{
				htmlStr = htmlStr + '	<option value="'+taskId+'">'+taskName+'</option>';
			}
		});
	 });
 	 htmlStr = htmlStr + '	</select>';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<label for="taskHrs">Hours</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 15%;">';
	 htmlStr = htmlStr + "		<input name=\"taskHrs\" id=\"taskHrs\" type=\"text\" value='"+orderTaskHrs +"' />";
	 htmlStr = htmlStr + '</div>';
	 
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;"><button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button id="order-task-edit-save" type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="order-task-edit-delete" type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-task-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 } 
 
 function getOrderTaskAddHtml(orderId){
	 
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-status-add" class="select">Tasks:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-task-add" id="select-order-task-add" data-native-menu="false">';
	 
	 $(taskTypeTypeXmlDataStore).find('data').each(function(){
		$(this).find('tasktype').each(function(){
			var taskId = $(this).find('task_id').text();
			var taskName = $(this).find('task_name').text();
			htmlStr = htmlStr + '	<option value="'+taskId+'">'+taskName+'</option>';
		});
	 });
	 htmlStr = htmlStr + '	</select>';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<label for="taskHrsAdd">Hours</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 15%;">';
	 htmlStr = htmlStr + "		<input name=\"taskHrsAdd\" id=\"taskHrsAdd\" type=\"text\"/>";
	 htmlStr = htmlStr + '</div>';
	 
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;"><button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button id="order-task-add" type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_add_div = $('#order-task-add-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_add_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function getOrderPartsDetails(orderId){
	 var htmlStr = '';
	
// 	 var 
//	 orderPartsXmlStore = $.getValues(AceRoute.appUrl+
//			 "?mtoken="+mtoken+"&action=getorderpart"+"&order_id="+orderId);
	 
//	 orderPartsXmlStore = $.getValues("orderParts.xml");
	 
//	 action=saveorderpart&mtoken=aceroute.com%7C234001%7C7F000001013A6AFD5105E7EC0154AE5A&order_id=229008&orderpart_id=0&orderpart_qty=1&orderpart_typeid=1&part_id=1290126928253&tstamp=1350414761529
//	 https://acerouteqa.appspot.com/mobi?action=getorderpart&order_id=229008&mtoken=aceroute.com|234001|7F000001013A6AFD5105E7EC0154AE5A&0.033177509903907776
//	 <data>
//	 	<orderpart>
//	 		<orderpart_id><![CDATA[238001]]></orderpart_id><order_id><![CDATA[229008]]></order_id><part_id><![CDATA[1290126928253]]></part_id>
//	 		<orderpart_qty><![CDATA[1]]></orderpart_qty><subt_by><![CDATA[Test User]]></subt_by><update_time><![CDATA[null]]></update_time>
//	 	</orderpart>
//	 </data>

	 htmlStr = getOrderPartsHtml(orderPartsXmlStore);
	 
	 var orders_data = $('#order-parts-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderPartDetail(orderPartId){
//	 <data><parttype><part_id><![CDATA[1290126928253]]></part_id><part_num><![CDATA[part type1]]></part_num><part_name><![CDATA[tes part]]></part_name><part_uprice><![CDATA[0.5]]></part_uprice><part_unit><![CDATA[5]]></part_unit><extsys_id><![CDATA[null]]></extsys_id><update_time><![CDATA[null]]></update_time></parttype><parttype><part_id><![CDATA[111003]]></part_id><part_num><![CDATA[200]]></part_num><part_name><![CDATA[part num 200]]></part_name><part_uprice><![CDATA[200]]></part_uprice><part_unit><![CDATA[5]]></part_unit><extsys_id><![CDATA[]]></extsys_id><update_time><![CDATA[null]]></update_time></parttype></data>

	 var orderPartData = findDataById(orderPartsXmlStore,
				'data', 'orderpart','orderpart_id', orderPartId);
	 var order_partId = orderPartData.find('part_id').text();
	 var orderPartQty = orderPartData.find('orderpart_qty').text(); 
	 var partRefData = findDataById(partTypeXmlDataStore,
			'data', 'parttype','part_id', order_partId);
	 var partName = partRefData.find('part_name').text();
	 
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-part" class="select">Parts:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-part" id="select-order-part" data-native-menu="false">';
	 
 	 $(partTypeXmlDataStore).find('data').each(function(){
 		$(this).find('parttype').each(function(){
			var partId = $(this).find('part_id').text();
			partId = partId.trim();
			var partName = $(this).find('part_name').text();
			if(partId == order_partId){
				htmlStr = htmlStr + '	<option value="'+partId+'" selected="selected" >'+partName+'</option>';
			}else{
				htmlStr = htmlStr + '	<option value="'+partId+'">'+partName+'</option>';
			}
		});
	 });
 	 htmlStr = htmlStr + '	</select>';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<label for="partQty">Quantity</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 10%;">';
	 htmlStr = htmlStr + "		<input name=\"partQty\" id=\"partQty\" type=\"text\" value='"+orderPartQty +"' />";
	 htmlStr = htmlStr + '</div>';
	 
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;"><button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button id="order-part-edit-save" type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="order-part-edit-delete" type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-part-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderPartAddHtml(orderId){
	  
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-part-add" class="select">Parts:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-part-add" id="select-order-part-add" data-native-menu="false">';
	 
	 $(partTypeXmlDataStore).find('data').each(function(){
		$(this).find('parttype').each(function(){
			var partId = $(this).find('part_id').text();
			var partName = $(this).find('part_name').text();
			htmlStr = htmlStr + '	<option value="'+partId+'">'+partName+'</option>';
		});
	 });
	 htmlStr = htmlStr + '	</select>';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<label for="partQtyAdd">Quantity</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 10%;">';
	 htmlStr = htmlStr + "		<input name=\"partQtyAdd\" id=\"partQtyAdd\" type=\"text\" />";
	 htmlStr = htmlStr + '</div>';
	 
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;"><button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button id="order-part-add" type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_part_add_div = $('#order-part-add-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_part_add_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderResourcesDetails(orderId){
	 
	 var htmlStr = '';
	 
//	 https://acerouteqa.appspot.com/mobi?_dc=1350416249548&mtoken=aceroute.com%7C234001%7C7F000001013A6B14A613908D00F6EDE1&action=getres&limit=25
//	 <data>
//	 	<res><res_id><![CDATA[203005]]></res_id><res_name><![CDATA[Test1]]></res_name><res_tag><![CDATA[te1]]></res_tag>
//	 	<res_type><![CDATA[1]]></res_type><res_num><![CDATA[]]></res_num><client_siteid><![CDATA[193001]]></client_siteid>
//	 	<res_email><![CDATA[]]></res_email><res_phone><![CDATA[]]></res_phone>
//	 	<res_rate><![CDATA[]]></res_rate><res_wrkwk><![CDATA[]]></res_wrkwk><res_vsch><![CDATA[]]></res_vsch><extsys_id><![CDATA[]]></extsys_id><update_time><![CDATA[1350111219591]]></update_time>
//	 	</res>
//	 	<res><res_id><![CDATA[205003]]></res_id><res_name><![CDATA[John2]]></res_name><res_tag><![CDATA[jo]]></res_tag>
//	 		<res_type><![CDATA[1]]></res_type><res_num><![CDATA[]]></res_num><client_siteid><![CDATA[193001]]></client_siteid>
//	 		<res_email><![CDATA[]]></res_email><res_phone><![CDATA[]]></res_phone><res_rate><![CDATA[]]></res_rate>
//	 		<res_wrkwk><![CDATA[]]></res_wrkwk><res_vsch><![CDATA[]]></res_vsch><extsys_id><![CDATA[]]></extsys_id>
//	 		<update_time><![CDATA[1350110170160]]></update_time>
//	 	</res>
//	 	<res><res_id><![CDATA[205006]]></res_id><res_name><![CDATA[Test3]]></res_name><res_tag><![CDATA[t3]]></res_tag>
//	 		<res_type><![CDATA[1]]></res_type><res_num><![CDATA[]]></res_num><client_siteid><![CDATA[193001]]></client_siteid>
//	 		<res_email><![CDATA[]]></res_email><res_phone><![CDATA[]]></res_phone><res_rate><![CDATA[]]></res_rate>
//	 		<res_wrkwk><![CDATA[]]></res_wrkwk><res_vsch><![CDATA[]]></res_vsch><extsys_id><![CDATA[]]></extsys_id>
//	 		<update_time><![CDATA[1350110409674]]></update_time></res><res><res_id><![CDATA[209002]]></res_id>
//	 		<res_name><![CDATA[Test0]]></res_name><res_tag><![CDATA[te0]]></res_tag><res_type><![CDATA[1]]></res_type><res_num><![CDATA[]]></res_num><client_siteid><![CDATA[193001]]></client_siteid><res_email><![CDATA[]]></res_email><res_phone><![CDATA[]]></res_phone><res_rate><![CDATA[]]></res_rate><res_wrkwk><![CDATA[]]></res_wrkwk><res_vsch><![CDATA[]]></res_vsch><extsys_id><![CDATA[]]></extsys_id><update_time><![CDATA[1350111147724]]></update_time></res><res><res_id><![CDATA[212001]]></res_id><res_name><![CDATA[Test2]]></res_name><res_tag><![CDATA[te2]]></res_tag><res_type><![CDATA[1]]></res_type><res_num><![CDATA[]]></res_num><client_siteid><![CDATA[193001]]></client_siteid><res_email><![CDATA[]]></res_email><res_phone><![CDATA[]]></res_phone><res_rate><![CDATA[]]></res_rate><res_wrkwk><![CDATA[]]></res_wrkwk><res_vsch><![CDATA[]]></res_vsch><extsys_id><![CDATA[]]></extsys_id><update_time><![CDATA[1350111330760]]></update_time></res><res><res_id><![CDATA[234001]]></res_id><res_name><![CDATA[Raymond]]></res_name><res_tag><![CDATA[ra]]></res_tag><res_type><![CDATA[1]]></res_type><res_num><![CDATA[]]></res_num><client_siteid><![CDATA[193001]]></client_siteid><res_email><![CDATA[]]></res_email><res_phone><![CDATA[]]></res_phone><res_rate><![CDATA[]]></res_rate><res_wrkwk><![CDATA[]]></res_wrkwk><res_vsch><![CDATA[]]></res_vsch><extsys_id><![CDATA[]]></extsys_id><update_time><![CDATA[1350028792190]]></update_time></res></data>

	 htmlStr = getOrderResourcesHtml(orderResourceXmlStore);
	 console.log(' after call htmlStr '+htmlStr);
	 var orders_data = $('#order-resources-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderResourceDetail(orderId, orderResourceId){

	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);	
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-resource" class="select">Resources:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-resource" id="select-order-resource" data-native-menu="false">';
	 
 	 $(resourceXmlDataStore).find('data').each(function(){
 		$(this).find('res').each(function(){
			var resId = $(this).find('res_id').text();
			var resName = $(this).find('res_name').text();
			resId = resId.trim();
			// just show the resource "orderResourceId" in the drop down because there is nothing 
			// else to edit.
			if(resId == orderResourceId){
				htmlStr = htmlStr + '	<option value="'+resId+'">'+resName+'</option>';
			}
		});
	 });
 	 htmlStr = htmlStr + '	</select>';
	 htmlStr = htmlStr + '</div>';
	 
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;">'+
	 						'<button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;">'+
	 						'<button id="order-resource-edit-delete" type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-resource-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderResourceAddHtml(orderId){
	 
	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 htmlStr = htmlStr + '<label for="select-order-resource-add" class="select">Resources:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-resource-add" id="select-order-resource-add" data-native-menu="false">';
	 
	 $(resourceXmlDataStore).find('data').each(function(){
		$(this).find('res').each(function(){
			var resId = $(this).find('res_id').text();
			var resName = $(this).find('res_name').text();
			resId = resId.trim();
			htmlStr = htmlStr + '	<option value="'+resId+'">'+resName+'</option>';
		});
	 });
	 htmlStr = htmlStr + '	</select>';
	 htmlStr = htmlStr + '</div>';
	 
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;"><button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button id="order-resource-add" type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-resource-add-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderSignaturesListPage(orderId){
//	 mtoken=aceroute.com%7C234001%7C7F000001013A6FD756D86C8E00F34A08&action=savefile&order_id=229008&file_geocode=1&file_type=2&file=iVBORw0KGgoAAAANSUhEUgAAAMgAAACWCAYAAACb3McZAAAISElEQVR4Xu2dyasdRRSHX4xTEkVFiREVNBsXIoIBgyAK4r%2BQheDCjQOiOCxFEDcGN4oYXOhGQXCRf0FciOIAcaEYyEYEBQecgkMc0fMzt33JM3m3TlV13%2Bo634XDvS9W9evznfrsqr7d%2Fbas8YIABE5LYAtsIACB0xNAEEYHBDYhgCAMDwggCGMAAnkEOILkcaNXEAIIEqTQpJlHAEHyuNErCAEECVJo0swjgCB53OgVhACCBCk0aeYRQJA8bvQKQgBBghSaNPMIIEgeN3oFIYAgQQpNmnkEECSPG72CEECQIIUmzTwCCJLHjV5BCCBIkEKTZh4BBMnjRq8gBBAkSKFJM48AguRxo1cQAggSpNCkmUcAQfK40SsIgSkEecJYPhmEJ2l2RmAKQYTsDYvbOmNHOgEITCWIUH5isd%2FipQBcSbETAlMKImSHF9xesfenF5%2F%2FtPdvLHZ1wpQ0OiIwtSBCd5%2FF4wuGO%2B39AYvnLLZ1xJVUOiGwCkEGdI%2FZh6cWP%2Fxu7zdbvN8JV9LohMAqBTkR4ff2w%2BsW%2BzrhShqdEGhFkI%2BM5w6L3Z1wJY1OCLQiyDPG826L8zvhShqdEGhFEOHU2awzO%2BFKGp0QaEmQH42pviN5tBO2pNEBgZYE0ReJP1tc1wFXUuiEQEuCHDSmt1tc1Alb0uiAQEuC3Gg837I4uwOupNAJgZYEEdJjFg9ZvNgJX9KYOYHWBPnSeB6xuHXmXNn9Tgi0Jogui99jcUEnfElj5gRaE0Q4%2F7LYOnOu7H4nBEoF%2Be0UHM4pZHPU%2Bh%2By4AarQpB0LycwhiDaqxJJmGaV15UtVCJQKsjG3RiOKCWCMM2qVFw2U06gtiD6Jvwsi9LvMphmldeWLVQgUFuQWv%2F3Z5pVobhsopzAGILo7sA%2FLHR%2FR8mLs1kl9OhbhcAYgtQ6ijDNqlJiNlJCYCxBakjyoW3kagtuoiqpMH2LCIwpyKe2Z1dY5N4Eda%2F1PbBY9BclSWcI5BIYUxDtU%2BlpX61ldAPV87kJ0g8CJQTGFkT7pltpP7e4KmNHdZehjkTcRJUBjy7lBKYQ5AfbTZ3R0vcj3hfrEC8x2lclMIUg2mFNlX6x8F6lyzqkarnZmJfAVIKUHEVYh3irSvtqBKYSpOQowjqkWrnZkJfAlIK8bTu318J72pd1iLeqtK9GYEpBtNNah0gQz8WMrEOqlZsNeQlMLYj2T9dq6dTvdsfOsg5xwKJpPQKrEER7L0F016CmXCkv1iEplGhTncCqBPnOMtE1VqnfjbxjbW%2BwKL0RqzpANtg3gVUJIqqaNv1kkfokRR117rJ4te%2BSkF1LBFYpiPcoor9jqNclLQFkX%2FomsEpBvEeRO63Dyxbe08R9V5DsRiWwakG8RxFdHfyBxU2jUmHjEFgQWLUg3qPIC9bhHo4ijN%2BpCLQgiJ7He7FF6hktXdel14VTQeL3xCXQgiCi733Qg85o6Qnw98ctHZlPQaAVQZ61ZB90TJ2Yak0xOvgda60IolJ4b89lqsUAHp1AS4IoWU2ddP%2F5I4mZM9VKBEWzPAKtCeJ9dClTrby60yuRQGuCaLd1Ccq3FrsSc2CqlQiKZn4CLQrymqWxz7FgH6ZmnNXy158eSwi0KIh2WZe3n2uR%2Bt0IUy2G%2BigEWhVEyXJWa5SSs1EPgZYFGdYjv9qH1OfzclbLU33aLiXQuiDD%2BuKgfbhjaTZra0y1EiDRJJ3AHAT52NK5xrFo56xWev1pOdNF%2Bsbd9q5HmGox9KsQmMMRZEhUg%2F6IxbUJmTPVSoBEk%2BUE5iQIU63l9aRFZQJzEkSpM9WqPADY3OYE5ibIcFaLqRYjexICcxREYDx%2FAZezWpMMpT5%2FyVwF8UrCWa0%2Bx%2B%2FoWc1ZEK8knqPO6OD5BfMgMHdBBkn0ULlLE5AjSQIkmqwT6EEQZaN7SPTSc7aWiYIkGJBMoBdBlPDXFsNzfpeJgiTJQyR2w54EGSp5oiib3U%2BCJLHHflL2PQoyJP6VfdAD6TZ7li%2BSJA2TuI16FkRV%2FcJCT4PnSBJ3jBdl3rsggnPMYqvF6f4uos6AnWehW3x5QeAkAhEEUcJ6tKmmU9tOUf837d%2F0tPjU%2B98ZQoEIRBFEJdWpYB0tLttQ3z3283sW%2FN2RQAM%2FNdVIgoiJLjnRKeCdGwDp3w9YPJwKjnYxCEQTZDiS6F2ngy9flFlHl88sdscoO1mmEogoiNgMZ7f0WWsPPfJUrx2p4GgXg0BUQYbqHrUP2xdHjysXssSoPFkmEYguyDDl0j0jukyFhXrSsInTCEGOrz30oGyx2GtxKE75yXQZAQQ5TkiL9L8t3rW4ZRk0%2FnscAgiyXmud6tVUS5em8ILAvwQQZH0g6BnAuiSFb9SR4z8CCLI%2BGPRIoTMsDltczxiBAEeQ%2F48BTbO0HjnVNVuMmIAEOIKcXHTvg%2BkCDplYKSNIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CSCIExjNYxFAkFj1JlsnAQRxAqN5LAIIEqveZOskgCBOYDSPRQBBYtWbbJ0EEMQJjOaxCCBIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CSCIExjNYxFAkFj1JlsnAQRxAqN5LAIIEqveZOskgCBOYDSPRQBBYtWbbJ0EEMQJjOaxCCBIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CfwDJ7XOlxyNO1wAAAAASUVORK5CYII%3D
//	 https://acerouteqa.appspot.com/mobi?action=getfilemeta&order_id=229008&mtoken=aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08&0.07896445458754897
//	 <data>
//	 	<filemeta><file_id><![CDATA[240001]]></file_id><order_id><![CDATA[229008]]></order_id>
//	 	<file_type><![CDATA[2]]></file_type><file_geocode><![CDATA[1]]></file_geocode><file_tstmp><![CDATA[1350496162463]]></file_tstmp>
//	 	<subt_by><![CDATA[Test User]]></subt_by></filemeta></data>
	 orderSignatureXmlStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getfilemeta&order_id="+orderId); //"orderPics.xml");

	 htmlStr = getOrderSignaturesHtml(orderSignatureXmlStore);
	 
	 var orders_signatures_data = $('#order-signatures-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_signatures_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderPicsDetail(orderId){
//	 mtoken=aceroute.com%7C234001%7C7F000001013A6FD756D86C8E00F34A08&action=savefile&order_id=229008&file_geocode=1&file_type=2&file=iVBORw0KGgoAAAANSUhEUgAAAMgAAACWCAYAAACb3McZAAAISElEQVR4Xu2dyasdRRSHX4xTEkVFiREVNBsXIoIBgyAK4r%2BQheDCjQOiOCxFEDcGN4oYXOhGQXCRf0FciOIAcaEYyEYEBQecgkMc0fMzt33JM3m3TlV13%2Bo634XDvS9W9evznfrsqr7d%2Fbas8YIABE5LYAtsIACB0xNAEEYHBDYhgCAMDwggCGMAAnkEOILkcaNXEAIIEqTQpJlHAEHyuNErCAEECVJo0swjgCB53OgVhACCBCk0aeYRQJA8bvQKQgBBghSaNPMIIEgeN3oFIYAgQQpNmnkEECSPG72CEECQIIUmzTwCCJLHjV5BCCBIkEKTZh4BBMnjRq8gBBAkSKFJM48AguRxo1cQAggSpNCkmUcAQfK40SsIgSkEecJYPhmEJ2l2RmAKQYTsDYvbOmNHOgEITCWIUH5isd%2FipQBcSbETAlMKImSHF9xesfenF5%2F%2FtPdvLHZ1wpQ0OiIwtSBCd5%2FF4wuGO%2B39AYvnLLZ1xJVUOiGwCkEGdI%2FZh6cWP%2Fxu7zdbvN8JV9LohMAqBTkR4ff2w%2BsW%2BzrhShqdEGhFkI%2BM5w6L3Z1wJY1OCLQiyDPG826L8zvhShqdEGhFEOHU2awzO%2BFKGp0QaEmQH42pviN5tBO2pNEBgZYE0ReJP1tc1wFXUuiEQEuCHDSmt1tc1Alb0uiAQEuC3Gg837I4uwOupNAJgZYEEdJjFg9ZvNgJX9KYOYHWBPnSeB6xuHXmXNn9Tgi0Jogui99jcUEnfElj5gRaE0Q4%2F7LYOnOu7H4nBEoF%2Be0UHM4pZHPU%2Bh%2By4AarQpB0LycwhiDaqxJJmGaV15UtVCJQKsjG3RiOKCWCMM2qVFw2U06gtiD6Jvwsi9LvMphmldeWLVQgUFuQWv%2F3Z5pVobhsopzAGILo7sA%2FLHR%2FR8mLs1kl9OhbhcAYgtQ6ijDNqlJiNlJCYCxBakjyoW3kagtuoiqpMH2LCIwpyKe2Z1dY5N4Eda%2F1PbBY9BclSWcI5BIYUxDtU%2BlpX61ldAPV87kJ0g8CJQTGFkT7pltpP7e4KmNHdZehjkTcRJUBjy7lBKYQ5AfbTZ3R0vcj3hfrEC8x2lclMIUg2mFNlX6x8F6lyzqkarnZmJfAVIKUHEVYh3irSvtqBKYSpOQowjqkWrnZkJfAlIK8bTu318J72pd1iLeqtK9GYEpBtNNah0gQz8WMrEOqlZsNeQlMLYj2T9dq6dTvdsfOsg5xwKJpPQKrEER7L0F016CmXCkv1iEplGhTncCqBPnOMtE1VqnfjbxjbW%2BwKL0RqzpANtg3gVUJIqqaNv1kkfokRR117rJ4te%2BSkF1LBFYpiPcoor9jqNclLQFkX%2FomsEpBvEeRO63Dyxbe08R9V5DsRiWwakG8RxFdHfyBxU2jUmHjEFgQWLUg3qPIC9bhHo4ijN%2BpCLQgiJ7He7FF6hktXdel14VTQeL3xCXQgiCi733Qg85o6Qnw98ctHZlPQaAVQZ61ZB90TJ2Yak0xOvgda60IolJ4b89lqsUAHp1AS4IoWU2ddP%2F5I4mZM9VKBEWzPAKtCeJ9dClTrby60yuRQGuCaLd1Ccq3FrsSc2CqlQiKZn4CLQrymqWxz7FgH6ZmnNXy158eSwi0KIh2WZe3n2uR%2Bt0IUy2G%2BigEWhVEyXJWa5SSs1EPgZYFGdYjv9qH1OfzclbLU33aLiXQuiDD%2BuKgfbhjaTZra0y1EiDRJJ3AHAT52NK5xrFo56xWev1pOdNF%2Bsbd9q5HmGox9KsQmMMRZEhUg%2F6IxbUJmTPVSoBEk%2BUE5iQIU63l9aRFZQJzEkSpM9WqPADY3OYE5ibIcFaLqRYjexICcxREYDx%2FAZezWpMMpT5%2FyVwF8UrCWa0%2Bx%2B%2FoWc1ZEK8knqPO6OD5BfMgMHdBBkn0ULlLE5AjSQIkmqwT6EEQZaN7SPTSc7aWiYIkGJBMoBdBlPDXFsNzfpeJgiTJQyR2w54EGSp5oiib3U%2BCJLHHflL2PQoyJP6VfdAD6TZ7li%2BSJA2TuI16FkRV%2FcJCT4PnSBJ3jBdl3rsggnPMYqvF6f4uos6AnWehW3x5QeAkAhEEUcJ6tKmmU9tOUf837d%2F0tPjU%2B98ZQoEIRBFEJdWpYB0tLttQ3z3283sW%2FN2RQAM%2FNdVIgoiJLjnRKeCdGwDp3w9YPJwKjnYxCEQTZDiS6F2ngy9flFlHl88sdscoO1mmEogoiNgMZ7f0WWsPPfJUrx2p4GgXg0BUQYbqHrUP2xdHjysXssSoPFkmEYguyDDl0j0jukyFhXrSsInTCEGOrz30oGyx2GtxKE75yXQZAQQ5TkiL9L8t3rW4ZRk0%2FnscAgiyXmud6tVUS5em8ILAvwQQZH0g6BnAuiSFb9SR4z8CCLI%2BGPRIoTMsDltczxiBAEeQ%2F48BTbO0HjnVNVuMmIAEOIKcXHTvg%2BkCDplYKSNIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CSCIExjNYxFAkFj1JlsnAQRxAqN5LAIIEqveZOskgCBOYDSPRQBBYtWbbJ0EEMQJjOaxCCBIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CSCIExjNYxFAkFj1JlsnAQRxAqN5LAIIEqveZOskgCBOYDSPRQBBYtWbbJ0EEMQJjOaxCCBIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CfwDJ7XOlxyNO1wAAAAASUVORK5CYII%3D
//	 https://acerouteqa.appspot.com/mobi?action=getfilemeta&order_id=229008&mtoken=aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08&0.07896445458754897
//	 <data>
//	 	<filemeta><file_id><![CDATA[240001]]></file_id><order_id><![CDATA[229008]]></order_id>
//	 	<file_type><![CDATA[2]]></file_type><file_geocode><![CDATA[1]]></file_geocode><file_tstmp><![CDATA[1350496162463]]></file_tstmp>
//	 	<subt_by><![CDATA[Test User]]></subt_by></filemeta></data>
	 orderPicsXmlStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getfilemeta&order_id="+orderId); //"orderPics.xml");

	 htmlStr = getOrderPicsHtml(orderPicsXmlStore);
	 
	 var orders_pics_data = $('#order-pics-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_pics_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderDataHtml(thisData){
	 	var orderName = thisData.find('order_name').text();
	 	var orderId = thisData.find('id').text();
		var startDate = thisData.find('start_date').text();
		var endDate = thisData.find('end_date').text();
		
		var htmlStr = "";
		
		htmlStr = getOrderDetailsDisplayGridHtml(orderId);
		
//		var orderNameHtml = getOrderNameHtml(orderName);
//		htmlStr = htmlStr + orderNameHtml;
//	    var startDateHtml = getStartDateHtml(startDate);
//	    htmlStr = htmlStr + startDateHtml;
//	    
//	    var startTime = getStartTime(startDate);
//	 	var startTimeHtml = getStartTimeHtml(startTime);
//	 	htmlStr = htmlStr + startTimeHtml;
//	 	
//	 	var endDateHtml = getEndDateHtml(endDate);
//	 	htmlStr = htmlStr + endDateHtml;
//	 	
//	 	var endTime = getEndTime(endDate);
//	 	var endTimeHtml = getEndTimeHtml(endTime);
//	 	htmlStr = htmlStr + endTimeHtml;
 	
 	return htmlStr;
 }
 
 function getOrderDataFooterHtml(orderData){
	 var htmlStr = "";
	 var orderId = orderData.find('id').text();
	 htmlStr = getOrderDetailsDisplayGridFooterHtml(orderId);
	 return htmlStr;
 }
 
 function getOrderDetailsDisplayGridHtml(orderId){
	 
	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 
	 var cust_id = orderData.find('cust_id').text();
	 var orderName = orderData.find('order_name').text();
	 var orderPO = orderData.find('order_po').text();
	 var orderInst = orderData.find('order_inst').text();
	 var orderStatusId = orderData.find('order_wkfid').text();
	 
	 // ui-collapsible ui-collapsible-inset
	 //htmlStr = '<h2>Filtered list</h2>'; 
	 var startDate = orderData.find('start_date').text();
	 var startDateStr = getDateInStr(startDate);
	 
	 console.log(' order update startDate '+startDate);
	 var endDate = orderData.find('end_date').text();
	 console.log(' order update endDate '+endDate);
	 var startTime = getTime(startDate);
	 console.log(' order update startTime '+startTime);
	 var endTime = getTime(endDate);
     
	 var duration = getOrderDuration(startDate, endDate);
	 console.log(' order update duration '+duration);
	 
	 var orderStatusStr = getOrderStatusStr(orderStatusId);
	 
	 var numberOfOrderTasks = getNumberOfOrderTasks(orderId);
	 var numberOfOrderParts = getNumberOfOrderParts(orderId);
	 var numberOfOrderResources = getNumberOfOrderResources(orderId);
	 
	 var htmlStr = "";
//	 htmlStr = htmlStr + '		<li><a href="#order-details" data-role="tab" data-icon="grid" class="ui-btn-active">Details</a></li>';
	 
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 htmlStr = htmlStr + '<div data-role="navbar">';
	 htmlStr = htmlStr + '	<ul>';
	 htmlStr = htmlStr + '		<li><a href="#order-details" data-role="tab" class="ui-btn-active" style="height: 120px;">';
	 htmlStr = htmlStr + '			Details</a></li>';
	 
	 htmlStr = htmlStr + '		<li><a href="#order-date-time" data-role="tab" style="height: 120px;">';
	 htmlStr = htmlStr + '				Date/Time';
	 htmlStr = htmlStr + '				<div>&nbsp;</div>';
	 htmlStr = htmlStr + '				<div>'+startDateStr+'</div>';
	 htmlStr = htmlStr + '				<div>'+startTime+'-'+endTime+'</div>';
	 htmlStr = htmlStr + '				<div>'+duration+' HRS</div>';
	 htmlStr = htmlStr + '			</a>';
	 htmlStr = htmlStr + '		</li>';
	 
	 htmlStr = htmlStr + '		<li><a href="#order-status" data-role="tab"  style="height: 120px;">';
	 htmlStr = htmlStr + '				Status';
	 htmlStr = htmlStr + '				<div>&nbsp;</div>';
	 htmlStr = htmlStr + '				<div>'+orderStatusStr+'</div>';
	 htmlStr = htmlStr + '			 </a>';
	 htmlStr = htmlStr + '		</li>';
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + ' </div>';
	 
	 htmlStr = htmlStr + '<div data-role="navbar">';
	 htmlStr = htmlStr + '	<ul>';
	 htmlStr = htmlStr + '		<li><a href="#order-tasks" data-role="tab"  style="height: 120px;">';
	 htmlStr = htmlStr + '				Tasks';
	 htmlStr = htmlStr + '				<div>&nbsp;</div>';
	 htmlStr = htmlStr + '				<div>'+numberOfOrderTasks+'</div>';
	 htmlStr = htmlStr + '			 </a>';
	 htmlStr = htmlStr + '		</li>';
	 
	 htmlStr = htmlStr + '		<li><a href="#order-parts" data-role="tab"  style="height: 120px;">';
	 htmlStr = htmlStr + '				Parts';
	 htmlStr = htmlStr + '				<div>&nbsp;</div>';
	 htmlStr = htmlStr + '				<div>'+numberOfOrderParts+'</div>';
	 htmlStr = htmlStr + '			 </a>';
	 htmlStr = htmlStr + '		</li>';
	 
	 htmlStr = htmlStr + '		<li><a href="#order-resources" data-role="tab"  style="height: 120px;">';
	 htmlStr = htmlStr + '				Resources';
	 htmlStr = htmlStr + '				<div>&nbsp;</div>';
	 htmlStr = htmlStr + '				<div>'+numberOfOrderResources+'</div>';
	 htmlStr = htmlStr + '			 </a>';
	 htmlStr = htmlStr + '		</li>';
	 
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + ' </div>';
	 return htmlStr;
 }
 
 function getDateInStr(startDate){
	 var start_date = CommonUtil.convertToUTCFromTime(startDate);
 	 //console.log(" start_date "+start_date);
 	 var startDate = start_date; //rec.data.start_time;
 	 var indexOfZero = startDate.indexOf("-00");
 	 var startDateSub = startDate.substring(0,indexOfZero);
 	 startDateSub = startDateSub+"GMT+0000";
	 	
	 var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	 var month = parseInt(startDateLocal.getMonth());
	 var day = parseInt(startDateLocal.getDate());
	 	
	 var retStr = '';
	 var monthStr = '';
	 var dayStr = '';
	 	
	 if(month < 10){ 
	 	monthStr = '0'+(startDateLocal.getMonth()+1); 
	 }else{
	 	monthStr = startDateLocal.getMonth() +1;
	 }
	 	
	 if(day < 10){ 
	 	dayStr = '0'+startDateLocal.getDate(); 
	 }else{
	 	dayStr = startDateLocal.getDate();
	 }
	 retStr = monthStr+"/"+ dayStr + "/" +startDateLocal.getFullYear();
	 return retStr;
 }
 
 function getNumberOfOrderTasks(orderId){
	 var numberOfTasks=0;
	 orderTasksXmlStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getordertask"+"&order_id="+orderId);
	 $(orderTasksXmlStore).find('data').each(function(){
		$(this).find('ordertask').each(function(){
			numberOfTasks = numberOfTasks +1;
		});
	 });
	 return numberOfTasks;
 }

 function getNumberOfOrderParts(orderId){
	 var numberOfParts=0;
	 orderPartsXmlStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getorderpart"+"&order_id="+orderId);
	 $(orderPartsXmlStore).find('data').each(function(){
		$(this).find('orderpart').each(function(){
			numberOfParts = numberOfParts +1;
		});
	 });
	 return numberOfParts;
 }
 
 function getNumberOfOrderResources(orderId){
	 var numberOfResources=0;
	 var orderData = findDataById(ordersXmlDataStore,
				'data', 'event','id', orderId);
	 var additionalResources = orderData.find('res_addid').text();
	 var rootDoc = XmlUtil.createXmlDocument("<data></data>");
	 
	 orderResourceXmlStore = "";
	 if(typeof additionalResources !== "undefined"){
		var additionResourcesTokens = additionalResources.split( "|" );
		for(i = 0;i < additionResourcesTokens.length;i++){
			var resourceData = findDataById(resourceXmlDataStore,
					'data', 'res','res_id', additionResourcesTokens[i]);
			var resourceName = $(resourceData).find('res_name').text();
			orderResourceXmlStore = XmlUtil.appendNode(rootDoc,"<ordertmemb><res_id>"+
					additionResourcesTokens[i]+"</res_id></ordertmemb>"); 
			orderResourceXmlStore = XmlUtil.appendNode(rootDoc,"<ordertmemb><res_name>"+
					resourceName+"</res_name></ordertmemb>");
		}
	 }
	 
	 $(orderResourceXmlStore).find('data').each(function(){
		$(this).find('ordertmemb').each(function(){
			numberOfResources = numberOfResources +1;
		});
	 });
	 return numberOfResources;
 }
 
 function getOrderDetailsDisplayGridFooterHtml(orderId){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div data-role="navbar">';
	 htmlStr = htmlStr + '	<ul>';
	 htmlStr = htmlStr + '		<li><a href="#order-pics-page" data-role="tab" data-icon="grid">Pics</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-signatures-page" data-role="tab" data-icon="grid">Signatures</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-notes-page" data-role="tab" data-icon="grid">Notes</a></li>';
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + ' </div>';
	
	 return htmlStr;
 }
 
 function getCustomerDataHtml(thisData){
	 var htmlStr = "";
	 var custName = thisData.find('cust_name').text(); 
	 var contactName = thisData.find('contact_name').text(); 
	 var siteAddr = thisData.find('site_addr').text(); 
	 
	 htmlStr = htmlStr + getCustomerInfoHtml(contactName, custName, siteAddr);
	 return htmlStr;
 } 
 
 function getOrderNameHtml(orderName){
 	var htmlStr = "";
	htmlStr = htmlStr + '<label for="name">Order Name:</label>';
	htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
	htmlStr = htmlStr + '			<input type="text" name="orderName" id="orderName" value="'+orderName+'"/>';
    htmlStr = htmlStr + '		</div>';
    return htmlStr;
 }
 
 function getStartDateHtml(startDate){
	var retStr = getDateInStr(startDate);
	 
	console.log(' getStartDateHtml() retStr '+retStr);
 	var htmlStr = "";
 	
 	htmlStr = htmlStr + '<label for="orderUpdateStartDate">Start Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;" >';
 	htmlStr = htmlStr + "<input name=\"orderUpdateStartDate\" id=\"orderUpdateStartDate\" type=\"text\" value='"+retStr +"' "+ 
 	  			" data-role=\"datebox\" data-options='{\"mode\": \"datebox\", \"useDialogForceFalse\": true,\"noAnimation\": true}'/>";
 	htmlStr = htmlStr + '		</div>';
 	return htmlStr; 
 }
 
 function getAddNewOrderStartDateHtml(startDate){
	 
	var start_date = CommonUtil.convertToUTCFromTime(startDate);
 	//console.log(" start_date "+start_date);
 	var startDate = start_date; //rec.data.start_time;
 	var indexOfZero = startDate.indexOf("-00");
 	var startDateSub = startDate.substring(0,indexOfZero);
 	startDateSub = startDateSub+"GMT+0000";
 	
 	var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
 	var retStr = startDateLocal.getFullYear() + 
 	  		"-"+"0"+(startDateLocal.getMonth()+1)+
 	  		"-"+ startDateLocal.getDate();
 	console.log(' getStartDateHtml() retStr '+retStr);
 	var htmlStr = "";
 	
 	htmlStr = htmlStr + '<label for="newOrderStartDate">Start Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;" >';
 	htmlStr = htmlStr + "<input name=\"newOrderStartDate\" id=\"newOrderStartDate\" type=\"text\" value='' "+ 
 	  			" data-role=\"datebox\" data-options='{\"mode\": \"datebox\", \"useDialogForceFalse\": true,\"noAnimation\": true}'/>";
 	htmlStr = htmlStr + '		</div>';
 	return htmlStr; 
 }
 
// function getStartTime(startDate){
//	 
//	  var start_date = CommonUtil.convertToUTCFromTime(startDate);
//	  var startDate = start_date; //rec.data.start_time;
//	  var indexOfZero = startDate.indexOf("-00");
//	  var startDateSub = startDate.substring(0,indexOfZero);
//	  startDateSub = startDateSub+"GMT+0000";
//	
//	  var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
//	 
//	  //var myDate = new Date((rec.data.start_date).slice(0,16));
//	  var hours = startDateLocal.getHours();
//	  var am = true;
//	  if (hours > 12) {
//	      am = false;
//	      hours = hours - 12;
//	  } else if (hours == 12) {
//	      am = false;
//	  } else if (hours == 0) {
//	      hours = 12;
//	  } 
//	  if(hours < 10){
//		  hours = "0"+hours;
//	  }
//	  var minutes = startDateLocal.getMinutes();
//	  if(minutes < 10){
//		  minutes = "0"+minutes;
//	  }
//     var hourMinStr = hours+":"+minutes+" "+(am ? "AM" : "PM");
//    
//     return hourMinStr;
//}
 
 function getStartTimeHtml(hourMinStr){
	 
	  var htmlStr = "";
      htmlStr = htmlStr + '<label for="startTime">Start Time</label>';
  	  htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 30%;">';
  	  htmlStr = htmlStr + "			<input name=\"startTimeDateBox\" type=\"text\" value =\""+hourMinStr+"\" data-role=\"datebox\" data-options='{\"mode\": \"timebox\", \"timeFormatOverride\":12}' id=\"startTimeDateBox\" />";
  	  htmlStr = htmlStr + '		</div>';
  	
      return htmlStr;
 }
 
 function getAddNewOrderStartTimeHtml(){
	 
	  var htmlStr = "";
      htmlStr = htmlStr + '<label for="newOrderStartTime">Start Time</label>';
 	  htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 30%;">';
 	  htmlStr = htmlStr + "			<input name=\"newOrderStartTime\" id=\"newOrderStartTime\" type=\"text\" value =\"\" data-role=\"datebox\" data-options='{\"mode\": \"timebox\", \"timeFormatOverride\":12}' />";
 	  htmlStr = htmlStr + '		</div>';
 	
     return htmlStr;
 }
 
 function getTime(date){
	 
	  var start_date = CommonUtil.convertToUTCFromTime(date);
	  var startDate = start_date; //rec.data.start_time;
	  var indexOfZero = startDate.indexOf("-00");
	  var startDateSub = startDate.substring(0,indexOfZero);
	  startDateSub = startDateSub+"GMT+0000";
	
	  var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	 
	  //var myDate = new Date((rec.data.start_date).slice(0,16));
	  var hours = startDateLocal.getHours();
	  var am = true;
	  if (hours > 12) {
	      am = false;
	      hours = hours - 12;
	  } else if (hours == 12) {
	      am = false;
	  } else if (hours == 0) {
	      hours = 12;
	  } 
	  if(hours < 10){
		  hours = "0"+hours;
	  }
	  var minutes = startDateLocal.getMinutes();
	  if(minutes < 10){
		  minutes = "0"+minutes;
	  }
    var hourMinStr = hours+":"+minutes+" "+(am ? "AM" : "PM");
   
    return hourMinStr;
 }
 
 function getEndTimeHtml(hourMinStr){
	 
	  var htmlStr = "";
      htmlStr = htmlStr + '<label for="endTime">End Time</label>';
 	  htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
 	  htmlStr = htmlStr + "			<input name=\"endTimeDateBox\" type=\"text\" value =\""+hourMinStr+"\" data-role=\"datebox\" data-options='{\"mode\": \"timebox\", \"timeFormatOverride\":12}' id=\"endTimeDateBox\" />";
 	  htmlStr = htmlStr + '		</div>';
 	
     return htmlStr;
}
 
 function getAddNewOrderEndTimeHtml(){
	 
	  var htmlStr = "";
      htmlStr = htmlStr + '<label for="newOrderEndTime">End Time</label>';
	  htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
	  htmlStr = htmlStr + "			<input name=\"newOrderEndTime\" id=\"newOrderEndTime\" type=\"text\" value =\"\" data-role=\"datebox\" data-options='{\"mode\": \"timebox\", \"timeFormatOverride\":12}' />";
	  htmlStr = htmlStr + '		</div>';
	
    return htmlStr;
 }
 
 function getEndDateHtml(endDate){
	 
 	var retStr = getDateInStr(endDate);
 	
 	console.log(' getEndDateHtml() retStr '+retStr);
 	var htmlStr = "";
 	htmlStr = htmlStr + '<label for="orderUpdateEndDate">End Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
 	htmlStr = htmlStr + "<input name=\"orderUpdateEndDate\" id=\"orderUpdateEndDate\" type=\"text\" value='"+retStr +"'"+
 	  			" data-role=\"datebox\" data-options='{\"mode\": \"datebox\", \"useDialogForceFalse\": true,\"noAnimation\": true}'/>";
 	htmlStr = htmlStr + '		</div>';
 	return htmlStr;
 }
 
function getAddNewOrderEndDateHtml(endDate){
	 
	 var end_date = CommonUtil.convertToUTCFromTime(endDate);
 	//console.log(" start_date "+start_date);
 	var endDate = end_date; //rec.data.start_time;
 	var indexOfZero = endDate.indexOf("-00");
 	var endDateSub = endDate.substring(0,indexOfZero);
 	endDateSub = endDateSub+"GMT+0000"; 
 	
 	var endDateLocal = new Date(endDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
 	var retStr = endDateLocal.getFullYear() + 
 	  		"-"+"0"+(endDateLocal.getMonth()+1)+
 	  		"-"+ endDateLocal.getDate();
 	console.log(' getEndDateHtml() retStr '+retStr);
 	var htmlStr = "";
 	htmlStr = htmlStr + '<label for="newOrderEndDate">End Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
 	htmlStr = htmlStr + "			<input name=\"newOrderEndDate\" id=\"newOrderEndDate\" type=\"text\" value=''"+
 	  			" data-role=\"datebox\" data-options='{\"mode\": \"datebox\", \"useDialogForceFalse\": true,\"noAnimation\": true}'/>";
 	htmlStr = htmlStr + '		</div>';
 	return htmlStr;
 }
 
 function getDurationHtml(duration){
	var htmlStr = "";
 	htmlStr = htmlStr + '<label for="endDate">Duration</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
 	htmlStr = htmlStr + "			<input name=\"duration\" id=\"duration\" type=\"text\" value="+duration +
 	" data-role=\"datebox\" data-options='{\"mode\": \"durationbox\", \"useDialogForceFalse\": true,\"noAnimation\": true, \"overrideDurationOrder\": [\"h\",\"i\"], \"overrideDurationFormat\": \"%Dl:%DM\"}'/>";
 	htmlStr = htmlStr + '		</div>';
 	return htmlStr;
 }
 
 function getAddNewOrderDurationHtml(){
		var htmlStr = "";
	 	htmlStr = htmlStr + '<label for="newOrderDuration">Duration</label>';
	 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
	 	htmlStr = htmlStr + "			<input name=\"newOrderDuration\" id=\"newOrderDuration\" type=\"text\" "+
	 	" data-role=\"datebox\" data-options='{\"mode\": \"durationbox\", \"useDialogForceFalse\": true,\"noAnimation\": true, \"overrideDurationOrder\": [\"h\",\"i\"], \"overrideDurationFormat\": \"%Dl:%DM\"}'/>";
	 	htmlStr = htmlStr + '		</div>';
	 	return htmlStr;
	 }
 
 function getOrderDuration(startDate, endDate){
	 
	  var sd = new Date(startDate.slice(0,16));
	  var ed = new Date(endDate.slice(0,16));
	  var diffSecs = (ed - sd)/1000;
	  
	  var hours = Math.floor(diffSecs / (60 * 60));
	  if(hours < 9){
		  hours = "0"+hours;
	  }
	  var divisor_for_minutes = diffSecs % (60 * 60);
	  var minutes = Math.floor(divisor_for_minutes / 60);
	  if(minutes < 9){
		  minutes = "0"+minutes;
	  }  
     return hours+':'+minutes;
 }
 
 function setStatusId(statusId){
	 var valueStr = '';
	 valueStr = String((statusId * 10) + 10);
	 $('#orderStatusId').val(valueStr).slider('refresh');
 }
 
// $('#orderStatusUlId').delegate('li', 'click', function () {
//	    alert(this.innerText);
// });  
 
 $('#orderStatusUlId').find('a').live('click', function () {
	$('#orderStatusUlId').find('a').removeClass("ui-btn-active");
	$(this).toggleClass("ui-btn-active");
	var orderStatusId = $(this).attr('id');
	var valueStr = '';
	valueStr = String((orderStatusId * 10) + 14);
	console.log(' orderStatusUlId click valueStr:'+valueStr);
	$('#orderStatusId').val(valueStr).slider('refresh');
 });
 
 $("#orderStatusId").live("change", function(event) {
	 var value = $(this).val();
//	 console.log(" value "+value);
	 var orderStatusListValue = (value / 10) -1;
	 $('#orderStatusUlId').find('a').each(function(){
			var elemId = $(this).attr('id');
			if(elemId == orderStatusListValue){
				$('#orderStatusUlId').find('a').removeClass("ui-btn-active");
				$(this).toggleClass("ui-btn-active");
			}
		});
//	 $('#orderStatusId').listview('refresh');
 }); 
 
 function getOrderStatusHtml(statusId){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 var valueStr = '';
	 valueStr = String((statusId * 10) + 10);
	 
     htmlStr = htmlStr + '<label for="select-order-status" class="select">Status:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain">';
	 htmlStr = htmlStr + '		<div id="statusSlider" style="float:left;width: 100px;margin-left:100px;">';
	 htmlStr = htmlStr + '			<input id="orderStatusId" type="range" min="10" max="90" value="'+valueStr+'" step="10" sliderOrientation="vertical" style="height:400px" />';
	 htmlStr = htmlStr + '		</div>'; 
	 
	 htmlStr = htmlStr + '<div style="width:200px;float:left;margin-top: 20px;">';
	 htmlStr = htmlStr + '<ul id="orderStatusUlId" data-role="listview" data-scroll="true">';
	 $(orderStatusTypeXmlDataStore).find('data').each(function(){
			$(this).find('orderstatus').each(function(){
			var orderStatusId = $(this).find('orderstatus_id').text();
			var orderStatusName = $(this).find('orderstatus_name').text();
			htmlStr = htmlStr + 
 				'<li data-icon="false"><a href="#" id="'+orderStatusId+'">'+orderStatusName+'</a></li>';
		});
	 });
		
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '</div>';
	return htmlStr;
 }
 
 function getOrderStatusStr(statusId){
	 statusId = statusId.trim();
	 console.log(' getOrderStatusStr statusId '+statusId);
	 var statusTypeData = findDataById(orderStatusTypeXmlDataStore,
				'data', 'orderstatus','orderstatus_id', statusId);
	 
	 var statusStr = statusTypeData.find('orderstatus_name').text();
	 
	 statusStr = statusStr.trim();
	 console.log(' getOrderStatusStr statusStr '+statusStr);
//	 var orderStatusListValue = (statusStr / 10) -1;
	 return statusStr;
 }
 
 function getOrderTasksHtml(orderTasksXmlStoreParam){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-status" class="select">Tasks:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain">';
	
	 htmlStr = htmlStr + '<ul data-role="listview">';
	 
	 $(orderTasksXmlStoreParam).find('data').each(function(){
		$(this).find('ordertask').each(function(){
			var orderTaskId = $(this).find('ordertask_id').text();
			var taskId = $(this).find('task_id').text();
			
			var taskRefData = findDataById(taskTypeTypeXmlDataStore,
					'data', 'tasktype','task_id', taskId);
			var taskName = taskRefData.find('task_name').text();
			htmlStr = htmlStr + 
		 			'<li><a href="#order-task-edit-page" onclick="sessionStorage.order_task_id='+orderTaskId+'">'+taskName+'</a></li>';
		});
	 });
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + '</div>';
	return htmlStr;
 }
 

 function getOrderPartsHtml(orderPartsXmlStore){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-status" class="select">Parts:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain">';
	
	 htmlStr = htmlStr + '<ul data-role="listview">';
	 
	 $(orderPartsXmlStore).find('data').each(function(){
		$(this).find('orderpart').each(function(){
			var orderPartId = $(this).find('orderpart_id').text();
			var partId = $(this).find('part_id').text();
			
			var partRefData = findDataById(partTypeXmlDataStore,
					'data', 'parttype','part_id', partId);
			var partName = partRefData.find('part_name').text();
			htmlStr = htmlStr + 
		 			'<li><a href="#order-part-edit-page" onclick="sessionStorage.order_part_id='+orderPartId+'">'+partName+'</a></li>';
		});
	 });
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + '</div>';
	return htmlStr;
 }
 
 function getOrderResourcesHtml(orderResourceXmlStore){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-resource" class="select">Resources:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" >';
	
	 htmlStr = htmlStr + '<ul data-role="listview" data-scroll="true">';
	 
	 $(orderResourceXmlStore).find('data').each(function(){
		$(this).find('ordertmemb').each(function(){
			var resourceId = $(this).find('res_id').text();
			var resourceName = $(this).find('res_name').text();
			console.log(" resourceId :"+resourceId+":resourceName:"+resourceName+":");
			if(resourceId !== ""){
				htmlStr = htmlStr + 
		 			'<li><a href="#order-resource-edit-page" onclick="setOrderResourceIdInSession(\''+resourceId+'\')">'+resourceName+'</a></li>';
			}
		});
	 });
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + '</div>';
	 
	return htmlStr;
 }
 
 function getOrderSignaturesHtml(orderSignatureXmlStore){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-signatures" class="select">Signatures</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" >';
	 htmlStr = htmlStr + '<ul data-role="listview" data-scroll="true">';
	 
	 $(orderSignatureXmlStore).find('data').each(function(){
		$(this).find('filemeta').each(function(){
			var fileId = $(this).find('file_id').text();
			var fileTimeStamp = $(this).find('file_tstmp').text();
			var fileType = $(this).find('file_type').text();
			fileType = fileType.trim();
			// the file type for Signatures is 2
			if(fileType == '2'){
				htmlStr = htmlStr +  
			 			'<li><a href="#order-signature-edit-page" onclick="sessionStorage.fileId='+fileId+'">'+fileTimeStamp+'</a></li>';
			}
		});
	 });
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + '</div>';
	return htmlStr; 
 }
 
 function getOrderSignatureDetail(fileId){
//	 https://acerouteqa.appspot.com/mobi?loginref=aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08&action=getfile&file_id=240001&mtoken=aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08
	 var htmlStr = "";
	 htmlStr = htmlStr + '<label for="select-order-part" class="select">Parts:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + ' <img src="https://acerouteqa.appspot.com/mobi?action=getfile&file_id='+fileId+'&mtoken='+mtoken +'/>';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;"><button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-signature-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderPicsHtml(orderPicsXmlStore){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-pics" class="select">Pics</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" >';
	
	 htmlStr = htmlStr + '<ul data-role="listview" data-scroll="true">';
	 
	 $(orderPicsXmlStore).find('data').each(function(){
		$(this).find('filemeta').each(function(){
			var fileId = $(this).find('file_id').text();
			var fileTimeStamp = $(this).find('file_tstmp').text();
			var fileType = $(this).find('file_type').text();
			fileType = fileType.trim();
			// the file type for Camera pics is 1
			if(fileType == '1'){
				htmlStr = htmlStr +  
			 			'<li><a href="#order-pic-edit-page" onclick="sessionStorage.fileId='+fileId+'">'+fileTimeStamp+'</a></li>';
			}
		});
	 });
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + '</div>';
	return htmlStr; 
 }
 
 function getOrderPicDetail(fileId){
//	 https://acerouteqa.appspot.com/mobi?loginref=aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08&action=getfile&file_id=240001&mtoken=aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08
	 var htmlStr = "";
	 htmlStr = htmlStr + '<label for="select-order-pic" class="select">Pic</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + ' <img src="https://acerouteqa.appspot.com/mobi?action=getfile&file_id='+fileId+'&mtoken='+mtoken +'/>';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '<fieldset class="ui-grid-a">';
	 htmlStr = htmlStr + '		<div class="ui-block-a" style="width: 25%;"><button type="submit" data-theme="d">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_pic_edit_div = $('#order-pic-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_pic_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function addOrderPic(orderId){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<label for="select-order-pic" class="select">Capture Picture</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + '	<img style="display:none;width:200px;height:100px;" id="smallImage" src="" />';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="button-pic-cancel-button" type="button" data-theme="a">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="button-pic-capture" type="button" data-theme="a">Capture</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="button-pic-save" type="button" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_pic_edit_div = $('#order-pic-add-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_pic_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function addOrderSignature(orderId){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<label for="select-order-pic" class="select">Capture Signature</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" id="canvasDiv" style="width: 35%;margin-top: -30px;margin-left: -10px;">';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="button-signature-cancel-button" type="button" data-theme="a">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="button-signature-save" type="button" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_pic_edit_div = $('#order-signature-add-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_pic_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
  
 function getCustomerInfoHtml(contactName, 
		 customerName, 
		 siteAddr){
	 
 	var htmlStr = "";
	htmlStr = htmlStr + '<label for="customerName">Customer Details:</label>';
	htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
	htmlStr = htmlStr + '			<input type="text" name="contactName" id="contactName" value="'+contactName+'" readonly="readonly"/>';
    htmlStr = htmlStr + '		</div>';
	htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
	htmlStr = htmlStr + '			<input type="text" name="customerName" id="customerName" value="'+customerName+'" readonly="readonly"/>';
    htmlStr = htmlStr + '		</div>';
    htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
	htmlStr = htmlStr + '			<input type="text" name="customerAddr" id="customerAddr" value="'+siteAddr+'" readonly="readonly"/>';
    htmlStr = htmlStr + '		</div>';
    return htmlStr;
}
 
 function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
 }
 