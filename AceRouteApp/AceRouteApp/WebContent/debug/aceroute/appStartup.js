AceRoute = {};
AceRoute.appUrl = 'http://192.168.0.4:8080/AceRouteMobile/dataReceiver.jsp';   
AceRoute.appUrlPost = 'http://192.168.0.4:8080/AceRouteMobile/dataReceiverPostAuthQA.jsp';

 
var customerXmlDataStore;
var orderTypeXmlDataStore;
var partTypeXmlDataStore;
var resourceXmlDataStore;
var taskTypeTypeXmlDataStore;

var ordersXmlDataStore;
var orderTasksXmlStore;
var orderPartsXmlStore;
var orderResourceXmlStore;
var orderPicsXmlStore;
 
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
	var startDate = orderData.find('start_date').text();
	var endDate = orderData.find('end_date').text();
	var order_wkfid = orderData.find('order_wkfid').text();
	var orderId = orderData.find('id').text();
	var current_date = new Date();
	var start_date = new Date(startDate);
	var end_date = new Date(endDate);
	var iconClr = CommonUtil.getIconColor(
			  current_date, start_date, end_date, order_wkfid );
	var image = new google.maps.MarkerImage(
			'http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|'+iconClr+'|10|b|1');  
	var shadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
	//var shadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');
	
	
    map = new google.maps.Map(document.getElementById('map_canvas'), {
       zoom: 8,
       center: centerLatLng,
       mapTypeId: google.maps.MapTypeId.ROADMAP,
       navigationControl: true,
       navigationControlOptions: {
           style: google.maps.NavigationControlStyle.DEFAULT
       }
     });
    
    var marker = new google.maps.Marker({
        position: centerLatLng,   
        title : 'Order Location',
        shadow: shadow,
        icon  : image,
        map: map
    }); 
    var message = "<font size='2'>"+  
		
		"<input type='button' name='orderDetails' value='Order' class='x-button-label' onclick='showOrderDetails(\'"+orderId+"\')'/>"+
		"<input type='button' name='navigate' value='Navigate' class='x-button-label' onclick='navigate("+ latitude + ","+ longitude +")'/>";
    var infowindow = new google.maps.InfoWindow(
  	      { content: message,
  	        size: new google.maps.Size(30,30)
  	        
  	      });
  	    
      	google.maps.event.addListener(marker, 'click', function() {
  	       infowindow.open(map,marker);
  	    });
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
	 resourceXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=getres");
	 taskTypeTypeXmlDataStore = $.getValues(AceRoute.appUrl+
			 "?mtoken="+mtoken+"&action=gettasktype");
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
			if(idV === idValue){
				returnObj = $(this);
			}
		});
	 });
	 return returnObj;
 }
 
 function loadOrders(){
	 
	ordersXmlDataStore = $.getValues("orders.xml");
	 
	var htmlStr = '';
	$(ordersXmlDataStore).find('data').each(function(){
		$(this).find('event').each(function(){
			var orderData = $(this);
			
			var cust_id = orderData.find('cust_id').text();
			var id = orderData.find('id').text();
			var orderName =orderData.find('order_name').text();
			var siteAddr = orderData.find('site_addr').text();
			var orderTypeId = orderData.find('order_typeid').text();
			
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
			var startDate = orderData.find('start_date').text();
			var endDate = orderData.find('end_date').text();
			var startTime = getStartTime(startDate);
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
	orders_list.html(htmlStr).listview('refresh');//trigger("create"); //.trigger("refresh");	
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
 
 $('#order-parts').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderPartsDetails(orderId);
 });
 
 $('#order-part-edit-page').live('pageshow', function(event, ui) {
	 var orderPartId = sessionStorage.order_part_id;
     getOrderPartDetail(orderPartId);
 });
 
 $('#order-resources').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderResourcesDetails(orderId);
 });
 
 $('#order-resource-edit-page').live('pageshow', function(event, ui) {
	 var orderPartId = sessionStorage.order_part_id;
     getOrderPartDetail(orderPartId);
 });
 
 $('#order-signatures-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     getOrderSignaturesDetail(orderId);
 });
 
 $('#order-signature-edit-page').live('pageshow', function(event, ui) {
	 var fileId = sessionStorage.fileId;
     getOrderSignatureDetail(fileId);
 });
 $('#order-signature-add-page').live('pageshow', function(event, ui) {
	 var orderId = sessionStorage.order_id;
     addOrderSignature(orderId);
     drawingApp.init();
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
	 var orderName = orderData.find('order_name').text();
	 var orderPO = orderData.find('order_po').text();
	 var orderInst = orderData.find('order_inst').text();
	 
	 var siteAddr = orderData.find('site_addr').text();
	 	
	 siteAddr = siteAddr.formatAddress(',');
	 var custData = findDataById(customerXmlDataStore,
				'data', 'cust','cust_id', cust_id);
	 var custName = $(custData).find("cust_name").text();
	 
	 var custContactXmlStore = $.getValues(AceRoute.appUrl+
				 "?mtoken="+mtoken+"&action=getcontact&cust_id="+cust_id);
	 var custContactData = findDataById(custContactXmlStore,
				'data', 'contact','cust_id', cust_id);
	 var contactName = $(custContactData).find("contact_name").text();
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
		  	    '<input name=\"orderPO\" type=\"text\" value ="'+orderPO+ '" id=\"custName\" />'+
		  	'</div>'+
		  	'<label for="name">Instructions:</label>'+
			'<div data-role="fieldcontain">'+
		  	    '<input name=\"orderInst\" type=\"text\" value ="'+orderInst+ '" id=\"custName\" />'+
		  	'</div>'+
		  	
		'</div>'+	
	'</div>';
	 
//	 var startDateHtml = getStartDateHtml(startDate);
//	 htmlStr = htmlStr + startDateHtml;
//	    
	 var orders_data = $('#order-details-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh");
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
	 var endDate = orderData.find('end_date').text();
	 var startTime = getStartTime(startDate);
 	 var duration = getOrderDuration(startDate, endDate);
	 
     var startDateHtml = getStartDateHtml(startDate);
     htmlStr = htmlStr + startDateHtml;
     var endDateHtml = getEndDateHtml(endDate);
 	 htmlStr = htmlStr + endDateHtml;
 	 
     var startTime = getStartTime(startDate);
 	 var startTimeHtml = getStartTimeHtml(startTime);
 	 htmlStr = htmlStr + startTimeHtml;
 	
 	 var endTime = getEndTime(endDate);
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
	
// 	 var orderTasksXmlStore = $.getValues(AceRoute.appUrl+
//			 "?mtoken="+mtoken+"&action=getordertask"+"&order_id="+orderId);
	 orderTasksXmlStore = $.getValues("orderTasks.xml");
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
	 var orderTaskData = findDataById(orderTasksXmlStore,
				'data', 'ordertask','ordertask_id', orderTaskId);
	 var taskId = orderTaskData.find('task_id').text();
	 var orderTaskHrs = orderTaskData.find('ordertask_hrs').text(); 
	 var taskRefData = findDataById(taskTypeTypeXmlDataStore,
			'data', 'tasktype','task_id', taskId);
	 var taskName = taskRefData.find('task_name').text();
	 
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-status" class="select">Tasks:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain"  style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-task" id="select-order-task" data-native-menu="false">';
	 
 	 $(taskTypeTypeXmlDataStore).find('data').each(function(){
 		$(this).find('tasktype').each(function(){
			var taskId = $(this).find('task_id').text();
			var taskName = $(this).find('task_name').text();
			htmlStr = htmlStr + '	<option value="'+taskId+'">'+taskName+'</option>';
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
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-task-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 } 
 
 function getOrderPartsDetails(orderId){
	 var htmlStr = '';
	
// 	 var orderTasksXmlStore = $.getValues(AceRoute.appUrl+
//			 "?mtoken="+mtoken+"&action=getordertask"+"&order_id="+orderId);
	 orderPartsXmlStore = $.getValues("orderParts.xml");
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
	 var partId = orderPartData.find('part_id').text();
	 var orderPartQty = orderPartData.find('orderpart_qty').text(); 
	 var partRefData = findDataById(partTypeXmlDataStore,
			'data', 'parttype','part_id', partId);
	 var partName = partRefData.find('part_name').text();
	 
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-part" class="select">Parts:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-part" id="select-order-part" data-native-menu="false">';
	 
 	 $(partTypeXmlDataStore).find('data').each(function(){
 		$(this).find('parttype').each(function(){
			var partId = $(this).find('part_id').text();
			var partName = $(this).find('part_name').text();
			htmlStr = htmlStr + '	<option value="'+partId+'">'+partName+'</option>';
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
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-part-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderResourcesDetails(orderId){
	 var htmlStr = '';
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
	 
	 var orders_data = $('#order-resources-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_data.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderResourceDetail(orderId){

	 var orderData = findDataById(orderPartsXmlStore,
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
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-part" class="select">Parts:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" style="width: 35%;">';
	 htmlStr = htmlStr + '<select name="select-order-part" id="select-order-part" data-native-menu="false">';
	 
 	 $(orderResourceXmlStore).find('data').each(function(){
 		$(this).find('parttype').each(function(){
			var partId = $(this).find('part_id').text();
			var partName = $(this).find('part_name').text();
			htmlStr = htmlStr + '	<option value="'+partId+'">'+partName+'</option>';
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
	 htmlStr = htmlStr + '		<div class="ui-block-b" style="width: 25%;"><button type="submit" data-theme="a">Save</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button type="submit" data-theme="a">Delete</button></div>';
	 htmlStr = htmlStr + '</fieldset>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_task_edit_div = $('#order-part-edit-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_task_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function getOrderSignaturesDetail(orderId){
//	 mtoken=aceroute.com%7C234001%7C7F000001013A6FD756D86C8E00F34A08&action=savefile&order_id=229008&file_geocode=1&file_type=2&file=iVBORw0KGgoAAAANSUhEUgAAAMgAAACWCAYAAACb3McZAAAISElEQVR4Xu2dyasdRRSHX4xTEkVFiREVNBsXIoIBgyAK4r%2BQheDCjQOiOCxFEDcGN4oYXOhGQXCRf0FciOIAcaEYyEYEBQecgkMc0fMzt33JM3m3TlV13%2Bo634XDvS9W9evznfrsqr7d%2Fbas8YIABE5LYAtsIACB0xNAEEYHBDYhgCAMDwggCGMAAnkEOILkcaNXEAIIEqTQpJlHAEHyuNErCAEECVJo0swjgCB53OgVhACCBCk0aeYRQJA8bvQKQgBBghSaNPMIIEgeN3oFIYAgQQpNmnkEECSPG72CEECQIIUmzTwCCJLHjV5BCCBIkEKTZh4BBMnjRq8gBBAkSKFJM48AguRxo1cQAggSpNCkmUcAQfK40SsIgSkEecJYPhmEJ2l2RmAKQYTsDYvbOmNHOgEITCWIUH5isd%2FipQBcSbETAlMKImSHF9xesfenF5%2F%2FtPdvLHZ1wpQ0OiIwtSBCd5%2FF4wuGO%2B39AYvnLLZ1xJVUOiGwCkEGdI%2FZh6cWP%2Fxu7zdbvN8JV9LohMAqBTkR4ff2w%2BsW%2BzrhShqdEGhFkI%2BM5w6L3Z1wJY1OCLQiyDPG826L8zvhShqdEGhFEOHU2awzO%2BFKGp0QaEmQH42pviN5tBO2pNEBgZYE0ReJP1tc1wFXUuiEQEuCHDSmt1tc1Alb0uiAQEuC3Gg837I4uwOupNAJgZYEEdJjFg9ZvNgJX9KYOYHWBPnSeB6xuHXmXNn9Tgi0Jogui99jcUEnfElj5gRaE0Q4%2F7LYOnOu7H4nBEoF%2Be0UHM4pZHPU%2Bh%2By4AarQpB0LycwhiDaqxJJmGaV15UtVCJQKsjG3RiOKCWCMM2qVFw2U06gtiD6Jvwsi9LvMphmldeWLVQgUFuQWv%2F3Z5pVobhsopzAGILo7sA%2FLHR%2FR8mLs1kl9OhbhcAYgtQ6ijDNqlJiNlJCYCxBakjyoW3kagtuoiqpMH2LCIwpyKe2Z1dY5N4Eda%2F1PbBY9BclSWcI5BIYUxDtU%2BlpX61ldAPV87kJ0g8CJQTGFkT7pltpP7e4KmNHdZehjkTcRJUBjy7lBKYQ5AfbTZ3R0vcj3hfrEC8x2lclMIUg2mFNlX6x8F6lyzqkarnZmJfAVIKUHEVYh3irSvtqBKYSpOQowjqkWrnZkJfAlIK8bTu318J72pd1iLeqtK9GYEpBtNNah0gQz8WMrEOqlZsNeQlMLYj2T9dq6dTvdsfOsg5xwKJpPQKrEER7L0F016CmXCkv1iEplGhTncCqBPnOMtE1VqnfjbxjbW%2BwKL0RqzpANtg3gVUJIqqaNv1kkfokRR117rJ4te%2BSkF1LBFYpiPcoor9jqNclLQFkX%2FomsEpBvEeRO63Dyxbe08R9V5DsRiWwakG8RxFdHfyBxU2jUmHjEFgQWLUg3qPIC9bhHo4ijN%2BpCLQgiJ7He7FF6hktXdel14VTQeL3xCXQgiCi733Qg85o6Qnw98ctHZlPQaAVQZ61ZB90TJ2Yak0xOvgda60IolJ4b89lqsUAHp1AS4IoWU2ddP%2F5I4mZM9VKBEWzPAKtCeJ9dClTrby60yuRQGuCaLd1Ccq3FrsSc2CqlQiKZn4CLQrymqWxz7FgH6ZmnNXy158eSwi0KIh2WZe3n2uR%2Bt0IUy2G%2BigEWhVEyXJWa5SSs1EPgZYFGdYjv9qH1OfzclbLU33aLiXQuiDD%2BuKgfbhjaTZra0y1EiDRJJ3AHAT52NK5xrFo56xWev1pOdNF%2Bsbd9q5HmGox9KsQmMMRZEhUg%2F6IxbUJmTPVSoBEk%2BUE5iQIU63l9aRFZQJzEkSpM9WqPADY3OYE5ibIcFaLqRYjexICcxREYDx%2FAZezWpMMpT5%2FyVwF8UrCWa0%2Bx%2B%2FoWc1ZEK8knqPO6OD5BfMgMHdBBkn0ULlLE5AjSQIkmqwT6EEQZaN7SPTSc7aWiYIkGJBMoBdBlPDXFsNzfpeJgiTJQyR2w54EGSp5oiib3U%2BCJLHHflL2PQoyJP6VfdAD6TZ7li%2BSJA2TuI16FkRV%2FcJCT4PnSBJ3jBdl3rsggnPMYqvF6f4uos6AnWehW3x5QeAkAhEEUcJ6tKmmU9tOUf837d%2F0tPjU%2B98ZQoEIRBFEJdWpYB0tLttQ3z3283sW%2FN2RQAM%2FNdVIgoiJLjnRKeCdGwDp3w9YPJwKjnYxCEQTZDiS6F2ngy9flFlHl88sdscoO1mmEogoiNgMZ7f0WWsPPfJUrx2p4GgXg0BUQYbqHrUP2xdHjysXssSoPFkmEYguyDDl0j0jukyFhXrSsInTCEGOrz30oGyx2GtxKE75yXQZAQQ5TkiL9L8t3rW4ZRk0%2FnscAgiyXmud6tVUS5em8ILAvwQQZH0g6BnAuiSFb9SR4z8CCLI%2BGPRIoTMsDltczxiBAEeQ%2F48BTbO0HjnVNVuMmIAEOIKcXHTvg%2BkCDplYKSNIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CSCIExjNYxFAkFj1JlsnAQRxAqN5LAIIEqveZOskgCBOYDSPRQBBYtWbbJ0EEMQJjOaxCCBIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CSCIExjNYxFAkFj1JlsnAQRxAqN5LAIIEqveZOskgCBOYDSPRQBBYtWbbJ0EEMQJjOaxCCBIrHqTrZMAgjiB0TwWAQSJVW%2BydRJAECcwmscigCCx6k22TgII4gRG81gEECRWvcnWSQBBnMBoHosAgsSqN9k6CfwDJ7XOlxyNO1wAAAAASUVORK5CYII%3D
//	 https://acerouteqa.appspot.com/mobi?action=getfilemeta&order_id=229008&mtoken=aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08&0.07896445458754897
//	 <data>
//	 	<filemeta><file_id><![CDATA[240001]]></file_id><order_id><![CDATA[229008]]></order_id>
//	 	<file_type><![CDATA[2]]></file_type><file_geocode><![CDATA[1]]></file_geocode><file_tstmp><![CDATA[1350496162463]]></file_tstmp>
//	 	<subt_by><![CDATA[Test User]]></subt_by></filemeta></data>
	 orderPicsXmlStore = $.getValues("orderPics.xml");

	 htmlStr = getOrderSignaturesHtml(orderPicsXmlStore);
	 
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
	 orderPicsXmlStore = $.getValues("orderPics.xml");

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
	 var htmlStr = "";
//	 htmlStr = htmlStr + '		<li><a href="#order-details" data-role="tab" data-icon="grid" class="ui-btn-active">Details</a></li>';
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
	 htmlStr = htmlStr + '<div data-role="navbar">';
	 htmlStr = htmlStr + '	<ul>';
	 htmlStr = htmlStr + '		<li><a href="#order-details" data-role="tab" data-icon="grid" class="ui-btn-active">Details</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-date-time" data-role="tab" data-icon="grid">Date/Time</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-status" data-role="tab" data-icon="grid">Status</a></li>';
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + ' </div>';
	 htmlStr = htmlStr + '<div data-role="navbar">';
	 htmlStr = htmlStr + '	<ul>';
	 htmlStr = htmlStr + '		<li><a href="#order-tasks" data-role="tab" data-icon="grid">Tasks</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-parts" data-role="tab" data-icon="grid">Parts</a></li>';
	 htmlStr = htmlStr + '		<li><a href="#order-resources" data-role="tab" data-icon="grid">Resources</a></li>';
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + ' </div>';
	 return htmlStr;
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
 	
 	htmlStr = htmlStr + '<label for="startDate">Start Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;" >';
 	htmlStr = htmlStr + "<input name=\"startDate\" id=\"startDate\" type=\"text\" value='10/18/2012' "+ 
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
  	  htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 30%;">';
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
 	  htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
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
 	console.log(' getEndDateHtml() retStr '+retStr);
 	var htmlStr = "";
 	htmlStr = htmlStr + '<label for="endDate">End Date</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
 	htmlStr = htmlStr + "<input name=\"endDate\" id=\"endDate\" type=\"text\" value='10/17/2012'"+
 	  			" data-role=\"datebox\" data-options='{\"mode\": \"datebox\", \"useDialogForceFalse\": true,\"noAnimation\": true}'/>";
 	htmlStr = htmlStr + '		</div>';
 	return htmlStr;
 }
 
 function getDurationHtml(duration){
	var htmlStr = "";
 	htmlStr = htmlStr + '<label for="endDate">Duration</label>';
 	htmlStr = htmlStr + '		<div data-role="fieldcontain" style="width: 45%;">';
 	htmlStr = htmlStr + "<input name=\"duration\" id=\"duration\" type=\"text\" value="+duration +
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
 
 function getOrderStatusHtml(statusId){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-status" class="select">Status:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain">';
	
	 htmlStr = htmlStr + '<select name="select-order-status" id="select-order-status" data-native-menu="false">';
	 htmlStr = htmlStr + '	<option value="5">Cancelled</option>';
	 htmlStr = htmlStr + '	<option value="4">Completed</option>';
	 htmlStr = htmlStr + '	<option value="6">In-Transit</option>';
	 htmlStr = htmlStr + '	<option value="7">Invoiced</option>';
	 htmlStr = htmlStr + '	<option value="0">New</option>';
	 htmlStr = htmlStr + '	<option value="2">Dispatched</option>';
	 htmlStr = htmlStr + '	<option value="1">Scheduled</option>';
	 htmlStr = htmlStr + '	<option value="3">Started</option>';
	 htmlStr = htmlStr + '	<option value="9">Unscheduled (Schedule Date Later)</option>';	
	 htmlStr = htmlStr + '	</select>';
	 htmlStr = htmlStr + '</div>';
	return htmlStr;
 }
 
 function getOrderTasksHtml(orderTasksXmlStore){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-status" class="select">Tasks:</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain">';
	
	 htmlStr = htmlStr + '<ul data-role="listview">';
	 
	 $(orderTasksXmlStore).find('data').each(function(){
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
			htmlStr = htmlStr + 
		 			'<li><a href="#order-part-edit-page" onclick="sessionStorage.resourceId='+resourceId+'">'+resourceName+'</a></li>';
		});
	 });
	 htmlStr = htmlStr + '	</ul>';
	 htmlStr = htmlStr + '</div>';
	return htmlStr;
 }
 
 function getOrderSignaturesHtml(orderPicsXmlStore){
	 var htmlStr = "";
	 htmlStr = htmlStr + '<div>&nbsp;</div> <div>&nbsp;</div>';
     htmlStr = htmlStr + '<label for="select-order-signatures" class="select">Signatures</label>';
	 htmlStr = htmlStr + '<div data-role="fieldcontain" >';
	
	 htmlStr = htmlStr + '<ul data-role="listview" data-scroll="true">';
	 
	 $(orderPicsXmlStore).find('data').each(function(){
		$(this).find('filemeta').each(function(){
			var fileId = $(this).find('file_id').text();
			var fileTimeStamp = $(this).find('file_tstmp').text();
			htmlStr = htmlStr + 
		 			'<li><a href="#order-signature-edit-page" onclick="sessionStorage.fileId='+fileId+'">'+fileTimeStamp+'</a></li>';
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
	 htmlStr = htmlStr + ' <img src="https://acerouteqa.appspot.com/mobi?loginref='+mtoken+'&action=getfile&file_id='+fileId+'&mtoken='+mtoken +'/>';
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
			htmlStr = htmlStr + 
		 			'<li><a href="#order-pic-edit-page" onclick="sessionStorage.fileId='+fileId+'">'+fileTimeStamp+'</a></li>';
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
	 htmlStr = htmlStr + ' <img src="https://acerouteqa.appspot.com/mobi?loginref='+mtoken+'&action=getfile&file_id='+fileId+'&mtoken='+mtoken +'/>';
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
	 htmlStr = htmlStr + '<div data-role="fieldcontain" id="canvasDiv" style="width: 35%;">';
	 htmlStr = htmlStr + '</div>';
	 htmlStr = htmlStr + '<div class="ui-body ui-body-b">';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="button-pic-cancel-button" type="button" data-theme="a">Cancel</button></div>';
	 htmlStr = htmlStr + '		<div class="ui-block-c" style="width: 25%;"><button id="button-pic-save" type="button" data-theme="a" onclick="saveOrderSignature()">Save</button></div>';
	 htmlStr = htmlStr + '</div>';
	 
	 var orders_pic_edit_div = $('#order-signature-add-div');
	 //orders_list.empty();
	 //orders_list.html(htmlStr);
	 orders_pic_edit_div.html(htmlStr).trigger("create");//trigger("create"); //.trigger("refresh"); 
 }
 
 function saveOrderSignature(){
	 var orderId = sessionStorage.order_id;
	 var file_geocode = 1; 
 	 var file_type = 2; // for signature
	 var jpegImage = drawingApp.save();
	 var result = null;
     $.ajax(
         {
             url: "http://192.168.0.3:8080/AceRouteMobile/dataReceiverPost.jsp",
             type: 'post',
             data: {
            	mtoken: "aceroute.com|234001|7F000001013A6FD756D86C8E00F34A08",
             	action:	"savefile",
             	order_id: "229008",
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
 
 