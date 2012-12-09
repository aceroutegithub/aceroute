Ext.regModel('Proposal', {
    hasMany: {
        model: 'Speaker',
        name: 'speakers'
    },
    fields: ['id', 'title', 'url', 'description', 'day', 'time', 'end_time', 'pretty_time', 'date', 'topics', 'room', 'proposal_type']
});

Ext.regModel('Speaker', {
    hasMany: {
        model: 'Proposal',
        name: 'proposals'
    },
    fields: ['id', 'first_name', 'last_name', 'name', 'position', 'affiliation', 'bio', 'twitter', 'url', 'photo']
});

Ext.regModel('OfflineData', {
    fields: ['id', 'feedname', 'json'],
    proxy: {type: 'localstorage', id: 'oreillyproxy'}
});

Ext.regModel('Video', {
    fields: ['id', 'author', 'video']
});

Ext.regModel('Tweet', {
    fields: ['id', 'text', 'to_user_id', 'from_user', 'created_at', 'profile_image_url']
});

Ext.regModel('Contact', {
    fields: ['id']
});

Ext.regModel('ContactDetail1', {
    fields: ['id','name','email']
});
Ext.regModel('ContactDetail', {
	 fields: [
	          {name:'id'},{name:'name'},{name:'email'},
	          {name: 'fullName', type: 'string',
	              convert: function(v, rec) {
	                  return rec.data.name + " " + rec.data.email;
	              }
	          }
	 ],
	 
});

Ext.regModel('ContactDetail', {
	 fields: [
	          {name:'id'},{name:'name'},{name:'email'},
	          {name: 'fullName', type: 'string',
	              convert: function(v, rec) {
	                  return rec.data.name + " " + rec.data.email;
	              }
	          }
	 ],
	 
});

Ext.regModel('Customer', {
	 fields: [
	          {name:'cust_id'},
	          {name:'cust_name'},
	          {name:'cust_typeid'},
	          {name:'cust_since',type:'date',dateFormat:'Y/m/d G:i P'},
	          {name:'cust_owner'}
	 ],
});

Ext.regModel('CustomerContact', {
	 fields: [
	          {name:'contact_id'},
	          {name:'cust_id'},
	          {name:'contact_displayname'},
	          {name:'contact_firstname'},
	          {name:'contact_lastname'},
	          {name:'contact_phone'},
	          {name:'contact_email'}
	 ],
});

Ext.regModel('CustomerSite', {
	 fields: [
	          {name:'site_id'},
	          {name:'cust_id'},
	          {name:'site_name'},
	          {name:'site_addr'},
	          {name:'site_addr2'},
	          {name:'site_city'},
	          {name:'site_state'},
	          {name:'site_zip'},
	          {name:'site_ctry'},
	          {name:'site_geocode'}
	 ],
});

Ext.regModel('FileMetaData', {
	 fields: [
	          {name:'file_geocode'},
	          {name:'file_id'},
	          {name:'file_type'},
	          {name:'file_tstmp'},
	          {name:'order_id'},
	          {name:'subt_by'},
	          {name:'fileTimestampAndIndex',
	        	  convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var start_date = CommonUtil.convertToUTCFromTime(rec.data.file_tstmp);
	            	  //console.log(" start_date "+start_date);
	            	  var startDate = start_date; //rec.data.start_time;
	            	  var indexOfZero = startDate.indexOf("-00");
	            	  var startDateSub = startDate.substring(0,indexOfZero);
	            	  startDateSub = startDateSub+"GMT+0000";
	            	
	            	  var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	            	  var retStr = (startDateLocal.getMonth()+1) 
		  		    	+ "/" + startDateLocal.getDate() 
		  		    	+ "/" + startDateLocal.getFullYear() 
		  		    	+ " " +startDateLocal.getHours()
		  		    	+ ":" +startDateLocal.getMinutes(); 
	                  return retStr; //(startDateUtc).slice(0,10);
	              }
	          }
	 ],
});

