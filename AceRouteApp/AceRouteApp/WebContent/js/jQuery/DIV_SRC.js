// DIV_SRC.js
// Copyright Trevor Turton 2008, http://www.turton.co.za
// Version 1.4, 2008-11-04
// This program scans a document's DOM, either in part or on whole, looking for <div src="URL"> and similar tags.
// For each one found, it uses AJAX to fetch the content referenced and injects it into the <div>.
// The source page may be in:
// - HTML or XHTML format, in which case fecthed content is assigned to the <div>.innerHTML
// Depending on the invocation options, this program may recursively scan the content that it injects
// for included <div src="URL"> tags, and resolve them similarly.

/** DIV_SRC is packaged as a single JavaScript object to minimise intrusion into the caller's name space. */
var DIV_SRC = {
	/** resolve scans a DOM from a nominated target node for <div src="URL"> nodes and injects the indicated source into each.
	 * options is an optional argument, a JavaScript object that may specify various options:
	 * - target is the DOM node to be scanned; it may be in a different window if its page comes from thE same domain;
	 *   alternatively it can be a string containing the name of an ID within the docuemnt.
	 *   if target is not supplied then the curent document.body is taken as the target.
	 * - depth is a positive integer specifying how deeply this method should recursively resolve <div src="URL"> nodes;
	 *   the default is 5; this parameter helps to limit damage done by circular references,
	 *   e.g. <div src="a.html"> includes <div src="b.html"> includes <div src="a.html"> ... The code does track imbeds
	 *   and try to detect and avoid loops, but won't detect loops if the query portion of the URI varies.
	 * - debug, if true, results in the setting of a colored border on each <div> that has content injected into it.
	 * - dropSRC causes src="URI" attributes to be dropped after they hsve been enacted, to help generate legal HTML for debug
	 * - loadMsg is an optional string of HTML to be displayed in DIV_SRC sections while they are loading
	 * - onerror is an optional function passed by the user to receive control when errors occur
	 * - tags is an optional vector of strings that identify the tag types to be processed; this defaults to tags : ["div"]
	 *   Other tag types may be specified, e.g. tags : ["div","span"] would process <span src="..."> as well as <div>
	 * - lang is the two character ISO code for the language to publish messages in
	 * - noAJAX is a message to publish if the browser doesn't support AJAX; or if true, resolve() exits silently.
	 * - strip removes HTML comments, <html>, <head> through </head>, <body>, </body> and </html> tags from fetched subfiles;
	 *   this makes it possible to have bimodal subfiles that can be viewed as pages in thei rown right, or imbedded into a base page.
	 * [still to come:]
	 *   Tag type may be qualified by an attribute.value as well, e.g. tags : ["div.class.a"] would process all <div class="a" src="...">,
	 *   and tags : ["div.id.x"] would process all <div id="x" src="...">.
	 *   If we record tags : ["div"] as tags = {"div" : true}
	 *   then tags : "div.class.a" could be tags = {"div" : {"class" : {"a" : true}}}
	 */
	resolve: function(options) {
		if (options.noAJAX == true)  // if the user passed noAJAX: true
			return 1;  // quit resolve() silently with return code = 1 (error)
		try {
			var lang = DIV_SRC.lang[options.lang ? options.lang : "en"];  // set message language, default to "en"
			if (lang == null)
				throw "language code \"" + options.lang + "\" not recognised!";
			if (window.location.protocol.search(/http/) < 0)  // if the parent window has not been opened via http[s],
				throw lang[1] + window.location.protocol + "//";
			options = options ? options : {};  // if no options are passed, make it an empty object
			var target = options.target ? options.target : document.body;  // the scan target DOM node
			if (typeof target == "string") {  // if target is a String,
				var idTarget = document.getElementById(target);  // assume it's a node ID.
				if (idTarget == null)  // if the ID isn't found, complain.
					throw lang[2] + target + lang[3];
				target = idTarget;
			}
			var depth  = options.depth ? options.depth : 5;  // the maximum depth to which we recursively inject content
			var tags = {};  // a collection of the tags that we must look for and process
			if (options.tags) {  // if the caller has specified target tags,
				if (options.tags.constructor != Array)
					throw lang[4] + options.tags;
				if (options.tags.length == 0)  // if tags is a zero-length array, (this is a debug option)
					return 0;  // there's nothing to do, quit normally.
				for (var i = 0; i < options.tags.length; i++)  // for each tag given,
					tags[options.tags[i].toLowerCase()] = true;  // record it in our tags object.
			} else  // else options.tags not specified,
				tags["div"] = true;  // set the default, <div src="..."> only.
			var onerror = options.onerror ? options.onerror : error;  // use the default error routine unless caller passed one
			// if caller has passed a loading message, use it; if it's true, use default message; else false:
			var loadMsg = options.loadMsg ? (options.loadMsg == true ? lang[6] : options.loadMsg) : false;
			var loadStart = 0, loadEnd = 0;  // count the number of page segment loads started and completed
			processNode(target, 1);  // scan for selected tags and inject the referenced content; level starts at 1
		} catch (err) {
			if (err)  // if we got a non-null error message, display it to the user.
				alert("DIV_SRC: " + err);
			return 1;  // signal abnormal execution
		}
		return 0;  // exit with normal return code
		
		/** process the nominated DOM node and its children and siblings.
		 * - node is the DOM node that we must scan
		 * - level is the number of recursions that we have reached
		 */
		function traverse(node, level) {
			processNode(node, level);  // process this node (and its children)
			seeSibling(node, level);  // process this node's siblings (and their children)
		}  // end traverse
		/** process the nominated DOM node and its children.
		 * - node is the DOM node that we must scan
		 * - level is the number of recursions that we have reached
		 */
		function processNode(node, level) {
           	if (node.nodeType == 1) {  // if the node is an element, inspect it
				if (tags[node.nodeName.toLowerCase()]) {  // if this node is one of the selected tag types,
					var uri = node.getAttribute("src");  // try to get its src="uri" attribute,
					if (uri) {  // if we find it,
						for (var parent = node.parentNode; node != target; parent = parent.parentNode) {  // ascend the node's parent chain
							if (parent.getAttribute("src") == uri) {  // if a parent node has a src attribute and it's the same as the current uri,
								onerror(node, uri, lang[5]);  // report the error
								return;  // don't  inject the duplicate content into this node.
							}
							if (parent == target)  // if we have got back to the node from which we started processing,
								break;  // we are done, exit the loop.
						}  // end for
						inject(node, level, uri);  // fetch and inject the referenced content.
					}
				}
			}
			seeChild(node, level);  // visit this node's children
		}
		/** visit the nominated DOM node's child, if any.
		 * - node is the DOM node that we must scan
		 * - level is the number of recursions that we have reached
		 */
		function seeChild(node, level) {
			if (node.nodeType != 3 && node.nodeType != 8 && node.firstChild)  // if the node is not text or comment and it has a child,
				traverse(node.firstChild, level);  // process the node's first child
		}
		/** visit the nominated DOM node's sibling, if any.
		 * - node is the DOM node that we must scan
		 * - level is the number of recursions that we have reached
		 */
		function seeSibling(node, level) {
			if (node.nextSibling)  // if the node has a sibling,
				traverse(node.nextSibling, level);  // traverse the next sibling.
		}
		/** inject fetches the source referenced by a <div> node using AJAX, and injects it into the <div>.
		 * - node is the DOM node that we must inject into
		 * - level tells us how deeply we have recursed
		 * - uri is the source file to fetch
		 */
		function inject(node, level, uri) {
			if (uri == "#") {  // # URI denotes no content
				node.innerHTML = "";  // clear the current content
				return;  // (this helps to buld dual-mode HTML that can render with or without AJAX)
			}
			var url = (uri.indexOf("://") > 0 ? uri  // if the URI specifies a protocol and domain, use it as url
				: (uri.charAt(0) == "/" ?  // else if the URI starts with a slash,
						window.location.protocol + "//" + window.location.hostname + uri
					: // else uri is relative to the current location
					window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1) + uri));
			if (loadMsg)  // if the caller has nominated a loading message [v2.4],
				node.innerHTML = loadMsg.replace(/@/, uri);  // set the message displayed while loading remote content
			if (options.debug > 0) {  // if we're in debug mode,
				var colors = ["red", "lime", "olive", "maroon", "green", "yellow", "teal", "navy", "blue", "acqua", "fuchsia", "purple", "gray", "black"];
				node.style.border = "thin solid " + colors[level % colors.length];  // set a colored border
				node.style.margin = "2px"  // set a small margin
				node.title = '<' + node.nodeName + ' src="' + uri + '">';  // set a tool tip
			}  // end debug
			loadStart++;  // increment the count of page segment loads started
			// use AJAX to request the nominated content from the web server
			var request =  new XMLHttpRequest();  // create a web server request
			if (request == false) {  // if it's our pseudo-XMLHttpRequest then we can't find AJAX, (see Provide at the end of this file)
				if (options.noAJAX) {  // if the caller has passed us a noAJAX message,
					if (options.noAJAX.length > 0); // if the message has some characters,
						document.writeln(options.noAJAX); // publish the message in the page (deleting all other content!)
					throw null;  // quit resolve() silently
				} else
					throw lang[0];  // show the user an error message and quit resolve()
			}
			request.open("GET", url, true);  // open an aynchronous web server request
			request.onreadystatechange = function() {  // inline function handles state changes; use this.X rather than request.X
				if (this.readyState == 4) {  // if the request has been processed completely,
					if (this.status == 200 || this.status == 304) {  // if the page has been fetched OK, or our local copy is still good,
						if (this.responseText) {  // if we have got some response text,
							var txt = options.strip ? DIV_SRC.strip(this.responseText) : this.responseText;  // strip page wrapper tags if asked to
							if (options.debug > 1)  // if the caller wants deep debug, grab and display the HTTP response headers.
								txt += '<pre style="color: grey; border: thin solid grey; margin: 1px; padding: 2px 6px;">'
									+ '<b><font size="+1">debug:2, HTTP headers</font></b><br>'
									+ 'GET ' + url + '\r\n'
									+ this.getAllResponseHeaders() + '<b>Status: ' + this.status + ' = ' + this.statusText 
									+ ', load count: ' + loadStart + ', level: ' + level + '/' + depth + '</b></pre>';
							node.innerHTML = txt;  // populate the node's innerHTML with the response text
						if (options.dropSRC)  // if the caller wants us to drop src="URI" attributes after enacting them,
								node.removeAttribute("src");  // then do so.
							if (level < depth)  // providng we have not delved too deeply,
								seeChild(node, level+1);  // scan below the injected HTML looking for injectables.
						} else  // else no responseText returned,
							onerror(node, uri, "No responseText returned from the web server");  // populate the node's innerHTML with an error message
					} else  // this.status != 200 || 304; publish error
						onerror(node, uri, "Error: <b>" + this.status + "</b>");
				}  // end if (this.readyState == 4)
			};  // end the inline function definition
			request.send(null);  // trigger the request to the web server
		}  // end inject
		/** default error method; publish and highlight an error message.
		 * -node is the node whose content we failed to load
		 * -uri point to the file we were supposed to load
		 * -text is the error message
		 */
		function error(node, uri, text) {
			node.innerHTML = "<blink>" + text + " for uri: " + uri + "</blink>";  // populate the node's innerHTML with an error message
			node.style.border="ridge red";  // highlight the failing node
		}
	},  // end resolve
	/** strip out HTML comments and body wrapper tags from some HTML.
	 * text is the HTML string to strip
	 */
	strip: function(text) {
		for (var i = text.indexOf("<!--"); i >= 0; i = text.indexOf("<!--", i)) {  // scan for the start of an HTML comment
			var j = text.indexOf("-->", i + 4);  // look for the end of the comment
			if (j == -1)  // if we don't find an end to the comment, HTML error!
				j = text.length - 3;  // take the rest of the HTML as comment.
			text = text.substr(0, i) + text.substr(j + 3);  // delete the comment
		}  // for (var i)
		text = text.replace(/\s*<\!\s*DOCTYPE [^<]*>/i, ""  // strip out leading <!doctype ...>
				).replace(/^\s*<\s*HTML[^>]*>(.+)<\s*\/HTML\s*>\s*$/i, "$1"  // strip out <html ...> & </html> tags
				).replace(/^\s*<\s*HEAD\s*>.+<\s*\/HEAD\s*>/i, ""  // strip out <head> thru </head>
				).replace(/^\s*<\s*BODY[^>]*>(.+)<\s*\/BODY\s*>\s*$/i, "$1");  // strip out <body ...> & </body> tags
		return text;
	},  // end strip
	/** define messages in various languages */
	lang: {	en:	["Sorry, your browser does not support AJAX - it cannot render this page.",  // [0]
				"only works with files delivered from a web server; this comes from ",  // [1]
				"target is a string (\"",  // [2]
				"\") but no ID by that name was found.",  // [3]
				"the tags parameter isn't an array, it's ",  // [4]
				"Circular reference ignored",  // [5]
				'<font color="grey"><blink><i>Loading @ ...</i></blink></font>'  // [6]
				]  // to add another language, write a comma after the ] then copy the en:[...] section after this line and change
		  }
};  // end the DIV_SRC object definition.
/** Provide the XMLHttpRequest function for IE versions 5.x-6.x 
 * See http://en.wikipedia.org/wiki/XMLHttpRequest for discussion
 * This function definition appears in-line so that it will be executed once only by each page that imbeds this file.
 */
if (typeof XMLHttpRequest == "undefined") {  // if the XMLHttpRequest function is undefined, try to define it now.
	XMLHttpRequest = function() {  // look for ActiveX implementations of AJAX, most recent first.      
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP") }     catch(e) {}
		try { return new ActiveXObject("Microsoft.XMLHTTP") }  catch(e) {}
		return false;  // failing all of the above, return false
	}
};  // end of Provide ...
