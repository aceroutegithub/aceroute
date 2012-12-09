function XmlUtil(){
	
} 

XmlUtil.createXmlDocument = function(str){
   var doc;
   if (window.DOMParser){
	     doc = new DOMParser().parseFromString(str, "text/xml");
   }else // Internet Explorer
	   {
	   doc=new ActiveXObject("Microsoft.XMLDOM");
	   doc.async=false;
	   doc.loadXML(text); 
	}
   return doc;
}

XmlUtil.appendNode = function (doc, str){
	var doc2 = new DOMParser().parseFromString(str, "text/xml");
	var node = doc.importNode(doc2.documentElement, true);
    doc.documentElement.appendChild(node);
    
    return doc;
}

XmlUtil.appendDocNodes = function (doc, doc2){
	var node = doc.importNode(doc2.documentElement, false);
    doc.documentElement.appendChild(node);
    
    return doc;
}

XmlUtil.serializeToString  = function(doc){
	var stringFormat = new XMLSerializer().serializeToString(doc);
	return stringFormat;
}
