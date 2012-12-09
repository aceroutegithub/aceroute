AceRoute = {};
AceRoute.appUrl = 'http://192.168.0.4:8080/AceRouteMobile/dataReceiver.jsp';   
AceRoute.appUrlPost = 'http://192.168.0.4:8080/AceRouteMobile/dataReceiverPostAuthQA.jsp';

 
var customerXmlDataStore;
var orderTypeXmlDataStore;
var partTypeXmlDataStore;
var resXmlDataStore;
var taskTypeTypeXmlDataStore;
var mtoken = 'aceroute.com|234001|7F000001013A567DEC4E05EA00AB436D';
//AceRoute.appUrl = 'https://acerouteqa.appspot.com/mobi';   
//AceRoute.appUrlPost = 'https://acerouteqa.appspot.com/mobi';
//AceRoute.appUrlImageGet = 'https://acerouteqa.appspot.com/mobi';   

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
var map;
function createQuakeEventMarker(quakeEventLatlng) {
    return new google.maps.Marker({position: quakeEventLatlng, map: map});
}
function setupMap(lat, lng, mapZoom, showOverviewControl) {
    var mapLatlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
        center : new google.maps.LatLng(lat, lng), 
        zoom : 8,
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        navigationControl: true,
        navigationControlOptions: {
                style: google.maps.NavigationControlStyle.DEFAULT
            }
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    $("map_canvas").trigger("refresh");
}