Ext.regModel('OrderType', {
	 fields: [
	          {name:'ordertype_id'},
	          {name:'ordertype_name'}
	 ],
});

Ext.regModel('OrderResourceOld', {
	 fields: [
	          {name:'ordertres_id'},
	          {name:'order_id'},
	          {name:'res_id'},
	          {name:'res_name',  
	        	  convert: function(v, rec) {
	        		  var resStore = Ext.AceRoute.store.resourceStore;
	        		  var index = resStore.findExact('res_id',rec.data.res_id);
			    	  var dataMatch = resStore.getAt(index);
			    	  var resName = dataMatch.data.res_displayname; 
	                  return resName; 
	              }
	          },
	          {name:'start_time'},
	          {name:'end_time'},
	          {name:'subt_by'},
	          {name: 'start_dateWithoutTime', type: 'string',  
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var start_date = CommonUtil.convertToUTCFromTime(rec.data.start_time);
	            	  //console.log(" start_date "+start_date);
	            	  var startDate = start_date; //rec.data.start_time;
	            	  var indexOfZero = startDate.indexOf("-00");
	            	  var startDateSub = startDate.substring(0,indexOfZero);
	            	  startDateSub = startDateSub+"GMT+0000";
	            	
	            	  var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	            	  var retStr = (startDateLocal.getMonth()+1) 
		  		    	+ "/" + startDateLocal.getDate() 
		  		    	+ "/" + startDateLocal.getFullYear(); 
	                  return retStr; //(startDateUtc).slice(0,10);
	              }
	          }, 
	          {name: 'start_time_ampm', type: 'string',
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var start_date = CommonUtil.convertToUTCFromTime(rec.data.start_time);
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

	            	  var minutes = startDateLocal.getMinutes();
	                  return hours+":"+minutes+" "+(am ? "am" : "pm");
	              }
	          },
	          {name: 'end_dateWithoutTime', type: 'string',
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var end_date = CommonUtil.convertToUTCFromTime(rec.data.end_time);
	            	  var endDate = end_date; //rec.data.end_date;
	            	  var indexOfZero = endDate.indexOf("-00");
	            	  var endDateSub = endDate.substring(0,indexOfZero);
	            	  endDateSub = endDateSub+"GMT+0000";
	            	
	            	  var endDateLocal = new Date(endDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	            	  var retStr = (endDateLocal.getMonth()+1) 
		  		    	+ "/" + endDateLocal.getDate() 
		  		    	+ "/" + endDateLocal.getFullYear(); 
	                  return retStr; //(startDateUtc).slice(0,10);
	              }
	          }, 
	          {name: 'end_time_ampm', type: 'string',
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var end_date = CommonUtil.convertToUTCFromTime(rec.data.end_time);
	            	  var endDate = end_date; //rec.data.end_date;
	            	  var indexOfZero = endDate.indexOf("-00");
	            	  var endDateSub = endDate.substring(0,indexOfZero);
	            	  endDateSub = endDateSub+"GMT+0000";
	            	
	            	  var endDateLocal = new Date(endDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	            	 
	            	  //var myDate = new Date((rec.data.start_date).slice(0,16));
	            	  var hours = endDateLocal.getHours();
	            	  var am = true;
	            	  if (hours > 12) {
	            	      am = false;
	            	      hours = hours - 12;
	            	  } else if (hours == 12) {
	            	      am = false;
	            	  } else if (hours == 0) {
	            	      hours = 12;
	            	  }

	            	  var minutes = endDateLocal.getMinutes();
	                  return hours+":"+minutes+" "+(am ? "am" : "pm");
	              }
	          }
	 ],
});

Ext.regModel('OrderResource', {
	 fields: [
	          {name:'res_id'},
	          {name:'res_name',  
	        	  convert: function(v, rec) {
	        		  var resStore = Ext.AceRoute.store.resourceStore;
	        		  //console.log("resStore "+resStore);
	        		  //console.log(' rec.data.res_id '+rec.data.res_id);
	        		  var index = resStore.findExact('res_id',rec.data.res_id);
			    	  var dataMatch = resStore.getAt(index);
			    	  var resName;
			    	  if(typeof dataMatch !== "undefined" && 
			    			  typeof dataMatch.data !== "undefined"){
			    		  resName = dataMatch.data.res_displayname;
			    	  }
	                  return resName; 
	              }
	          }
	 ],
});

