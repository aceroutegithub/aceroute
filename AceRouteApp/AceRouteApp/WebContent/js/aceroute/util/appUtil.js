
Ext.AceRoute.util.AjaxUtil = 
	Ext.AceRoute.util.Util.extend({
		
		dataXml: undefined,

		setData: function(d){
			this.dataXml = d;
		},

		invokeUrlGetXml: function(url, mode){
			url = url + "&"+Math.random(); // so that no cache occures, as android was caching the results
		    if(typeof mode === "undefined"){
		    	mode = false;
		    }
			var arguments = {
				invokeFunc: this.setData,
				callerObject: this
	    	};
			this.xmlGet(url,
						this.responseHandler,
						arguments,
						mode);
			return this.dataXml;
		},
		
		invokeUrlAndGetAsText: function(url, mode){
			url = url + "&"+Math.random(); // so that no cache occures, as android was caching the results
		    if(typeof mode === "undefined"){
		    	mode = false;
		    }
			var arguments = {
				invokeFunc: this.setData,
				callerObject: this
	    	};
			this.xmlGet(url,
						this.responseHandlerText,
						arguments,
						mode);
			return this.dataXml;
		},

		xmlPost: function(url, toSend, responseHandler, mode, arguments)
		{
		   if( (mode === "undefined") || arguments.length < 4)
		   {
				  mode=true;
		   }
		   this.xmlOpen("POST", url, toSend, responseHandler, mode, arguments);
		},

		xmlGet: function (url, responseHandler, arguments, asyncMode)
		{
			this.xmlOpen("GET", url, null, responseHandler, asyncMode, arguments);
		},

		xmlOpen: function (method, url, toSend, responseHandler, mode, arguments)
		{
			if (window.XMLHttpRequest)
			{
			   // browser has native support for XMLHttpRequest object
				req = new XMLHttpRequest();
			}
			else if (window.ActiveXObject)
			{
			   // try XMLHTTP ActiveX (Internet Explorer) version
				req = new ActiveXObject("Microsoft.XMLHTTP") ;//("Msxml2.XMLHTTP"); //("Microsoft.XMLHTTP");
			}
			if(req)
			{

				req.arguments = arguments;
				req.onreadystatechange = responseHandler;
				req.open(method, url, mode);
				req.setRequestHeader("content-type","text/plain");
				req.send(toSend);
			}
			else
			{
				alert('Your browser does not seem to support XMLHttpRequest.');
			}
		},

		responseHandler: function ()
		{
			// Make sure the request is loaded (readyState = 4)
			if (req.readyState == 4)
			{
				// Make sure the status is "OK"
				if (req.status == 200)
				{
					var xmlDoc = req.responseXML;
					//arguments.callee.caller.apply();

					var funcToCall = req.arguments.invokeFunc;
					var callerObj = req.arguments.callerObject;
					var paramToPass = xmlDoc;

					funcToCall.apply(callerObj, [paramToPass]);
				}
				else
				{
					alert("There was a problem retrieving the XML data:\n" +req.statusText);
				}
			}
		},
		
		responseHandlerText: function ()
		{
			// Make sure the request is loaded (readyState = 4)
			if (req.readyState == 4)
			{
				// Make sure the status is "OK"
				if (req.status == 200)
				{
					var xmlDoc = req.responseText;
					//arguments.callee.caller.apply();

					var funcToCall = req.arguments.invokeFunc;
					var callerObj = req.arguments.callerObject;
					var paramToPass = xmlDoc;

					funcToCall.apply(callerObj, [paramToPass]);
				}
				else
				{
					alert("There was a problem retrieving the XML data:\n" +req.statusText);
				}
			}
		}
		
//		xmlPost: function(url, toSend, responseHandler, mode, arguments)
//		{
//		   if( (mode == undefined) || arguments.length < 4)
//		   {
//		          mode=true;
//		   }
//		   this.xmlOpen("POST", url, toSend, responseHandler, mode, arguments);
//		},
//		xmlGet: function(url, responseHandler, arguments, asyncMode)
//		{
//		    this.xmlOpen("GET", url, null, responseHandler, asyncMode, arguments);
//		},
//		xmlOpen: function(method, url, toSend, responseHandler, mode, arguments)
//		{
//		    if (window.XMLHttpRequest)
//		    {
//		       // browser has native support for XMLHttpRequest object
//		        req = new XMLHttpRequest();
//		    }
//		    else if (window.ActiveXObject)
//		    {
//		       // try XMLHTTP ActiveX (Internet Explorer) version
//		        req = new ActiveXObject("Microsoft.XMLHTTP") ;//("Msxml2.XMLHTTP"); //("Microsoft.XMLHTTP");
//		    }
//		    if(req)
//		    {
//		    	req.arguments = arguments;
//		        req.onreadystatechange = responseHandler;
//		        req.open(method, url, mode);
//		        req.setRequestHeader("content-type","text/html");
//		        req.send(toSend);
//		    }
//		    else
//		    {
//		        alert('Your browser does not seem to support XMLHttpRequest.');
//		    }
//		},
//		responseHandler: function()
//		{
//			//alert('someResponseHandler 1');
//			// Make sure the request is loaded (readyState = 4)
//		    if (req.readyState == 4)
//		    {
//		        // Make sure the status is "OK"
//		        if (req.status == 200)
//		        {
//		        	alert(req.responseText);																																																																																																																																																																																																																																																																																																																																																																																																																							
//		            var xmlDoc = req.responseText;
//		            //alert('someResponseHandler 2'+xmlDoc);
//					//arguments.callee.caller.apply();
// 
//					var funcToCall = req.arguments.invokeFunc;
//					var callerObj = req.arguments.callerObject;
//					var paramToPass = req.arguments.param;
//					if(typeof funcToCall != undefined){
//						funcToCall.apply(callerObj, [paramToPass]);
//					}
//		        }
//		        else
//		        {
//		            alert("There was a problem retrieving the XML data:\n" +req.statusText);
//		        }
//		    }
//		}
	}); 