function initialize() {
    setupMap(37.7830665, -122.43101239999998, 11, true);
    var quakeEventLatlng = new google.maps.LatLng(37.7830665, -122.43101239999998);
    var marker = createQuakeEventMarker(quakeEventLatlng)
    marker.setAnimation(google.maps.Animation.DROP)
}
// Initialize the map when the jQuery Mobile pageshow event is triggered
$('.details-page').live("pageshow", function() {
    if (map == null) {
        initialize();
    }
});

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
	 loadRefData();
	 loadOrders();
 }
 
 function loadRefData(){
	 customerXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getcust");
	 orderTypeXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getordertype");
	 partTypeXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getparttype");
	 resXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getres");
	 taskTypeTypeXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=gettasktype");
 }
 
 function findDataById(xmlDataStore,dataNodeName, childDataNodeName,idNodeName, idValue){
	 var returnObj;
	 $(xmlDataStore).find(dataNodeName).each(function(){
		$(this).find(childDataNodeName).each(function(){
			var idV = $(this).find(idNodeName).text();
			if(idV === idValue){
				returnObj = $(this);
			}
		});
	 });
	 return returnObj;
 }
 
 function loadOrders(){
	 $.ajax({
			type: "GET",
			async: false,
			url: "orders.xml",
			dataType: "xml",
			success: function(xml) {
				var htmlStr = '';
				$(xml).find('data').each(function(){
					$(this).find('event').each(function(){
						var cust_id = $(this).find('cust_id').text();
						var id = $(this).find('id').text();
						var orderName = $(this).find('order_name').text();
						var siteAddr = $(this).find('site_addr').text();
						var orderTypeId = $(this).find('order_typeid').text();
						
						siteAddr = siteAddr.formatAddress(',');
						var custData = findDataById(customerXmlDataStore,
								'data', 'cust','cust_id', cust_id);
					    var custName = $(custData).find("cust_name").text();
					    var custContactXmlStore = $.getValues(AceRoute.appUrl+
								 "?mtoken="+mtoken+"&action=getcontact&cust_id="+cust_id);
					    var custContactData = findDataById(custContactXmlStore,
								'data', 'contact','cust_id', cust_id);
					    var custName = $(custContactData).find("contact_name").text();
					    
					    var orderTypeData = findDataById(orderTypeXmlDataStore,
								'data', 'ordertype','ordertype_id', orderTypeId);
					    var orderTypeName = $(orderTypeData).find("ordertype_name").text();
					    
						// ui-collapsible ui-collapsible-inset
						//htmlStr = '<h2>Filtered list</h2>'; 
						var startDate = $(this).find('start_date').text();
						var endDate = $(this).find('end_date').text();
						var startTime = getStartTime(startDate);
					 	var duration = getOrderDuration(startDate, endDate);
						
					 	htmlStr = htmlStr + '<li style="padding: 2.0em 15px;">'+
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
							
	                        '<div class="outerDiv">'+
		                        '<div class="leftDiv">'+
		                        '</div>'+
		                        '<div class="rightDiv">'+
		                            '<ol>'+
		                            	'<li><img alt="" src="img/phone.jpg" onclick="callAPhone()" height="20" width="20" /></li>'+
		                                '<li><img alt="" src="img/maps1.png" onclick="navigateOnClick(' +id+ ')" height="20" width="20" />'+
		                                '<li><img alt="" src="img/play.png" onclick="showOrderDetails(' +id+ ')" height="20" width="20"/></li>'+
		                            '</ol>'+
		                        '</div>'+
		                     '</div>'+
	                     '</div>'+
						'</li>';
						
					});
				});
				var orders_list = $('#orderlist ul');
				//orders_list.empty();
				//orders_list.html(htmlStr);
				orders_list.html(htmlStr).listview('refresh');//trigger("create"); //.trigger("refresh");
			}
		});
 }
 
 $('#orderdetail').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderDetails(orderId);
 });

 function getOrderDetails(orderId){
	 var orderHtmlStr = '';
	 var customerHtmlStr = '';
 	 $.ajax({
		type: "GET",
		async: false,
		url: "orders.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('data').each(function(){
				$(this).find('event').each(function(){
					var id = $(this).find('id').text();
					if(orderId == id){
						var thisData = $(this);
						orderHtmlStr = getOrderDataHtml(thisData);
						
						customerHtmlStr = getCustomerDataHtml(thisData);
					}
				});
			});
		}
    });
	var orders_data = $('#orderinfo #orderfields');
	//orders_list.empty();
	//orders_list.html(htmlStr);
	orders_data.html(orderHtmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
	
	var customer_data = $('#customerinfo #customerfields');
	//orders_list.empty();
	//orders_list.html(htmlStr);
	customer_data.html(customerHtmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
 }
 
 function getOrderDataHtml(thisData){
	 	var orderName = thisData.find('order_name').text();
		var startDate = thisData.find('start_date').text();
		var endDate = thisData.find('end_date').text();
		
		var htmlStr = "";
		
		var orderNameHtml = getOrderNameHtml(orderName);
		htmlStr = htmlStr + orderNameHtml;
	    var startDateHtml = getStartDateHtml(startDate);
	    htmlStr = htmlStr + startDateHtml;
	    
	    var startTime = getStartTime(startDate);
	 	var startTimeHtml = getStartTimeHtml(startTime);
	 	htmlStr = htmlStr + startTimeHtml;
	 	
	 	var endDateHtml = getEndDateHtml(endDate);
	 	htmlStr = htmlStr + endDateHtml;
	 	
	 	var endTime = getEndTime(endDate);
	 	var endTimeHtml = getEndTimeHtml(endTime);
	 	htmlStr = htmlStr + endTimeHtml;
 	
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
 	var htmlStr = "";
 	htmlStr = htmlStr + '<label for="startDate">Start Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
 	htmlStr = htmlStr + "<input name=\"startDate\" id=\"startDate\" type=\"text\" value="+retStr +
 	  			" data-role=\"datebox\" data-options='{\"mode\": \"datebox\", \"useDialogForceFalse\": true,\"noAnimation\": true}'/>";
 	htmlStr = htmlStr + '		</div>';
 	return htmlStr;
 }
 
 function getStartTime(startDate){
	  var start_date = CommonUtil.convertToUTCFromTime(startDate);
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
 
 function getStartTimeHtml(hourMinStr){
	  var htmlStr = "";
      htmlStr = htmlStr + '<label for="startTime">Start Time</label>';
  	  htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
  	  htmlStr = htmlStr + "<input name=\"startTimeDateBox\" type=\"text\" value =\""+hourMinStr+"\" data-role=\"datebox\" data-options='{\"mode\": \"timebox\", \"timeFormatOverride\":12}' id=\"startTimeDateBox\" />";
  	  htmlStr = htmlStr + '		</div>';
  	
      return htmlStr;
 }
 
 function getEndTime(endDate){
	  var start_date = CommonUtil.convertToUTCFromTime(endDate);
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
 	  htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
 	  htmlStr = htmlStr + "<input name=\"endTimeDateBox\" type=\"text\" value =\""+hourMinStr+"\" data-role=\"datebox\" data-options='{\"mode\": \"timebox\", \"timeFormatOverride\":12}' id=\"endTimeDateBox\" />";
 	  htmlStr = htmlStr + '		</div>';
 	
     return htmlStr;
}
 
 function getEndDateHtml(endDate){
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
 	var htmlStr = "";
 	htmlStr = htmlStr + '<label for="endDate">End Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" >';
 	htmlStr = htmlStr + "<input name=\"endDate\" id=\"endDate\" type=\"text\" value="+retStr +
 	  			" data-role=\"datebox\" data-options='{\"mode\": \"datebox\", \"useDialogForceFalse\": true,\"noAnimation\": true}'/>";
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