Ext.regModel('PartType', {
	 fields: [
	          {name:'part_id'},
	          {name:'part_num'},
	          {name:'part_name'},
	          {name:'part_uprice'},
	          {name:'part_unit'},
	          {name:'partNameAndNum',  
	        	  convert: function(v, rec) {
	        		  return rec.data.part_name + "-" + rec.data.part_num;
	              }
	          }
	 ],
});

Ext.regModel('Resource', {
	 fields: [
	          {name:'res_id'},
	          {name:'res_type'},
	          {name:'res_first'},
	          {name:'res_last'},
	          {name:'res_displayname'},
	          {name:'res_num'},
	          {name:'res_email'},
	          {name:'res_phone'},
	          {name:'res_providerid'},
	          {name:'res_sms'}
	 ],
});

Ext.regModel('TaskType', {
	 fields: [
	          {name:'task_id'},
	          {name:'task_name'},
	          {name:'task_uprice'},
	          {name:'task_unit'}
	 ],
});

Ext.regModel('Task', {
	 fields: [
      {name:'ordertask_id'},
      {name:'order_id'},
      {name:'task_id'},
      {name:'ordertask_hrs'},
      {name:'ordertask_typeid'},
      {name:'task_name_hrs', type: 'string',
          convert: function(v, rec) {
        	  var taskId = rec.data.task_id;
        	  var index = Ext.AceRoute.store.taskTypeStore.findExact('task_id',taskId);
      	  	  var dataMatch = Ext.AceRoute.store.taskTypeStore.getAt(index);
      	  	  var data = null;
      	  	  var taskName = null;
      	  	  if(typeof dataMatch !== 'undefined'){
      	  		  data = dataMatch.data;
      	  		  taskName = data.task_name+" , Hrs:"+rec.data.ordertask_hrs;
      	  	  }
              return taskName;
          }
      },
	 ],
});

Ext.regModel('Part', {
	 fields: [
     {name:'orderpart_id'},
     {name:'order_id'},
     {name:'part_id'},
     {name:'orderpart_qty'},
     {name:'orderpart_typeid'},
     {name:'part_name', type: 'string',
         convert: function(v, rec) {
       	  var partId = rec.data.part_id;
       	  var index = Ext.AceRoute.store.partTypeStore.findExact('part_id',partId);
     	  	  var dataMatch = Ext.AceRoute.store.partTypeStore.getAt(index);
     	  	  var data = null;
     	  	  var partName = null;
     	  	  if(typeof dataMatch !== 'undefined'){
     	  		  data = dataMatch.data;
     	  		partName = data.part_name;
     	  	  }
             return partName;
         }
     },
     {name:'part_num', type: 'string',
         convert: function(v, rec) {
       	  var partId = rec.data.part_id;
       	  var index = Ext.AceRoute.store.partTypeStore.findExact('part_id',partId);
     	  	  var dataMatch = Ext.AceRoute.store.partTypeStore.getAt(index);
     	  	  var data = null;
     	  	  var partNum = null;
     	  	  if(typeof dataMatch !== 'undefined'){
     	  		  data = dataMatch.data;
     	  		partNum = data.part_num;
     	  	  }
             return partNum;
         }
     },
	 ],
});

