
String.prototype.trim = function(){
	return this.replace(/^\s*/, "").replace(/\s*$/, "");
};

String.prototype.formatAddress = function(token){
	  var finalString='';
	  if(typeof this !== "undefined"){
		  var currentTagTokens = this.split(token);
		  if(currentTagTokens.length >= 4){
			  finalString = finalString + currentTagTokens[0];
		      finalString = finalString + "<br/>"+ currentTagTokens[1]+
		  				" "+ currentTagTokens[2]+
		  				" "+ currentTagTokens[3];
		  } 
	  }
	  return finalString; 
};

String.prototype.replaceAll = function(replace, with_this) {
	  var str = this.replace(new RegExp(replace, 'g'), with_this);
	  return str;
};

function CommonUtil(){
	
}

CommonUtil.convertToUTC = function(date){
		    var dt = new Date(date);   
		   
		    var dtMonth = dt.getUTCMonth()+1;
		    dtMonth = dtMonth + ""; if(dtMonth.length == 1) dtMonth = "0" + dtMonth;
		    var dtDay = dt.getUTCDate();
		    dtDay = dtDay + ""; if(dtDay.length == 1) dtDay = "0" + dtDay;

		    var minUTC = dt.getUTCMinutes();
		    minUTC = minUTC + "";
		    if(minUTC.length == 1) minUTC = "0" + minUTC;       
		    var dtGMT = dt.getUTCFullYear() + "/" + dtMonth + "/" + dtDay + " " + dt.getUTCHours()  + ":" + minUTC;
		    dtGMT = dtGMT + " -00:00";       
		   
		    return dtGMT;   
		};
		
CommonUtil.convertToUTCDateStr = function(date){
		    var dt = new Date(date);   
		   
		    var dtMonth = dt.getUTCMonth()+1;
		    dtMonth = dtMonth + ""; if(dtMonth.length == 1) dtMonth = "0" + dtMonth;
		    var dtDay = dt.getUTCDate();
		    console.log(' dtDay '+dtDay);
		    dtDay = dtDay + ""; if(dtDay.length == 1) dtDay = "0" + dtDay;
		    console.log(' dtDay '+dtDay);
		    
		    var minUTC = dt.getUTCMinutes();
		    minUTC = minUTC + "";
		    if(minUTC.length == 1) minUTC = "0" + minUTC;       
		    var dtGMT = dt.getUTCFullYear() + "/" + dtMonth + "/" + dtDay;
		    dtGMT = dtGMT;       
		   
		    return dtGMT;   
		};
		
	CommonUtil.convertToUTCFromTime = function(timeStr){  
		var dt = new Date(timeStr);   
	    var dtMonth = dt.getUTCMonth()+1;
	    dtMonth = dtMonth + ""; if(dtMonth.length == 1) dtMonth = "0" + dtMonth;
	    var dtDay = dt.getUTCDate();
	    dtDay = dtDay + ""; if(dtDay.length == 1) dtDay = "0" + dtDay;

	    var minUTC = dt.getUTCMinutes();
	    minUTC = minUTC + "";
	    if(minUTC.length == 1) minUTC = "0" + minUTC;       
	    var dtGMT = dt.getUTCFullYear() + "/" + dtMonth + "/" + dtDay + " " + dt.getUTCHours()  + ":" + minUTC;
	    dtGMT = dtGMT + " -00:00";       
	    
	    return dtGMT;   
	};
		
	CommonUtil.convertToUTCFromStartAndEndDate = function(date, time){
		 
     	var timeIndexOfColumn = time.indexOf(":");
     	var timeHour = time.slice(0,timeIndexOfColumn);
     	var timeMinute;
     	var indexOfAmPm;
     	var timeInMilliSec;
     	
     	if((time.indexOf("am") > 0) || (time.indexOf("pm") > 0)){
     		if(time.indexOf("am") > 0){
     			indexOfAmPm = time.indexOf("am");
     			timeMinute = time.slice(timeIndexOfColumn+1, (indexOfAmPm-1));
     		}
     		if(time.indexOf("pm") > 0){
     			indexOfAmPm = time.indexOf("pm");
     			timeHour = parseInt(timeHour) + 12; 
     			timeMinute = time.slice(timeIndexOfColumn+1, (indexOfAmPm-1));
     		}
     	}
     	if(typeof timeHour !== "undefined"){
     		timeInMilliSec = ((parseInt(timeHour))*60 + parseInt(timeMinute))*60*1000;
     	}
     	var dateTemp = new Date((new Date(date)).getTime() + timeInMilliSec ); 
     	var dateUtc = this.convertToUTC(dateTemp);
     	
     	var indexOfZero = dateUtc.indexOf("-00");
    	var dateSub = dateUtc.substring(0,indexOfZero);
    	dateSub = dateSub+"GMT+0000";
    	
    	return dateSub;
	};
	   
	CommonUtil.convertUTCToLocalDate = function(gmtDate){
		var originalDate = new Date(gmtDate);
	    var retStr = (originalDate.getMonth()+1) 
	    	+ "/" + originalDate.getDate() 
	    	+ "/" + originalDate.getFullYear() 
	    	+ " " + originalDate.getHours() 
	    	+ ":" + originalDate.getMinutes();
	    var localDate = new Date(retStr);
	    return localDate;
	};
	
	CommonUtil.getIconColor = function(current_date, start_date, end_date, order_wkfid){
		var iconClr;
		
		if(order_wkfid == "5"){
			  iconClr = "FFE466";
		  } else if(order_wkfid == "4"){
			  iconClr = "3489C6";
		  } else if(order_wkfid == "7"){
			  iconClr = "CD853F";
		  } else if(
				  ((order_wkfid != "3" || order_wkfid != "4") && 
				  	start_date <= current_date)
				  || 
				  (order_wkfid != "4" && 
					current_date > end_date)
			  ){
			  iconClr = "FB9891";
		  } 
		  else
			  iconClr = "8CCB80";
		return iconClr;
	};
	
	