Ext.regModel('Order', {
	 fields: [
	          {name:'id'},
	          {name:'start_date'},
	          {name:'end_date'},
	          {name:'cust_id'},
	          {name:'cust_siteid'},
	          {name:'custName', type:'string',
	        	  convert: function (v, rec){
	        		var custStore = Ext.AceRoute.store.custStore;
      				var custId = rec.data.cust_id;
      				var index = custStore.findExact('cust_id',custId);
      			  	var dataMatch = custStore.getAt(index);
      		        var d = dataMatch.data;
      		        //console.log(' Order Priority '+d.priorityType);
      		        return d.cust_name; 
	        	  }
	          },
        	  {name:'cust_contactid'},
        	  {name:'order_po'},
        	  {name:'order_name'},
        	  {name:'order_typeid'},
        	  {name:'orderTypeName', type:'string',
        		  convert: function (v, rec){
        			  var orderTypeName = '';
        			  var orderTypeStore = Ext.AceRoute.store.orderTypeStore;
	        		  if(typeof rec !== 'undefined' && typeof rec.data !== 'undefined'){
	        				var orderTypeId = rec.data.order_typeid;
	        				console.log(' orderTypeId '+orderTypeId);
	        				var index = orderTypeStore.findExact('ordertype_id',orderTypeId);
	        				console.log(' index '+index);
	        			  	var dataMatch = orderTypeStore.getAt(index);
	        			  	console.log(' dataMatch '+dataMatch);
	        			  	if(typeof dataMatch !== 'undefined'){
		        		        var d = dataMatch.data;
		        		        //console.log(' Order Priority '+d.priorityType);
		        		        orderTypeName = d.ordertype_name;
	        			  	}
	        			}
        		        return orderTypeName; 
        		  }
        	  },
        	  {name:'order_prtid'},
        	  {name:'orderPriorityName', type:'string',
        		  convert: function (v, rec){
        				var priorityStore = Ext.AceRoute.store.priorityStore;
        				var orderPrtId = rec.data.order_prtid;
        				var index = priorityStore.findExact('priority_id',orderPrtId);
        			  	var dataMatch = priorityStore.getAt(index);
        		        var d = dataMatch.data;
        		        //console.log(' Order Priority '+d.priorityType);
        		        return d.priorityType; 
        		  }
        	  },
        	  {name:'order_inst'},
        	  {name:'order_wkfid'},
        	  {name:'order_flg'},
    		  {name:'order_recid'},
    		  {name:'res_id'},
    		  {name:'res_addid'}, 
    		  {name:'order_startwin'}, 
    		  {name:'order_endwin'},
    		  {name:'orderForList', type: 'string',
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var startDate = rec.data.start_date;
	            	  var indexOfZero = startDate.indexOf("-00");
	            	  var startDateSub = startDate.substring(0,indexOfZero);
	            	  startDateSub = startDateSub+"GMT+0000";
	            	
	            	  var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	            	  var retStr = (startDateLocal.getMonth()+1) 
		  		    	+ "/" + startDateLocal.getDate() 
		  		    	+ "/" + startDateLocal.getFullYear();
	            	  
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

	            	  var minutes = startDateLocal.getMinutes();
	            	  retStr = retStr + " "+ hours+":"+minutes+" "+(am ? "am" : "pm");
	            	  
	                  return rec.data.order_name + " "+ retStr;
	              }
	          },
	          {name: 'start_dateWithoutTime', type: 'string',
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var startDate = rec.data.start_date;
	            	  var indexOfZero = startDate.indexOf("-00");
	            	  var startDateSub = startDate.substring(0,indexOfZero);
	            	  startDateSub = startDateSub+"GMT+0000";
	            	
	            	  var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	            	  var retStr = (startDateLocal.getMonth()+1) 
		  		    	+ "/" + startDateLocal.getDate() 
		  		    	+ "/" + startDateLocal.getFullYear(); 
	                  return retStr; //(startDateUtc).slice(0,10);
	              }
	          }, 
	          {name: 'start_time', type: 'string',
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var startDate = rec.data.start_date;
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

	            	  var minutes = startDateLocal.getMinutes();
	                  return hours+":"+minutes+" "+(am ? "am" : "pm");
	              }
	          },
	          {name: 'start_time_millisec',
	              convert: function(v, rec) {
	            	  //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	            	  var startDate = rec.data.start_date;
	            	  var indexOfZero = startDate.indexOf("-00");
	            	  var startDateSub = startDate.substring(0,indexOfZero);
	            	  startDateSub = startDateSub+"GMT+0000";
	            	  var startDateLocal = new Date(startDateSub); //commonUtil.convertUTCToLocalDate(rec.data.start_date);
	            	  //console.log(" startDateLocal.getTime() orderResId"+startDateLocal.getTime());
	            	  return startDateLocal.getTime();
	              }
	          },
	          {name: 'duration', type: 'string',
	              convert: function(v, rec) {
	            	  var startDate = new Date(rec.data.start_date.slice(0,16));
	            	  var endDate = new Date(rec.data.end_date.slice(0,16));
	            	  var diffSecs = (endDate - startDate)/1000;
	            	  
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
	          },
	          {name: 'end_dateWithoutTime', type: 'string',
	              convert: function(v, rec) {
	                  return (rec.data.end_date).slice(0,10);
	              }
	          },
	          {name: 'jobsGroupId', type: 'integer',
	              convert: function(v, rec) {
	                  return (rec.data.res_id != 0) ? 1 : 0;
	              }
	          },
	          {name: 'jobsGroupName', type: 'string',
	              convert: function(v, rec) {
	            	  var jobCategory = 'Jobs Assigned to Others';
	            	  
	            	  if(typeof rec.data.res_id !== "undefined" && 
	            			  rec.data.res_addid !== '' && 
	            			  rec.data.res_id !== Ext.AceRoute.resId){
	            		  
		            	  if(typeof rec.data.res_addid !== 'undefined' && rec.data.res_addid !== ''){
		            		  var resIdMatched;
			            	  var additionResources = rec.data.res_addid.split( "|" );
			      			  for(i = 0;i < additionResources.length;i++){
			      				if(parseInt(additionResources[i]) == Ext.AceRoute.resId){
			      					resIdMatched = Ext.AceRoute.resId;
			      					break;
			      				}
			      			  }
			      			  if(typeof resIdMatched !== 'undefined' && resIdMatched !== ''){
			      				if(parseInt(resIdMatched) == Ext.AceRoute.resId){
				            		  jobCategory = 'Jobs Assigned to Me';
				            		  //console.log(' My Jobs id '+rec.data.id +' res_id '+rec.data.res_id);
				            	  }else if (parseInt(resIdMatched) != 0 && 
				            			  parseInt(resIdMatched) !== Ext.AceRoute.resId) {
				            		  jobCategory = 'Jobs Assigned to Others';
				            	  }else{
				            		  jobCategory = 'Unassigned Jobs';
				            		  //console.log(' Unassigned Jobs id '+rec.data.id +' res_id '+rec.data.res_id);
				            	  }
			      			  }
		            	  }
	            	  }else{
		            	  if(typeof rec.data.res_id !== "undefined" && parseInt(rec.data.res_id) == Ext.AceRoute.resId){
		            		  jobCategory = 'Jobs Assigned to Me';
		            		  //console.log(' My Jobs id '+rec.data.id +' res_id '+rec.data.res_id);
		            	  }else if (typeof rec.data.res_id !== "undefined" && 
		            			  parseInt(rec.data.res_id) != 0 && 
		            			  rec.data.res_id !== Ext.AceRoute.resId) {
		            		  jobCategory = 'Jobs Assigned to Others';
		            	  }else{
		            		  jobCategory = 'Unassigned Jobs';
		            		  //console.log(' Unassigned Jobs id '+rec.data.id +' res_id '+rec.data.res_id);
		            	  }
	            	  }
	                  return jobCategory;
	              }
	          },
	          {name:'site_addr'},
	          {name:'site_geocode'}
	 ],
}); 

Ext.regModel('Contact', {
	fields: ['firstName', 'lastName']
});

Ext.regModel('AccordianLayout', {
    fields: [
        {name: 'text',        type: 'string'},
        {name: 'source',      type: 'string'},
        {name: 'preventHide', type: 'boolean'},
        {name: 'cardSwitchAnimation'},
        {name: 'card'}
    ]
});