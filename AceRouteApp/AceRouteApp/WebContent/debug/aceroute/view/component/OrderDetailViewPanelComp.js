
Ext.AceRoute.view.OrderDetail = Ext.extend(Ext.Panel, {
    scroll: 'vertical',
    layout: {
        type: 'auto',
        align: 'stretch'
    },
    defaults: {
        border: false,
        style: 'border-width: 400px'
    },
    showSpeakerData: true,
    cls: 'session-detail',
    tasksStore: null,
    partsStore: null,
    dropDownOptionToOpen: 'part',
      
    initComponent: function(){
 	
        this.dockedItems = [{
            xtype: 'toolbar',
            id:'toolbarId',
            scroll: 'horizontal',  
//            defaults : {
//                flex : 1
//            },
            items:[
				  {
					    ui: 'back',
					    text: 'Back',
					    scope: this,
					    handler: function(){
					    	var orderListXmlPanel = Ext.getCmp('orderListXmlId');
					    	
//					        this.ownerCt.setActiveItem(
					    	orderListXmlPanel.setActiveItem( this.prevCard, {
					            type: 'slide',
					            reverse: true,
					            scope: this,
					            after: function(){
					                this.destroy();
					            }
					        });
					    }
				   },
                   {
	        		    xtype: 'selectfield',
	                    name: 'orderAddUpdateOptionId',
	                    height: 27,
//	                    layout: {
//	                        type: 'auto',
//	                        align: 'left'
//	                    },
	                    store: Ext.AceRoute.store.orderAddUpdateOptionsStore,
	                    displayField : 'orderAddUpdateOptionName',
	                    valueField : 'orderAddUpdateOptionId',
	                    listeners: { 
		                    change: { 
		                     	fn: function(src, value){
		                     		this.dropDownOptionToOpen = value;
		                     	},
		                     	scope: this 
		                     }
	                    }
	               },{
	                  //text: 'Go',
	                  iconCls: 'action',
	                  height: 10,
	                  iconMask: true, 
	                  stretch: false,
	                  scope: this,
	                  handler: function(){
//	                	  if(this.dropDownOptionToOpen == 'picture'){
//	                		var popup = this.createCameraPanel(this.viewData);
//	                   		popup.show();
//	                      }
	                	  if(this.dropDownOptionToOpen == 'image'){
                   			var popup = this.createImagesPanel(this.viewData);
                   			popup.show();
                   		  }if(this.dropDownOptionToOpen == 'note'){
                   			var popup = this.createNotesPanel(this.viewData);
  	                	    popup.show();
                   		  }if(this.dropDownOptionToOpen == 'part'){
                 			var popup = this.createPartsPanel(this.viewData);
  	                	    popup.show();
                   		  }if(this.dropDownOptionToOpen == 'signature'){
                 			var popup = this.createSignaturePanel(this.viewData);
  	                	    popup.show();
                   		  }if(this.dropDownOptionToOpen == 'task'){
                 			var popup = this.createTasksPanel(this.viewData);
  	                	    popup.show();
                   		  }if(this.dropDownOptionToOpen == 'team'){
                 			var popup = this.createResourcesPanel(this.viewData);
  	                	    popup.show();
                   		  }
	                	  
	                  }
	                }
              ]
        }];
        this.listeners = {
            activate: { 
            	fn: function(){
            	if (this.speakerList) {
                    this.speakerList.getSelectionModel().deselectAll();
                }
                
            }, scope: this }
        };
        Ext.AceRoute.view.OrderDetail.superclass.initComponent.call(this);
    },
    
    showNextButtons: function(event){
    	var scroller = Ext.getCmp('toolbarId').scroller;
    	var offsets = scroller.getOffset();
        
        scroller.scrollTo({
            x: offsets.x + 150,
            y: offsets.y
        }, true);
    },
    showPreviousButtons: function(event){
    	var scroller = Ext.getCmp('toolbarId').scroller;
    	var offsets = scroller.getOffset();
        
        scroller.scrollTo({
            x: offsets.x - 150,
            y: offsets.y
        }, true);
    },
    onSpeakerSelect: function(selectionmodel, records){
        if (records[0] !== undefined) {
            var speakerCard = new Ext.AceRoute.view.SpeakerDetail({
                prevCard: this,
                record: records[0],
                showSessionData: false
            });

            // Tell the parent panel to animate to the new card
            this.ownerCt.setActiveItem(speakerCard, 'slide');
        }
    },
    createImagesPanel: function(vwData){
    	
		var imageSelected = null;
    	var model = 'FileMetaData';
    	var record = 'filemeta';
    	var paramName = 'order_id';
    	var getOrderAction = 'getfilemeta';
    	var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
	    var xmlData = ajaxUtil.invokeUrlGetXml(
	    		Ext.AceRoute.appUrl+"?action="+getOrderAction+"&order_id="+vwData.id+"&mtoken="+Ext.AceRoute.loginref);
	    var filterPropertyName = 'file_type';
	    var filterPropertyValue = '1';
	    
	    var imagesMetaDataStore
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: model,
			    data : xmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: record
			        }
			    },
			    filters: [
	              {
	                  property: filterPropertyName,
	                  value   : filterPropertyValue
	              }
	            ]
			});
	    
    	var itemsList = new Ext.List({
    		scroll: 'vertical',
    	    itemTpl : '{file_id}',
    	    store: imagesMetaDataStore,
    	    listeners: {
				render: function(c){
					//Ext.AceRoute.store.orderStore.load();
				},
				selectionchange: function(selectionmodel, records){
			        if (records[0] !== undefined) {
			    	    var index = imagesMetaDataStore.findExact('file_id',records[0].data.file_id);
			    	    var dataMatch = imagesMetaDataStore.getAt(index);
			    	    imageSelected = dataMatch.data;
			        }
			     },
				 scope: this
			}
    	});
    	
    	var addButton = [{
        		xtype: 'button',
        		text:'Capture',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function() {
                	var addTaskPanel = this.createAddPicturePanel(vwData, itemsList, 
                			model, record, 
                			paramName, getOrderAction);
                	addTaskPanel.show();
                }
    	}];
    	var viewButton = [{
    		xtype: 'button',
    		text:'View',
            iconMask: true,
            stretch: false,
            scope: this,
            handler: function() {
            	var viewTaskPanel = this.createViewImagePanel(imageSelected, vwData, itemsList, 
            			model, record, 
            			paramName, getOrderAction, filterPropertyName, filterPropertyValue);
            	viewTaskPanel.show();
            }
	    }];
    	var deleteButton = [{
        		xtype: 'button',
        		text:'Delete',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function(event, btn) {
                	var editTaskPanel = this.createDeleteImagePanel(imageSelected, vwData, itemsList, model, record, 
                			paramName, getOrderAction, filterPropertyName, filterPropertyValue);
                	editTaskPanel.show();
                }
    	}];
    	var xBtn = {
            	xtype: 'button',
        		text:'Cancel',
                handler: function(){
                	partsOuterOuterPanel.hide();
                }
        };
        
        var dockedItems = [new Ext.Toolbar({
                ui: 'light',
                dock: 'bottom',
                items: [addButton, viewButton, deleteButton]	
            })];
        
        var partsPanel = new Ext.Panel({
//        	defaults: {
//        		scroll: 'vertical'
//              },
//                floating: true,
//                centered: true,
//                defaults: {
//                    scroll: 'vertical'
//                },
//                fullscreen: true,
                layout: 'fit',
//                autoHeight:true,
                //layout:'vbox',
//                styleHtmlContent: true,
                hideOnMaskTap: false, 
                items: [itemsList] //,dockedItems]
            });
        
          var partsOuterPanel = new Ext.Panel({
              layout: 'fit',
        	  hideOnMaskTap: false, 
        	  dockedItems: dockedItems,
        	  items: [partsPanel]
          });
          
          var partsOuterOuterPanel = new Ext.Panel({
        	  defaults: {
        		scroll: 'vertical'
              },
              autoRender: true,
              modal: true,
              height: 310,
              width: 260,
              floating: true,
              centered: true,
        	  layout: 'fit',
        	  hideOnMaskTap: false, 
//        	  autoHeight:true,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Images',
                  items: [{
                      xtype: 'spacer'
                  },{
                  	xtype: 'button',
              		text:'X',
                      handler: function(){
                    	  partsOuterOuterPanel.hide();
                      }
                  }]
              }],
        	  items: [partsOuterPanel]
          });
    	
  	  return partsOuterOuterPanel;
    },
    createNotesPanel: function(vwData){ 
    	
    	var paramName = 'order_id';
    	var getOrderAction = 'getordernotes';
    	var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
	    var orderNotesData = ajaxUtil.invokeUrlGetXml(
	    		Ext.AceRoute.appUrl+"?action="+getOrderAction+"&order_id="+vwData.id+"&mtoken="+Ext.AceRoute.loginref);
	    
	    var orderNote = '';
	    if(typeof orderNotesData !== "undefined"){
	    	if(typeof orderNotesData.childNodes[0] !== "undefined" && 
	    			typeof orderNotesData.childNodes[0].firstChild !== "undefined" && 
	    			orderNotesData.childNodes[0].firstChild != null){
		    	var orderNotesDataText = orderNotesData.childNodes[0].firstChild.data;
		    	orderNote = orderNotesDataText; //.toString().replaceAll("<data>","").replaceAll("</data>","");
	    	}
	    }
	    
	    var taskSelected = null;
	    var notesField = {
		      xtype: 'textareafield',
  		      id : 'orderNoteId',
  		      name : 'orderNote',
  		      label: 'Notes',
//  		      height: 300,
  		      fullscreen: true,
  		      useClearIcon: true,
  		      autoCapitalize : false,
  		      value: orderNote,
      		  listeners: {
      			  	keyup:
      			  	{ 
                     	fn: function(srcElm, event){
                     		orderNote = event.target.value;
                     	},
                     	scope: this 
                    }
//	    			,
//                	change: { 
//                     	fn: function(src, value){
//                     		orderNote = value;
//                     	},
//                     	scope: this 
//                     }
              }
      	};
	    
    	var saveButton = [{
        		xtype: 'button',
        		text:'Save',
                iconMask: true,
                stretch: false,
                scope: this,
                listeners: { 
                	tap: { 
                     	fn:  function(btn, event) {
                             	
                         	var cust_contactid = vwData.cust_contactid;
                 			var cust_id = vwData.cust_id;
                 			var cust_siteid = vwData.cust_siteid;
                 			var dragged = false;
                 			var event_geocode = vwData.event_geocode;
                 			var loginRef = Ext.AceRoute.loginref;
                 			var order_flg = '0|';
                 			var order_id = vwData.id;
                 			var order_inst = vwData.order_inst;
                 			var order_name  = vwData.order_name;
                 			var order_notes = orderNote;
                 			var order_po = vwData.order_po;
                 			var order_prtid = vwData.order_prtid;
                 			var order_recid = vwData.order_recid;
                 			var order_typeid = vwData.order_typeid;
                 			var order_wkfid = vwData.order_wkfid;
                 			var res_id = vwData.res_id;
                 			var reset = 0;
                 			var res_addid = vwData.res_addid;
                 			var type = 'false';
                 			var url = Ext.AceRoute.appUrlPost;
         	            	var wkfid_upd = 0;
                 			
         	            	this.addOrSaveOrder(cust_contactid,
         	            			cust_id,
         	            			cust_siteid ,
         	            			dragged,
         	            			event_geocode,
         	            			loginRef,
         	            			order_flg,
         	            			order_id,
         	            			order_inst,
         	            			order_name,
         	            			order_notes,
         	            			order_po,
         	            			order_prtid,
         	            			order_recid,
         	            			order_typeid,
         	            			order_wkfid,
         	            			reset,
         	            			res_id,
         	            			res_addid,
         	            			type,
         	            			url,
         	            			wkfid_upd);
                     }
             	},
             	scope: this 
             }
    	}];
    	var xBtn = {
            	xtype: 'button',
        		text:'Cancel',
                handler: function(){
                	partsOuterOuterPanel.hide();
                }
        };
        var dockedItems = [new Ext.Toolbar({
                ui: 'light',
                dock: 'bottom',
                items: [saveButton]	
        })];
        var partsPanel = new Ext.Panel({
                layout: 'fit',
                hideOnMaskTap: false, 
                items: [notesField]
            });
        
          var partsOuterPanel = new Ext.Panel({
              layout: 'fit',
        	  hideOnMaskTap: false, 
        	  dockedItems: dockedItems,
        	  items: [partsPanel]
          });
          
          var partsOuterOuterPanel = new Ext.Panel({
        	  defaults: {
        		scroll: 'vertical'
              },
              autoRender: true,
              modal: true,
              height: 250,
              width: 260,
              floating: true,
              centered: true,
        	  layout: 'fit',
        	  hideOnMaskTap: false, 
//        	  autoHeight:true,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Notes',
                  items: [{
                      xtype: 'spacer'
                  },{
                  	xtype: 'button',
              		text:'X',
                      handler: function(){
                    	  partsOuterOuterPanel.hide();
                      }
                  }]
              }],
        	  items: [partsOuterPanel]
          });
  	  return partsOuterOuterPanel;
    },
    createPartsPanel: function(vwData){
    	
    	var model = 'Part';
    	var record = 'orderpart';
    	var paramName = 'order_id';
    	var getOrderAction = 'getorderpart';
    	
	    var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
	    var orderPartXmlData = ajaxUtil.invokeUrlGetXml(
	    		Ext.AceRoute.appUrl+"?action="+getOrderAction+"&order_id="+vwData.id+"&mtoken="+Ext.AceRoute.loginref);
	    
	    var partsStore
        	= new Ext.data.Store({
    		    autoLoad: true,
    		    model: model,
    		    data : orderPartXmlData,
    		    proxy: {
    		        type: 'memory',
    		        reader: {
    		            type: 'xml',
    		            record: record
    		        }
    		    }
    		});
	    
    	var taskSelected = null;
    	
    	var itemsList = new Ext.List({
    		scroll: 'vertical',
    	    itemTpl : '{part_name}-{part_num}<br/>Quantity: <font size="2">{orderpart_qty}</font>',
    	    store: partsStore,
    	    listeners: {
				render: function(c){
					//Ext.AceRoute.store.orderStore.load();
				},
				selectionchange: function(selectionmodel, records){
			        if (records[0] !== undefined) {
			    	    var index = partsStore.findExact('orderpart_id',records[0].data.orderpart_id);
			    	    var dataMatch = partsStore.getAt(index);
			    	    taskSelected = dataMatch.data;
			        }
			     },
				 scope: this
			}
    	});
    	
    	var addButton = [{
        		xtype: 'button',
        		text:'Add',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function() {
                	var addPartPanel = this.createAddPartPanel(vwData, itemsList, 
                			model, record, 
                			paramName, getOrderAction);
                	addPartPanel.show();
                }
    	}];
    	var editButton = [{
        		xtype: 'button',
        		text:'Edit',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function(event, btn) {
                	var editTaskPanel = this.createEditPartPanel(taskSelected, vwData, 
                			itemsList, model, 
                			record, paramName, getOrderAction);
                	editTaskPanel.show();
                }
    	}];
    	var deleteButton = [{
        		xtype: 'button',
        		text:'Delete',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function(event, btn) {
                	var editTaskPanel = this.createDeletePartPanel(taskSelected, vwData, itemsList, model, record, 
                			paramName, getOrderAction);
                	editTaskPanel.show(); 
                } 
    	}];
    	
    	var xBtn = {
            	xtype: 'button',
        		text:'Cancel',
                handler: function(){
                	partsOuterOuterPanel.hide();
                }
        };
        
        var dockedItems = [new Ext.Toolbar({
                ui: 'light',
                dock: 'bottom',
                items: [addButton, editButton, deleteButton]	
            })];
        
        var partsPanel = new Ext.Panel({
//        	defaults: {
//        		scroll: 'vertical'
//              },
//                floating: true,
//                centered: true,
//                defaults: {
//                    scroll: 'vertical'
//                },
//                fullscreen: true,
                layout: 'fit',
//                autoHeight:true,
                //layout:'vbox',
//                styleHtmlContent: true,
                hideOnMaskTap: false, 
                items: [itemsList] //,dockedItems]
            });
        
          var partsOuterPanel = new Ext.Panel({
              layout: 'fit',
        	  hideOnMaskTap: false, 
        	  dockedItems: dockedItems,
        	  items: [partsPanel]
          });
          
          var partsOuterOuterPanel = new Ext.Panel({
        	  defaults: {
        		scroll: 'vertical'
              },
              autoRender: true,
              modal: true,
              height: 310,
              width: 260,
              floating: true,
              centered: true,
        	  layout: 'fit',
        	  hideOnMaskTap: false, 
//        	  autoHeight:true,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Parts',
                  items: [{
                      xtype: 'spacer'
                  },{
                  	xtype: 'button',
              		text:'X',
                      handler: function(){
                    	  partsOuterOuterPanel.hide();
                      }
                  }]
              }],
        	  items: [partsOuterPanel]
          });
    	
  	  return partsOuterOuterPanel;
    },
//    createCameraPanel: function(vwData){
//    	
//		var imageSelected = null;
//    	var model = 'FileMetaData';
//    	var record = 'filemeta';
//    	var paramName = 'order_id';
//    	var getOrderAction = 'getfilemeta';
//    	var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
//	    var xmlData = ajaxUtil.invokeUrlGetXml(
//	    		Ext.AceRoute.appUrl+"?action="+getOrderAction+"&order_id="+vwData.id);
//	    var sigPad = new Ext.AceRoute.ux.plugins.signaturePad({width: 200, height: 200})
//	    
//	    var imagesMetaDataStore
//	    	= new Ext.data.Store({
//			    autoLoad: true,
//			    model: model,
//			    data : xmlData,
//			    proxy: {
//			        type: 'memory',
//			        reader: {
//			            type: 'xml',
//			            record: record
//			        }
//			    }
//			});
//	    
//    	var itemsList = new Ext.List({
//    		scroll: 'vertical',
//    	    itemTpl : '{file_id}',
//    	    store: imagesMetaDataStore,
//    	    listeners: {
//				render: function(c){
//					//Ext.AceRoute.store.orderStore.load();
//				},
//				selectionchange: function(selectionmodel, records){
//			        if (records[0] !== undefined) {
//			    	    var index = imagesMetaDataStore.findExact('file_id',records[0].data.file_id);
//			    	    var dataMatch = imagesMetaDataStore.getAt(index);
//			    	    imageSelected = dataMatch.data;
//			        }
//			     },
//				 scope: this
//			}
//    	});
//    	
//    	var addButton = [{
//        		xtype: 'button',
//        		text:'Capture',
//                iconMask: true,
//                stretch: false,
//                scope: this,
//                handler: function() {
//                	var addTaskPanel = this.createAddPicturePanel(vwData, itemsList, 
//                			model, record, 
//                			paramName, getOrderAction, sigPad);
//                	addTaskPanel.show();
//                }
//    	}];
//    	var viewButton = [{
//    		xtype: 'button',
//    		text:'View',
//            iconMask: true,
//            stretch: false,
//            scope: this,
//            handler: function() {
//            	var viewTaskPanel = this.createViewSignaturePanel(imageSelected, vwData, itemsList, 
//            			model, record, 
//            			paramName, getOrderAction);
//            	viewTaskPanel.show();
//            }
//	    }];
//    	var deleteButton = [{
//        		xtype: 'button',
//        		text:'Delete',
//                iconMask: true,
//                stretch: false,
//                scope: this,
//                handler: function(event, btn) {
//                	var editTaskPanel = this.createDeleteSignaturePanel(imageSelected, vwData, itemsList, model, record, 
//                			paramName, getOrderAction);
//                	editTaskPanel.show();
//                }
//    	}];
//    	var xBtn = {
//            	xtype: 'button',
//        		text:'Cancel',
//                handler: function(){
//                	partsOuterOuterPanel.hide();
//                }
//        };
//        
//        var dockedItems = [new Ext.Toolbar({
//                ui: 'light',
//                dock: 'bottom',
//                items: [addButton, viewButton, deleteButton]	
//            })];
//        
//        var partsPanel = new Ext.Panel({
////        	defaults: {
////        		scroll: 'vertical'
////              },
////                floating: true,
////                centered: true,
////                defaults: {
////                    scroll: 'vertical'
////                },
////                fullscreen: true,
//                layout: 'fit',
////                autoHeight:true,
//                //layout:'vbox',
////                styleHtmlContent: true,
//                hideOnMaskTap: false, 
//                items: [itemsList] //,dockedItems]
//            });
//        
//          var partsOuterPanel = new Ext.Panel({
//              layout: 'fit',
//        	  hideOnMaskTap: false, 
//        	  dockedItems: dockedItems,
//        	  items: [partsPanel]
//          });
//          
//          var partsOuterOuterPanel = new Ext.Panel({
//        	  defaults: {
//        		scroll: 'vertical'
//              },
//              autoRender: true,
//              modal: true,
//              height: 350,
//              width: 260,
//              floating: true,
//              centered: true,
//        	  layout: 'fit',
//        	  hideOnMaskTap: false, 
////        	  autoHeight:true,
//              dockedItems: [{
//                  xtype: 'toolbar',
//                  title: 'Manage Images',
//                  items: [{
//                      xtype: 'spacer'
//                  },{
//                  	xtype: 'button',
//              		text:'X',
//                      handler: function(){
//                    	  partsOuterOuterPanel.hide();
//                      }
//                  }]
//              }],
//        	  items: [partsOuterPanel]
//          });
//    	
//  	  return partsOuterOuterPanel;
//    },
    createSignaturePanel: function(vwData){
    	
//  	  <data>
//  	  <filemeta>
//  	  <file_id>
//  	  <![CDATA[ 153001 ]]>
//  	  </file_id>
//  	  <order_id>
//  	  <![CDATA[ 142005 ]]>
//  	  </order_id>
//  	  <file_type>
//  	  <![CDATA[ 2 ]]>
//  	  </file_type>
//  	  <file_geocode>
//  	  <![CDATA[ 1 ]]>
//  	  </file_geocode>
//  	  <file_tstmp>
//  	  <![CDATA[ 1339703817315 ]]>
//  	  </file_tstmp>
//  	  <subt_by>
//  	  <![CDATA[ Ray Mond ]]>
//  	  </subt_by>
//  	  </filemeta>
//  	  </data>
    	
		var imageSelected = null;
    	var model = 'FileMetaData';
    	var record = 'filemeta';
    	var paramName = 'order_id';
    	var getOrderAction = 'getfilemeta';
    	var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
	    var xmlData = ajaxUtil.invokeUrlGetXml(
	    		Ext.AceRoute.appUrl+"?action="+getOrderAction+"&order_id="+vwData.id+"&mtoken="+Ext.AceRoute.loginref);
	    var sigPad = new Ext.AceRoute.ux.plugins.signaturePad({width: 200, height: 150})
	    
	    //sigPad.getSignatureAsImage("PNG");
	    
	    var filterPropertyName = 'file_type';
	    var filterPropertyValue = '2';
	    
	    var imagesMetaDataStore
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: model,
			    data : xmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: record
			        }
			    },
			    filters: [
	              {
	                  property: filterPropertyName,
	                  value   : filterPropertyValue
	              }
	            ]
			});
	    
    	var itemsList = new Ext.List({
    		scroll: 'vertical',
    	    itemTpl : '{fileTimestampAndIndex}',
    	    store: imagesMetaDataStore,
    	    listeners: {
				render: function(c){
					//Ext.AceRoute.store.orderStore.load();
				},
				selectionchange: function(selectionmodel, records){
			        if (records[0] !== undefined) {
			    	    var index = imagesMetaDataStore.findExact('file_id',records[0].data.file_id);
			    	    var dataMatch = imagesMetaDataStore.getAt(index);
			    	    imageSelected = dataMatch.data;
			        }
			     },
				 scope: this
			}
    	});
    	
    	var addButton = [{
        		xtype: 'button',
        		text:'Capture',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function() {
                	var addTaskPanel = this.createAddSignaturePanel(vwData, itemsList, 
                			model, record, 
                			paramName, getOrderAction, sigPad);
                	addTaskPanel.show();
                }
    	}];
    	var viewButton = [{
    		xtype: 'button',
    		text:'View',
            iconMask: true,
            stretch: false,
            scope: this,
            handler: function() {
            	var viewTaskPanel = this.createViewSignaturePanel(imageSelected, vwData, itemsList, 
            			model, record, 
            			paramName, getOrderAction, filterPropertyName, filterPropertyValue);
            	viewTaskPanel.show();
            }
	    }];
    	var deleteButton = [{
        		xtype: 'button',
        		text:'Delete',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function(event, btn) {
                	var editTaskPanel = this.createDeleteSignaturePanel(imageSelected, vwData, itemsList, model, record, 
                			paramName, getOrderAction, filterPropertyName, filterPropertyValue);
                	editTaskPanel.show();
                }
    	}];
    	var xBtn = {
            	xtype: 'button',
        		text:'Cancel',
                handler: function(){
                	partsOuterOuterPanel.hide();
                }
        };
        
        var dockedItems = [new Ext.Toolbar({
                ui: 'light',
                dock: 'bottom',
                items: [addButton, viewButton, deleteButton]	
            })];
        
        var partsPanel = new Ext.Panel({
//        	defaults: {
//        		scroll: 'vertical'
//              },
//                floating: true,
//                centered: true,
//                defaults: {
//                    scroll: 'vertical'
//                },
//                fullscreen: true,
                layout: 'fit',
//                autoHeight:true,
                //layout:'vbox',
//                styleHtmlContent: true,
                hideOnMaskTap: false, 
                items: [itemsList] //,dockedItems]
            });
        
          var partsOuterPanel = new Ext.Panel({
              layout: 'fit',
        	  hideOnMaskTap: false, 
        	  dockedItems: dockedItems,
        	  items: [partsPanel]
          });
          
          var partsOuterOuterPanel = new Ext.Panel({
        	  defaults: {
        		scroll: 'vertical'
              },
              autoRender: true,
              modal: true,
              height: 310,
              width: 260,
              floating: true,
              centered: true,
        	  layout: 'fit',
        	  hideOnMaskTap: false, 
//        	  autoHeight:true,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Signatures',
                  items: [{
                      xtype: 'spacer'
                  },{
                  	xtype: 'button',
              		text:'X',
                      handler: function(){
                    	  partsOuterOuterPanel.hide();
                      }
                  }]
              }],
        	  items: [partsOuterPanel]
          });
    	
  	  return partsOuterOuterPanel;
    },
    createTasksPanel: function(vwData){
    	
		var taskSelected = null;
    	var model = 'Task';
    	var record = 'ordertask';
    	var paramName = 'order_id';
    	var getOrderAction = 'getordertask';
    	var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
	    var xmlData = ajaxUtil.invokeUrlGetXml(
	    		Ext.AceRoute.appUrl+"?action="+getOrderAction+"&order_id="+vwData.id+"&mtoken="+Ext.AceRoute.loginref);
    	
	    var tasksStore
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: model,
			    data : xmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: record
			        }
			    }
			});
	    
    	var itemsList = new Ext.List({
    		scroll: 'vertical',
    	    itemTpl : '{task_name_hrs}',
    	    store: tasksStore,
    	    listeners: {
				render: function(c){
					//Ext.AceRoute.store.orderStore.load();
				},
				selectionchange: function(selectionmodel, records){
			        if (records[0] !== undefined) {
			    	    var index = tasksStore.findExact('ordertask_id',records[0].data.ordertask_id);
			    	    var dataMatch = tasksStore.getAt(index);
			    	    taskSelected = dataMatch.data;
			        }
			     },
				 scope: this
			}
    	});
    	
    	var addButton = [{
        		xtype: 'button',
        		text:'Add',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function() {
                	var addTaskPanel = this.createAddTaskPanel(vwData, itemsList, 
                			model, record, 
                			paramName, getOrderAction);
                	addTaskPanel.show();
                }
    	}];
    	var editButton = [{
        		xtype: 'button',
        		text:'Edit',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function(event, btn) {
                	var editTaskPanel = this.createEditTaskPanel(taskSelected, vwData, itemsList, 
                			model, record, 
                			paramName, getOrderAction);
                	editTaskPanel.show();
                }
    	}];
    	var deleteButton = [{
        		xtype: 'button',
        		text:'Delete',
                iconMask: true,
                stretch: false,
                scope: this,
                handler: function(event, btn) {
                	var editTaskPanel = this.createDeleteTaskPanel(taskSelected, vwData, itemsList, model, record, 
                			paramName, getOrderAction);
                	editTaskPanel.show();
                }
    	}];
    	var xBtn = {
            	xtype: 'button',
        		text:'Cancel',
                handler: function(){
                	partsOuterOuterPanel.hide();
                }
        };
        
        var dockedItems = [new Ext.Toolbar({
                ui: 'light',
                dock: 'bottom',
                items: [addButton, editButton, deleteButton]	
            })];
        
        var partsPanel = new Ext.Panel({
//        	defaults: {
//        		scroll: 'vertical'
//              },
//                floating: true,
//                centered: true,
//                defaults: {
//                    scroll: 'vertical'
//                },
//                fullscreen: true,
                layout: 'fit',
//                autoHeight:true,
                //layout:'vbox',
//                styleHtmlContent: true,
                hideOnMaskTap: false, 
                items: [itemsList] //,dockedItems]
            });
        
          var partsOuterPanel = new Ext.Panel({
              layout: 'fit',
        	  hideOnMaskTap: false, 
        	  dockedItems: dockedItems,
        	  items: [partsPanel]
          });
          
          var partsOuterOuterPanel = new Ext.Panel({
        	  defaults: {
        		scroll: 'vertical'
              },
//              autoRender: true,
              modal: true,
              height: 310,
              width: 260,
              floating: true,
              centered: true,
        	  layout: 'fit',
        	  hideOnMaskTap: false, 
//        	  autoHeight:true,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Tasks',
                  items: [{
                      xtype: 'spacer'
                  },{
                  	xtype: 'button',
              		text:'X',
                      handler: function(){
                    	  partsOuterOuterPanel.hide();
                      }
                  }]
              }],
        	  items: [partsOuterPanel]
          });
    	
  	  return partsOuterOuterPanel;
    },
    createResourcesPanel: function(vwData){
    	
    	var model = 'OrderResource';
		var record = 'ordertmemb';
//		var paramName = 'order_id';
//		var getOrderAction = 'getordertmemb';
//		
//	    var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
//	    var orderResXmlData = ajaxUtil.invokeUrlGetXml(
//	    		Ext.AceRoute.appUrl+"?action="+getOrderAction+"&"+paramName+"="+vwData.id+"&mtoken="+Ext.AceRoute.loginref);
	    
		var rootDoc = XmlUtil.createXmlDocument("<data></data>");
		var orderResXmlData = "";
		if(typeof vwData.res_addid !== "undefined"){
			var additionResources = vwData.res_addid.split( "|" );
			for(i = 0;i < additionResources.length;i++){
				orderResXmlData = XmlUtil.appendNode(rootDoc,"<ordertmemb><res_id>"+additionResources[i]+"</res_id></ordertmemb>"); 
			}
		}
    	
	    var orderResStore
        	= new Ext.data.Store({
    		    autoLoad: true,
    		    model: model,
    		    data : orderResXmlData,
    		    proxy: {
    		        type: 'memory',
    		        reader: {
    		            type: 'xml',
    		            record: record
    		        }
    		    }
    		});
    	    
    	var taskSelected = null;
        	
        var itemsList = new Ext.List({
        		scroll: 'vertical',
//        		defaults: {
//                    scroll: 'vertical'
//                },
//        	    scroll: 'vertical',
//        	    fullscreen: true,
        		itemTpl : '{res_name}',
        	    store: orderResStore,
        	    listeners: {
    				render: function(c){
    					//Ext.AceRoute.store.orderStore.load();
    				},
    				selectionchange: function(selectionmodel, records){
    			        if (records[0] !== undefined) {
    			    	    var index = orderResStore.findExact('res_id',records[0].data.res_id);
    			    	    var dataMatch = orderResStore.getAt(index);
    			    	    taskSelected = dataMatch.data;
    			        }
    			     },
    				 scope: this
    			}
        	});
        	
        var addButton = [{
            		xtype: 'button',
            		text:'Add',
                    iconMask: true,
                    stretch: false,
                    scope: this,
                    handler: function() {
                    	var addPartPanel = this.createAddResPanel(vwData, itemsList,model, record);
                    	addPartPanel.show();
                    }
        	}];
        var editButton = [{
            		xtype: 'button',
            		text:'Edit',
                    iconMask: true,
                    stretch: false,
                    scope: this,
                    handler: function(event, btn) {
                    	var editTaskPanel = this.createEditResPanel(taskSelected, vwData, itemsList, model, record, 
                    			paramName, getOrderAction);
                    	editTaskPanel.show();
                    }
        	}];
        var deleteButton = [{
            		xtype: 'button',
            		text:'Delete',
                    iconMask: true,
                    stretch: false,
                    scope: this,
                    handler: function(event, btn) {
                    	var editTaskPanel = this.createDeleteResPanel(taskSelected, vwData, itemsList, model, record);
                    	editTaskPanel.show();
                    }
        	}];
        
        var xBtn = {
            	xtype: 'button',
        		text:'Cancel',
                handler: function(){
                	partsOuterOuterPanel.hide();
                }
        };
        
        var dockedItems = [new Ext.Toolbar({
                ui: 'light',
                dock: 'bottom',
                //items: [addButton, editButton, deleteButton]
                items: [addButton, deleteButton]
            })];
        
        var partsPanel = new Ext.Panel({
//        	defaults: {
//        		scroll: 'vertical'
//              },
//                floating: true,
//                centered: true,
//                defaults: {
//                    scroll: 'vertical'
//                },
//                fullscreen: true,
                layout: 'fit',
//                autoHeight:true,
                //layout:'vbox',
//                styleHtmlContent: true,
                hideOnMaskTap: false, 
                items: [itemsList] //,dockedItems]
            });
        
          var partsOuterPanel = new Ext.Panel({
              layout: 'fit',
        	  hideOnMaskTap: false, 
        	  dockedItems: dockedItems,
        	  items: [partsPanel]
          });
          
          var partsOuterOuterPanel = new Ext.Panel({
        	  defaults: {
        		scroll: 'vertical'
              },
//              autoRender: true,
              modal: true,
              height: 310,
              width: 260,
              floating: true,
              centered: true,
        	  layout: 'fit',
        	  hideOnMaskTap: false, 
//        	  autoHeight:true,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Team',
                  items: [{
                      xtype: 'spacer'
                  },{
                  	xtype: 'button',
              		text:'X',
                      handler: function(){
                    	  partsOuterOuterPanel.hide();
                      }
                  }]
              }],
        	  items: [partsOuterPanel]
          });
          
      	  return partsOuterOuterPanel;
    },
    createEditOrderNotePanel: function(vwData, 
				notesField, 
				paramName, 
				getOrderAction){
    	
  	   this.editPart_orderId = taskSelected.order_id;
  	   this.editPart_orderpartId = taskSelected.orderpart_id;
  	   this.editPart_partTypeId = taskSelected.part_id;
  	   this.editPart_orderQuant = taskSelected.orderpart_qty;
  	   
  	   var taskType = {
  		      xtype: 'selectfield',
  		      id: 'taskType',
              name: 'taskType',
              label: 'TaskType',
              value: taskSelected.part_id,
              store: Ext.AceRoute.store.partTypeStore,
              displayField : 'part_name',
              valueField : 'part_id',
              listeners: { 
                  change: { 
                  	fn: function(src, value){
                  		this.editPart_partTypeId = value;
                  	},
                  	scope: this 
                  }
              }
              
          };
          var personHours = {
  	      xtype: 'textfield',
  	      id : 'personHour',
  	      name : 'personHour',
  	      label: 'Person Hours',
  	      useClearIcon: true,
  	      autoCapitalize : false,
  	      value: taskSelected.orderpart_qty,
  	      listeners: {
  		        scope: this,
  		        change: function(scope, newValue, oldValue){
  		        	this.editPart_orderQuant = newValue;
  		        }
  	      }
        	};
          
          var editPartPanel = null;
          var closeButton = [{
          		xtype: 'button',
          		text:'X',
                  handler: function() {
                  	editPartPanel.hide();
                  }
      	}];
      	var saveButton = [{
      		xtype: 'button',
      		text:'Save',
              iconMask: true,
              stretch: false,
              scope:this,
              handler: function(event, btn) {
            	   	var action = "saveorderpart";
 	        	var loginref = Ext.AceRoute.loginref;
 	        	var order_id = this.editPart_orderId;
 	        	var orderpart_id = this.editPart_orderpartId;
 	        	var orderpart_qty = this.editPart_orderQuant;
 	        	var orderpart_typeid = 1;
 	        	var part_id = this.editPart_partTypeId;
 	        	var tstamp = new Date().getTime();
 	        	var url = Ext.AceRoute.appUrl;
 	        	
 	        	this.addOrSavePart(action, loginref, 
 	        			order_id,orderpart_id, 
 	        			orderpart_qty, orderpart_typeid,
 	        			part_id,tstamp, url, 
 	        			itemsList, model, 
 	        			record, paramName, getOrderAction);
              }
  		}];
  		var cancelButton = [{
      		xtype: 'button',
      		text:'Cancel',
              iconMask: true,
              stretch: false,
              handler: function() {
             	 editPartPanel.hide();
              }
  		}];
  		var dockedItems = [new Ext.Toolbar({
  	        ui: 'light',
  	        dock: 'top',
  	        items: [saveButton, cancelButton]	
  	    })];
  		editPartPanel = new Ext.Panel({
              floating: true,
              centered: true,
              modal: true,
              width: 300,
              styleHtmlContent: true,
              hideOnMaskTap: false,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Edit Task',
                  items: [
                    {
                     	xtype: 'spacer'
                    },
                    closeButton
                  ]
              }], 
              items: [taskType,personHours,dockedItems]
          });	
      	return editPartPanel;
     },
    createAddImagePanel: function(vwData, itemsList, 
			model, record, 
			paramName, getOrderAction){
    	
       this.addTask_orderId = vwData.id;
       var dataMatch = Ext.AceRoute.store.taskTypeStore.getAt(0); // get ths first item from the store
       this.addTask_taskTypeId = dataMatch.data.task_id;
 	   this.addTask_orderTaskHrs = undefined;
 	   
    	var taskType = {
		    xtype: 'selectfield',
		    id: 'taskType',
            name: 'taskType',
            label: 'TaskType',
            store: Ext.AceRoute.store.taskTypeStore,
            displayField : 'task_name',
            valueField : 'task_id',
            listeners: { 
                change: { 
                	fn: function(src, value){
                		this.addTask_taskTypeId = value;
                	},
                	scope: this 
                }
            }
        };
        var personHours = {
	      xtype: 'textfield',
	      id : 'personHour',
	      name : 'personHour',
	      label: 'Person Hours',
	      useClearIcon: true,
	      autoCapitalize : false,
	      listeners: {
		        scope: this,
		        change: function(scope, newValue, oldValue){
		        	this.addTask_orderTaskHrs = newValue;
		        }
	      }
      	};
        
        var addTaskPanel = null;
        
    	var closeButton = [{
        		xtype: 'button',
        		text:'X',
                handler: function() {
                	addTaskPanel.hide();
                }
    	}];
    	
    	var saveButton = [{
    		xtype: 'button',
    		text:'Save',
            iconMask: true,
            stretch: false,
            scope:this,
            handler: function(event, btn) {
          	    var url = Ext.AceRoute.appUrl;
          	    var loginref = Ext.AceRoute.loginref;
    	  		var action = "saveordertask";
    	  		var order_id = this.addTask_orderId;
    	  		var ordertask_id = 0; // new task for this order
    	  		var ordertask_hrs = this.addTask_orderTaskHrs;
    	  		var ordertask_typeid = 1; // res id, TODO
    	  		var task_id = this.addTask_taskTypeId;
    	  		var tstamp =		new Date().getTime();
    	  		
          	    this.addOrSaveTask(action, loginref, 
          	    		order_id, ordertask_id, ordertask_hrs,
          	    		ordertask_typeid, task_id, tstamp, url , itemsList,
          	    		model, record, 
          	    		paramName, getOrderAction);
            }
		}];
		var cancelButton = [{
    		xtype: 'button',
    		text:'Cancel',
            iconMask: true,
            stretch: false,
            handler: function() {
            	addTaskPanel.hide();
            }
		}];
		var dockedItems = [new Ext.Toolbar({
	        ui: 'light',
	        dock: 'top',
	        items: [saveButton, cancelButton]	
	    })];
		addTaskPanel = new Ext.Panel({
			autoRender: true,
            floating: true,
            centered: true,
            modal: true,
            width: 300,
            styleHtmlContent: true,
            hideOnMaskTap: false,
            dockedItems: [{
                xtype: 'toolbar',
                title: 'Add Signature',
                items: [
                  {
                   	xtype: 'spacer'
                  },
                  closeButton
                ]
            }], 
            items: [taskType,personHours,dockedItems]
        });	
    	return addTaskPanel;
    },
    createViewImagePanel: function(imageSelected, vwData, itemsList, 
			model, record, 
			paramName, getOrderAction, filterPropertyName, filterPropertyValue){
    	
       var url = Ext.AceRoute.appUrl;
 	   var action = "getfile";
 	   var loginref = Ext.AceRoute.loginref;
 	   
       var image = {
	        xtype: 'component',
	        width: 200,
	        height: 125,
		    getElConfig : function() {
		        return {tag: 'img',
		        //src: url+'&action='+action+'&file_id=1322981209906',
		        src: Ext.AceRoute.appUrlImageGet+'?loginref='+Ext.AceRoute.loginref+'&action='+action+'&file_id='+imageSelected.file_id+"&mtoken="+Ext.AceRoute.loginref
		       // style: { height: 50, width: 50 },
		       };
		    }
        };
        
        var imagePanel = null;
        
    	var closeButton = [{
        		xtype: 'button',
        		text:'X',
                handler: function() {
                	imagePanel.hide();
                }
    	}];
    	
    	var deleteButton = [{
    		xtype: 'button',
    		text:'Delete',
            iconMask: true,
            stretch: false,
            scope: this,
            handler: function(event, btn) {
            	var editTaskPanel = this.createDeleteImagePanel(imageSelected, vwData, itemsList, model, record, 
            			paramName, getOrderAction, filterPropertyName, filterPropertyValue);
            	editTaskPanel.show();
            }
	    }];
    	
    	var cancelButton = [{
    		xtype: 'button',
    		text:'Cancel',
            iconMask: true,
            stretch: false,
            handler: function() {
            	imagePanel.hide();
            }
		}];
		var dockedItems = [new Ext.Toolbar({
	        ui: 'light',
	        dock: 'top',
	        items: [deleteButton, cancelButton]	
	    })];
		imagePanel = new Ext.Panel({
            floating: true,
            centered: true,
			layout: {
		        type: 'auto',
		        align: 'stretch'
		    },
            modal: true,
            height: 250,
            width: 260,
            styleHtmlContent: true,
            hideOnMaskTap: false,
            dockedItems: [{
                xtype: 'toolbar',
                title: 'View Image',
                items: [
                  {
                   	xtype: 'spacer'
                  },
                  closeButton
                ] 
            }], 
            items: [image,dockedItems]
        });	
    	return imagePanel;
    },
    createDeleteImagePanel: function(taskSelected, vwOrderData, itemsList, 
   		    model, record, 
 			paramName, getOrderAction, filterPropertyName, filterPropertyValue){
   	  
		 var orderId = taskSelected.order_id;
	 	 var file_id = taskSelected.file_id;
	 	   
   	     var addMemberPanel = null;
          
      	 var closeButton = [{
          		xtype: 'button',
          		text:'X',
                 handler: function() {
                 	addMemberPanel.hide();
                 }
      	  }];
      	 var deleteConfirmMessage = {
      	          xtype: 'textfield',
     	          id: 'deleteConfirmMessageId',
                 name: 'deleteConfirmMessage',
                 hideOnMaskTap: true,
//                 style: 'width: 50%', 
                 readonly: true,
                 label: 'Do you want to delete?' 
 	        };
      	  var deleteButton = [{
      		   xtype: 'button',
      		   text:'Yes',
               iconMask: true,
               stretch: false,
               scope:this,
               handler: function(event, btn) {
            	    var url = Ext.AceRoute.appUrl;
            	    var action = 'deletefile';
            	    this.deleteImage(url, action , orderId, file_id, itemsList, model, record, 
               			paramName, getOrderAction, addMemberPanel, filterPropertyName, filterPropertyValue);
               }
  		 }];
  		var cancelButton = [{
	       	   xtype: 'button',
	       	   text:'Cancel',
              iconMask: true,
              stretch: false,
              handler: function() {
             	 addMemberPanel.hide();
              }
  		}];
  		
  		var dockedItems = [new Ext.Toolbar({
  	        ui: 'light',
  	        dock: 'top',
  	        items: [deleteButton, cancelButton]	
  	    })];
  		
  		addMemberPanel = new Ext.Panel({
              floating: true,
              centered: true,
              modal: true,
              width: 300,
              defaults: {
                  labelAlign: 'left',
                  labelWidth: '100%',
                  style: 'border-width: 0px',
                  border: false
              },
              styleHtmlContent: true,
              hideOnMaskTap: false,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Delete Image',
                  items: [
                    {
                     	xtype: 'spacer'
                    },
                    closeButton
                  ]
              }], 
              //items: [res,startDate, personStartTime, endDate, personEndTime, dockedItems]
              items: [deleteConfirmMessage, dockedItems]
          });	
      	return addMemberPanel;
      },
      createAddSignaturePanel: function(vwData, itemsList, 
  			model, record, 
  			paramName, getOrderAction, sigPad){
      	
        this.orderId = vwData.id;
        var dataMatch = Ext.AceRoute.store.taskTypeStore.getAt(0); // get ths first item from the store
        
	    var signpanel = new Ext.Panel({   
			id: 'signaturePanel',
			plugins: [sigPad]
	    });
   	
        var addTaskPanel = null;
          
        var closeButton = [{
          		xtype: 'button',
          		text:'X',
                  handler: function() {
                  	addTaskPanel.hide();
                  }
        }];
      	
      	var saveButton = [{
      		xtype: 'button',
      		text:'Save',
              iconMask: true,
              stretch: false,
              scope:this,
              handler: function(event, btn) {
            	    var url = Ext.AceRoute.appUrlPost;
            	    var loginref = Ext.AceRoute.loginref;
	      	  		var action = "savefile";
	      	  	    var jpegImage = sigPad.getSignatureAsImage('PNG'); //Ext.getCmp('signaturePanel').plugins[0].getSignatureAsImage('PNG');
	      	  	    jpegImage = jpegImage.src.substr(jpegImage.src.indexOf("base64,",0)+7);
	      	  	  	var order_id = this.orderId;
	      	  		var file_geocode = 1; 
	      	  		var file_type = 2; // for signature
	      	  		var file; // actual file binary
	      	  		
			        var login = new Ext.form.FormPanel({
			      	    standardSubmit: true,
			      	    floating: true,
			      	    modal: true,
			      	    centered: true,
			      	    items: [{
			      	        xtype: 'textfield',
			      	        name: 'wtf',
			      	        value: 'mang',
			      	        hidden: true,
			      	        autoCreateField: true
				      	    }] 
				      	});
			      	
			      	Ext.Ajax.request({
			   	        url: url,
			   	        method: 'POST',
			   	        params: {
			   	        	mtoken: Ext.AceRoute.loginref,
			   	        	action:	action,
			   	        	order_id: order_id,
			       	  	    file_geocode: file_geocode, // new task for this order
			       	  	    file_type: file_type,
			       	  		file: jpegImage
			             },
				   	     success: handleResponse,
				   	     failure: function (response) {
				   	    	alert("failed");
				   	     }
			   	     });
              }
  		}];
  		var cancelButton = [{
      		xtype: 'button',
      		text:'Cancel',
              iconMask: true,
              stretch: false,
              handler: function() {
              	addTaskPanel.hide();
              }
  		}];
  		var dockedItems = [new Ext.Toolbar({
  	        ui: 'light',
  	        dock: 'top',
  	        items: [saveButton, cancelButton]	
  	    })];
  		addTaskPanel = new Ext.Panel({
  			autoRender: true,
              floating: true,
              centered: true,
              modal: true,
              height:310,
              width: 260,
              styleHtmlContent: true,
              hideOnMaskTap: false,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Capture',
                  items: [
                    {
                     	xtype: 'spacer'
                    },
                    closeButton
                  ]
              }], 
              items: [signpanel,dockedItems]
          });	
      	return addTaskPanel;
      },
      createViewSignaturePanel: function(imageSelected, vwData, itemsList, 
  			model, record, 
  			paramName, getOrderAction, filterPropertyName, filterPropertyValue){
    	  
         var url = Ext.AceRoute.appUrl;
   	     var action = "getfile";
   	     var loginref = Ext.AceRoute.loginref;
   	   
         var image = {
  	        xtype: 'component',
  	        width: 200,
  	        height: 125,
  		    getElConfig : function() {
  		        return {tag: 'img',
  		        //src: url+'&action='+action+'&file_id=1322981209906',
  		        src: Ext.AceRoute.appUrlImageGet+'?loginref='+Ext.AceRoute.loginref+'&action='+action+'&file_id='+imageSelected.file_id+'&mtoken='+Ext.AceRoute.loginref
  		       // style: { height: 50, width: 50 },
  		       };
  		    }
          };
          
          var imagePanel = null;
          
      	var closeButton = [{
          		xtype: 'button',
          		text:'X',
                  handler: function() {
                  	imagePanel.hide();
                  }
      	}];
      	
      	var deleteButton = [{
      		xtype: 'button',
      		text:'Delete',
              iconMask: true,
              stretch: false,
              scope: this,
              handler: function(event, btn) {
              	var editTaskPanel = this.createDeleteImagePanel(imageSelected, vwData, itemsList, model, record, 
              			paramName, getOrderAction, filterPropertyName, filterPropertyValue);
              	editTaskPanel.show();
              }
  	    }];
      	
      	var cancelButton = [{
      		xtype: 'button',
      		text:'Cancel',
              iconMask: true,
              stretch: false,
              handler: function() {
              	imagePanel.hide();
              }
  		}];
  		var dockedItems = [new Ext.Toolbar({
  	        ui: 'light',
  	        dock: 'top',
  	        items: [deleteButton, cancelButton]	
  	    })];
  		imagePanel = new Ext.Panel({
              floating: true,
              centered: true,
  			layout: {
  		        type: 'auto',
  		        align: 'stretch'
  		    },
              modal: true,
              height: 250,
              width: 300,
              styleHtmlContent: true,
              hideOnMaskTap: false,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'View',
                  items: [
                    {
                     	xtype: 'spacer'
                    },
                    closeButton
                  ] 
              }], 
              items: [image,dockedItems]
          });	
      	return imagePanel;
      },
      buildForm: function(form, url, params, file) {
          var fieldsSpec = [],
              formSpec,
              formEl,
              basicForm = form,
              uploadFields = {}; //basicForm.getFields().filter('inputType', 'file');

          function addField(name, val) {
              fieldsSpec.push({
                  tag: 'input',
                  type: 'hidden',
                  name: name,
                  value: val
              });
          }

          // Add the form field values
          Ext.iterate(params, function(key, val) {
        	   console.log(" iterate key "+key+" val "+val);
               addField(key, val);
          });

          formSpec = {
              tag: 'form',
              action: url,
              method: 'POST', //this.getMethod(),
              style: 'display:none',
              cn: fieldsSpec
          };

          // Set the proper encoding for file uploads
          if (uploadFields.length) {
              formSpec.encoding = formSpec.enctype = 'multipart/form-data';
          }

          // Create the form
          formEl = Ext.DomHelper.append(document.body, [{
								        	  tag: 'form',
								              action: url,
								              method: 'POST', 
								              style: 'display:none',
								              enctype: 'multipart/form-data',
								              cn: fieldsSpec
        					}]);

          // Special handling for file upload fields: since browser security measures prevent setting
          // their values programatically, and prevent carrying their selected values over when cloning,
          // we have to move the actual field instances out of their components and into the form. We
          // create a clone to replace it with to maintain correct layout.
          uploadFields.each(function(field) {
              if (field.rendered) { // can only have a selected file value after being rendered
                  var input = field.inputEl,
                      clone = input.cloneNode(true);
                  Ext.fly(input).replaceWith(clone).appendTo(formEl);
              }
          });

          return formEl;
      },
      createDeleteSignaturePanel: function(taskSelected, vwOrderData, itemsList, 
     		    model, record, 
     		    paramName, getOrderAction,
     		    filterPropertyName, filterPropertyValue){
     	  
  		     var orderId = taskSelected.order_id;
  	 	     var file_id = taskSelected.file_id;
  	 	   
     	     var addMemberPanel = null;
            
        	 var closeButton = [{
            		xtype: 'button',
            		text:'X',
                    handler: function() {
                   	    addMemberPanel.hide();
                    }
        	  }];
        	 var deleteConfirmMessage = {
        	       xtype: 'textfield',
       	           id: 'deleteConfirmMessageId',
                   name: 'deleteConfirmMessage',
                   hideOnMaskTap: true,
//                   style: 'width: 50%', 
                   readonly: true,
                   label: 'Do you want to delete?' 
   	        };
        	  var deleteButton = [{
        		    xtype: 'button',
        		    text:'Yes',
	                iconMask: true,
	                stretch: false,
	                scope:this,
	                handler: function(event, btn) {
	              	    var url = Ext.AceRoute.appUrl;
	              	    var action = 'deletefile';
	              	    this.deleteImage(url, action , orderId, file_id, itemsList, model, record, 
	                 			paramName, getOrderAction, addMemberPanel,filterPropertyName, filterPropertyValue);
	                }
    		 }];
    		var cancelButton = [{
  	       	   xtype: 'button',
  	       	   text:'Cancel',
                iconMask: true,
                stretch: false,
                handler: function() {
               	 addMemberPanel.hide();
                }
    		}];
    		
    		var dockedItems = [new Ext.Toolbar({
    	        ui: 'light',
    	        dock: 'top',
    	        items: [deleteButton, cancelButton]	
    	    })];
    		
    		addMemberPanel = new Ext.Panel({
                floating: true,
                centered: true,
                modal: true,
                width: 300,
                defaults: {
                    labelAlign: 'left',
                    labelWidth: '100%',
                    style: 'border-width: 0px',
                    border: false
                },
                styleHtmlContent: true,
                hideOnMaskTap: false,
                dockedItems: [{
                    xtype: 'toolbar',
                    title: 'Delete',
                    items: [
                      {
                       	xtype: 'spacer'
                      },
                      closeButton
                    ]
                }], 
                //items: [res,startDate, personStartTime, endDate, personEndTime, dockedItems]
                items: [deleteConfirmMessage, dockedItems]
            });	
        	return addMemberPanel;
      },
      
      createAddPartPanel: function(vwData, itemsList, model, record, paramName, getOrderAction){
      	
          this.addTask_orderId = vwData.id;
          var dataMatch = Ext.AceRoute.store.partTypeStore.getAt(0); // get ths first item from the store
          this.addPart_partTypeId = dataMatch.data.part_id;
    	    this.addPart_orderQuant = undefined;
    	   
       	var partType = {
   		     xtype: 'selectfield',
   		     id: 'partType',
               name: 'partType',
               label: 'Part#',
               store: Ext.AceRoute.store.partTypeStore,
               displayField : 'partNameAndNum',
               valueField : 'part_id',
               listeners: { 
                   change: { 
                   	fn: function(src, value){
                   		this.addPart_partTypeId = value;
                   	},
                   	scope: this 
                   }
               }
           };
           var quantity = {
	   	      xtype: 'textfield',
	   	      id : 'quantity',
	   	      name : 'quantity',
	   	      label: 'Quantity',
	   	      useClearIcon: true,
	   	      autoCapitalize : false,
		   	   listeners: {
//	  		        change: {
//	  		        	fn: function(scope, newValue, oldValue, eOpts){
//		  		        	alert('quantity');
//		  		        	this.addPart_orderQuant = newValue;
//	  		        	},
//	  		        	scope: this
//	  		        }
		   		   
		   		keyup: { 
	               	fn: function(src, event){
	               		this.addPart_orderQuant = event.target.value;
	               	},
	               	scope: this 
	               }
	  	      }
         	};
           
          var addPartPanel = null;
          var closeButton = [{
           		xtype: 'button',
           		text:'X',
                   handler: function() {
                  	 addPartPanel.hide();
                   }
       	}];
       	
       	var saveButton = [{
       		xtype: 'button',
       		text:'Save',
               iconMask: true,
               stretch: false,
               scope:this,
               handler: function(event, btn) {
              	var action = "saveorderpart";
              	var loginref = Ext.AceRoute.loginref;
              	var order_id = this.addTask_orderId;
              	var orderpart_id = 0;
              	var orderpart_qty = this.addPart_orderQuant;
              	var orderpart_typeid = 1;
              	var part_id = this.addPart_partTypeId;
              	var tstamp = new Date().getTime();
              	var url = Ext.AceRoute.appUrl;
              	
              	this.addOrSavePart(action, loginref, 
  	        			order_id,orderpart_id, 
  	        			orderpart_qty, orderpart_typeid,
  	        			part_id,tstamp, url, 
  	        			itemsList, model, 
  	        			record, paramName, getOrderAction);
               }
   		}];
   		var cancelButton = [{
       		xtype: 'button',
       		text:'Cancel',
               iconMask: true,
               stretch: false,
               handler: function() {
              	 addPartPanel.hide();
               }
   		}];
   		var dockedItems = [new Ext.Toolbar({
   	        ui: 'light',
   	        dock: 'top',
   	        items: [saveButton, cancelButton]	
   	    })];
   		addPartPanel = new Ext.Panel({
   			   autoRender: true,
               floating: true,
               centered: true,
               modal: true,
               width: 300,
               styleHtmlContent: true,
               hideOnMaskTap: false,
               dockedItems: [{
                   xtype: 'toolbar',
                   title: 'Add Part',
                   items: [
                     {
                      	xtype: 'spacer'
                     },
                     closeButton
                   ]
               }], 
               items: [partType,quantity,dockedItems]
           });	
       	return addPartPanel;
       },
      
      createEditPartPanel: function(taskSelected, vwData, itemsList, model, record, paramName, getOrderAction){
      	
   	   this.editPart_orderId = taskSelected.order_id;
   	   this.editPart_orderpartId = taskSelected.orderpart_id;
   	   this.editPart_partTypeId = taskSelected.part_id;
   	   this.editPart_orderQuant = taskSelected.orderpart_qty;
   	   
   	   var taskType = {
   		    xtype: 'selectfield',
   		    id: 'taskType',
               name: 'taskType',
               label: 'TaskType',
               value: taskSelected.part_id,
               store: Ext.AceRoute.store.partTypeStore,
               displayField : 'partNameAndNum',
               valueField : 'part_id',
               listeners: { 
                   change: { 
                   	fn: function(src, value){
                   		this.editPart_partTypeId = value;
                   	},
                   	scope: this 
                   }
               }
               
           };
		   	var quantity = {
			   	      xtype: 'textfield',
			   	      id : 'quantity',
			   	      name : 'quantity',
			   	      label: 'Quantity',
			   	      useClearIcon: true,
			   	      autoCapitalize : false,
			   	      value: taskSelected.orderpart_qty,
				   	  listeners: {
				   		  keyup: { 
			               	fn: function(src, event){
			               		this.editPart_orderQuant = event.target.value;
			               	},
			               	scope: this 
			               }
			  	      }
		       	};
           
           var editPartPanel = null;
           var closeButton = [{
           		xtype: 'button',
           		text:'X',
                   handler: function() {
                   	editPartPanel.hide();
                   }
       	}];
       	var saveButton = [{
       		xtype: 'button',
       		text:'Save',
               iconMask: true,
               stretch: false,
               scope:this,
               handler: function(event, btn) {
             	   	var action = "saveorderpart";
	  	        	var loginref = Ext.AceRoute.loginref;
	  	        	var order_id = this.editPart_orderId;
	  	        	var orderpart_id = this.editPart_orderpartId;
	  	        	var orderpart_qty = this.editPart_orderQuant;
	  	        	var orderpart_typeid = 1;
	  	        	var part_id = this.editPart_partTypeId;
	  	        	var tstamp = new Date().getTime();
	  	        	var url = Ext.AceRoute.appUrl;
	  	        	
	  	        	this.addOrSavePart(action, loginref, 
	  	        			order_id,orderpart_id, 
	  	        			orderpart_qty, orderpart_typeid,
	  	        			part_id,tstamp, url, 
	  	        			itemsList, model, 
	  	        			record, paramName, getOrderAction);
               }
   		}];
   		var cancelButton = [{
       		xtype: 'button',
       		text:'Cancel',
               iconMask: true,
               stretch: false,
               handler: function() {
              	 editPartPanel.hide();
               }
   		}];
   		var dockedItems = [new Ext.Toolbar({
   	        ui: 'light',
   	        dock: 'top',
   	        items: [saveButton, cancelButton]	
   	    })];
   		editPartPanel = new Ext.Panel({
   			 autoRender: true,
               floating: true,
               centered: true,
               modal: true,
               width: 300,
               styleHtmlContent: true,
               hideOnMaskTap: false,
               dockedItems: [{
                   xtype: 'toolbar',
                   title: 'Edit Task',
                   items: [
                     {
                      	xtype: 'spacer'
                     },
                     closeButton
                   ]
               }], 
               items: [taskType,quantity,dockedItems]
           });	
       	return editPartPanel;
      },
      createDeletePartPanel: function(taskSelected, vwOrderData, itemsList, 
    		  model, record, 
  			paramName, getOrderAction){
    	  
//    	  deleteordertmemb&ordertres_id=12345|123456
      	  var orderId = taskSelected.order_id;
    	  var orderpartId = taskSelected.orderpart_id;
    	     
       	  var closeButton = [{
           		xtype: 'button',
           		text:'X',
                  handler: function() {
                  	addMemberPanel.hide();
                  }
       	  }];
       	  var deleteConfirmMessage = {
       	          xtype: 'textfield',
      	          id: 'deleteConfirmMessageId',
                  name: 'deleteConfirmMessage',
                  hideOnMaskTap: true,
//                  style: 'width: 50%', 
                  readonly: true,
                  label: 'Do you want to delete?' 
  	        };
       	  var deleteButton = [{
       		   xtype: 'button',
       		   text:'Yes',
               iconMask: true,
               stretch: false,
               scope:this,
               handler: function(event, btn) {
             	    var url = Ext.AceRoute.appUrl;
             	    var action = 'deleteorderpart';
             	    this.deletePart(url,action , orderId, orderpartId, itemsList, model, record, 
                			paramName, getOrderAction);
               }
   		 }];
   		var cancelButton = [{
  	       	   xtype: 'button',
  	       	   text:'Cancel',
               iconMask: true,
               stretch: false,
               handler: function() {
              	 addMemberPanel.hide();
               }
   		}];
   		
   		var dockedItems = [new Ext.Toolbar({
   	        ui: 'light',
   	        dock: 'top',
   	        items: [deleteButton, cancelButton]	
   	    })];
   		
   		addMemberPanel = new Ext.Panel({
               floating: true,
               centered: true,
               modal: true,
               width: 300,
               defaults: {
                   labelAlign: 'left',
                   labelWidth: '100%',
                   style: 'border-width: 0px',
                   border: false
               },
               styleHtmlContent: true,
               hideOnMaskTap: false,
               dockedItems: [{
                   xtype: 'toolbar',
                   title: 'Delete Part',
                   items: [
                     {
                      	xtype: 'spacer'
                     },
                     closeButton
                   ]
               }], 
               //items: [res,startDate, personStartTime, endDate, personEndTime, dockedItems]
               items: [deleteConfirmMessage, dockedItems]
           });	
       	return addMemberPanel;
       },
       createAddPicturePanel: function(vwData, itemsList, 
     			model, record, 
     			paramName, getOrderAction){
         	    
    	   this.orderId = vwData.id;
    	   this.imageData = undefined;
    	   var dataMatch = Ext.AceRoute.store.taskTypeStore.getAt(0); // get ths first item from the store
           
           var smallImage = document.getElementById('smallImage');
	       if(smallImage != null){
    		    //document.removeChild(document.getElementById("thecanvas"));
	    		smallImage.innerHTML = '';
	    		smallImage.outerHTML = '';
	    		//document.body.removeChild(smallImage);
	       }
	    	
           var image = {
   		        xtype: 'component',
   		        id: 'imagePreviewId',
   		        width: 200,
   		        height: 100,
   		        html: '<img style="display:none;width:300px;height:100px;" id="smallImage" src="" />'
//   			    getElConfig : function() {
//   			        return {
//   			        	tag: 'img',
//	    			        //src: url+'&action='+action+'&file_id=1322981209906',
//	    			        src: 'http://acerouteinfo.appspot.com/aceroute?loginref='+Ext.AceRoute.loginref+'&action='+action+'&file_id='+imageSelected.file_id
//	    			        // style: { height: 50, width: 50 },
//   			        };
//   			    }
   	        };
      	
           var addTaskPanel = null;
           var imageData = null;
           var captureButton = [{
        		xtype: 'button',
        		text:'Capture',
        		scope: this,
                handler: function() {
                	 var imagePreviewComp = Ext.getCmp('imagePreviewId');
                	 navigator.camera.getPicture(
     		    	    function (imageDataFromCam) {
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
                }
          }];
           
           var closeButton = [{
         		xtype: 'button',
         		text:'X',
                handler: function() {
                 	addTaskPanel.hide();
                }
           }];
         	
         	var saveButton = [{
         		xtype: 'button',
         		text:'Save',
                 iconMask: true,
                 stretch: false,
                 scope:this,
                 handler: function(event, btn) {
                	var imageDataToSend = imageData;
                	console.log(imageDataToSend);
                	
               	    var url = Ext.AceRoute.appUrlPost;
               	    var loginref = Ext.AceRoute.loginref;
   	      	  		var action = "savefile";
   	      	  	    	
   		      	  	var order_id = this.orderId;
   	      	  		var file_geocode = 1; 
   	      	  		var file_type = 1; // for signature
   	      	  		var file; // actual file binary
   	      	  		
   			      	Ext.Ajax.request({
   			   	        url: url,
   			   	        method: 'POST',
   			   	        params: {
   			   	        	action:	action,
   			   	        	//loginref: loginref,
   			   	        	mtoken: Ext.AceRoute.loginref,
   			       	  		order_id: order_id,
   			       	  	    file_geocode: file_geocode, // new task for this order
   			       	  	    file_type: file_type,
   			       	  		file: imageDataToSend
   			             },
   				   	     success: handleResponse,
   				   	     failure: function (response) {
   				   	    	alert("failed");
   				   	     }
   			   	     });
                 }
     		}];
     		var cancelButton = [{
         		xtype: 'button',
         		text:'Cancel',
                 iconMask: true,
                 stretch: false,
                 handler: function() {
                 	addTaskPanel.hide();
                 }
     		}];
     		var dockedItems = [new Ext.Toolbar({
     	        ui: 'light',
     	        dock: 'top',
     	        items: [captureButton, saveButton, cancelButton]	
     	    })];
     		addTaskPanel = new Ext.Panel({
     			autoRender: true,
                 floating: true,
                 centered: true,
                 modal: true,
                 width: 250,
                 styleHtmlContent: true,
                 hideOnMaskTap: false,
                 dockedItems: [{
                     xtype: 'toolbar',
                     title: 'Add Image',
                     items: [
                       {
                        	xtype: 'spacer'
                       },
                       closeButton
                     ]
                 }], 
                 items: [image,dockedItems]
             });	
         	return addTaskPanel;
       },
       createAddTaskPanel: function(vwData, itemsList, 
			model, record, 
			paramName, getOrderAction){
    	
	       this.addTask_orderId = vwData.id;
	       var dataMatch = Ext.AceRoute.store.taskTypeStore.getAt(0); // get ths first item from the store
	       this.addTask_taskTypeId = dataMatch.data.task_id;
	 	   this.addTask_orderTaskHrs = undefined;
 	   
    	var taskType = {
		    xtype: 'selectfield',
		    id: 'taskType',
            name: 'taskType',
            label: 'TaskType',
            store: Ext.AceRoute.store.taskTypeStore,
            displayField : 'task_name',
            valueField : 'task_id',
            listeners: { 
                change: { 
                	fn: function(src, value){
                		this.addTask_taskTypeId = value;
                	},
                	scope: this 
                }
            }
        };
        var personHours = {
	      xtype: 'textfield',
	      id : 'personHour',
	      name : 'personHour',
	      label: 'Hours Spent',
	      useClearIcon: true,
	      autoCapitalize : false,
	      listeners: {
	    	  keyup: { 
	               	fn: function(src, event){
	               		this.addTask_orderTaskHrs = event.target.value;
	               	},
	               	scope: this 
	               }
//		        change: function(scope, newValue, oldValue){
//		        	alert('personHours')
//		        	this.addTask_orderTaskHrs = newValue;
//		        }
	      }
      	};
        
        var addTaskPanel = null;
        
    	var closeButton = [{
        		xtype: 'button',
        		text:'X',
                handler: function() {
                	addTaskPanel.hide();
                }
    	}];
    	
    	var saveButton = [{
    		xtype: 'button',
    		text:'Save',
            iconMask: true,
            stretch: false,
            scope:this,
            handler: function(event, btn) {
          	    var url = Ext.AceRoute.appUrl;
          	    var loginref = Ext.AceRoute.loginref;
    	  		var action = "saveordertask";
    	  		var order_id = this.addTask_orderId;
    	  		var ordertask_id = 0; // new task for this order
    	  		var ordertask_hrs = this.addTask_orderTaskHrs;
    	  		var ordertask_typeid = 1; // res id, TODO
    	  		var task_id = this.addTask_taskTypeId;
    	  		var tstamp =		new Date().getTime();
    	  		
          	    this.addOrSaveTask(action, loginref, 
          	    		order_id, ordertask_id, ordertask_hrs,
          	    		ordertask_typeid, task_id, tstamp, url , itemsList,
          	    		model, record, 
          	    		paramName, getOrderAction);
            }
		}];
		var cancelButton = [{
    		xtype: 'button',
    		text:'Cancel',
            iconMask: true,
            stretch: false,
            handler: function() {
            	addTaskPanel.hide();
            }
		}];
		var dockedItems = [new Ext.Toolbar({
	        ui: 'light',
	        dock: 'top',
	        items: [saveButton, cancelButton]	
	    })];
		addTaskPanel = new Ext.Panel({
            floating: true,
            centered: true,
            modal: true,
            width: 300,
            styleHtmlContent: true,
            hideOnMaskTap: false,
            dockedItems: [{
                xtype: 'toolbar',
                title: 'Add Task',
                items: [
                  {
                   	xtype: 'spacer'
                  },
                  closeButton
                ]
            }], 
            items: [taskType,personHours,dockedItems]
        });	
    	return addTaskPanel;
    },
    createEditTaskPanel: function(taskSelected, vwData, itemsList, 
			model, record, 
			paramName, getOrderAction){
    	
	 	   this.editTask_orderId = taskSelected.order_id;
	 	   this.editTask_ordertaskId = taskSelected.ordertask_id;
	 	   this.editTask_taskTypeId = taskSelected.task_id;
	 	   this.editTask_orderTaskHrs = taskSelected.ordertask_hrs;
	 	   
	 	   var taskType = {
	 		    xtype: 'selectfield',
	 		    id: 'taskType',
	             name: 'taskType',
	             label: 'TaskType',
	             value: taskSelected.task_id,
	             store: Ext.AceRoute.store.taskTypeStore,
	             displayField : 'task_name',
	             valueField : 'task_id',
	             listeners: { 
	                 change: { 
	                 	fn: function(src, value){
	                 		this.editTask_taskTypeId = value;
	                 	},
	                 	scope: this 
	                 }
	             }
	             
	         };
	         var personHours = {
	 	      xtype: 'textfield',
	 	      id : 'personHour',
	 	      name : 'personHour',
	 	      label: 'Hours Spent',
	 	      useClearIcon: true,
	 	      autoCapitalize : false,
	 	      value: taskSelected.ordertask_hrs,
	 	      listeners: {
	 	    	 keyup: { 
		               	fn: function(src, event){
		               		this.editTask_orderTaskHrs = event.target.value;
		               	},
		               	scope: this 
		               }
	 	      }
	       	};
	         
	         var editTaskPanel = null;
	         var closeButton = [{
	         		xtype: 'button',
	         		text:'X',
	                 handler: function() {
	                 	editTaskPanel.hide();
	                 }
	     	}];
	     	var saveButton = [{
	     		 xtype: 'button',
	     		 text:'Save',
	             iconMask: true,
	             stretch: false,
	             scope:this,
	             handler: function(event, btn) {
	           	   
	            	var url = Ext.AceRoute.appUrl;
	           	    var loginref = Ext.AceRoute.loginref;
	     	  		var action = "saveordertask";
	     	  		var order_id = this.editTask_orderId;
	     	  		var ordertask_id = this.editTask_ordertaskId; // new task for this order
	     	  		var ordertask_hrs = this.editTask_orderTaskHrs;
	     	  		var ordertask_typeid = 1; // res id, TODO
	     	  		var task_id = this.editTask_taskTypeId;
	     	  		var tstamp = new Date().getTime();
	     	  		
	           	    this.addOrSaveTask(action, loginref, 
	           	    		order_id, ordertask_id, ordertask_hrs,
	           	    		ordertask_typeid, task_id, tstamp, url , itemsList,
	           	    		model, record, 
	           	    		paramName, getOrderAction);
	             }
	 		}];
	 		var cancelButton = [{
	     		xtype: 'button',
	     		text:'Cancel',
	             iconMask: true,
	             stretch: false,
	             handler: function() {
	             	editTaskPanel.hide();
	             }
	 		}];
	 		var dockedItems = [new Ext.Toolbar({
	 	        ui: 'light',
	 	        dock: 'top',
	 	        items: [saveButton, cancelButton]	
	 	    })];
	 		editTaskPanel = new Ext.Panel({
	 			 autoRender: true,
	             floating: true,
	             centered: true,
	             modal: true,
	             width: 300,
	             styleHtmlContent: true,
	             hideOnMaskTap: false,
	             dockedItems: [{
	                 xtype: 'toolbar',
	                 title: 'Edit Task',
	                 items: [
	                   {
	                    	xtype: 'spacer'
	                   },
	                   closeButton
	                 ]
	             }], 
	             items: [taskType,personHours,dockedItems]
	         });	
	     	return editTaskPanel;
	 },
	 createDeleteTaskPanel: function(taskSelected, vwOrderData, itemsList, 
   		    model, record, 
 			paramName, getOrderAction){
   	  
//   	  deleteordertmemb&ordertres_id=12345|123456
		 var orderId = taskSelected.order_id;
	 	 var ordertaskId = taskSelected.ordertask_id;
	 	   
   	     var addMemberPanel = null;
          
      	 var closeButton = [{
          		xtype: 'button',
          		text:'X',
                 handler: function() {
                 	addMemberPanel.hide();
                 }
      	  }];
      	 var deleteConfirmMessage = {
      	          xtype: 'textfield',
     	          id: 'deleteConfirmMessageId',
                 name: 'deleteConfirmMessage',
                 hideOnMaskTap: true,
//                 style: 'width: 50%', 
                 readonly: true,
                 label: 'Do you want to delete?' 
 	        };
      	  var deleteButton = [{
      		   xtype: 'button',
      		   text:'Yes',
              iconMask: true,
              stretch: false,
              scope:this,
              handler: function(event, btn) {
            	    var url = Ext.AceRoute.appUrl;
            	    var action = 'deleteordertask';
            	    this.deleteTask(url, action , orderId, ordertaskId, itemsList, model, record, 
               			paramName, getOrderAction, addMemberPanel);
              }
  		 }];
  		var cancelButton = [{
	       	   xtype: 'button',
	       	   text:'Cancel',
              iconMask: true,
              stretch: false,
              handler: function() {
             	 addMemberPanel.hide();
              }
  		}];
  		
  		var dockedItems = [new Ext.Toolbar({
  	        ui: 'light',
  	        dock: 'top',
  	        items: [deleteButton, cancelButton]	
  	    })];
  		
  		addMemberPanel = new Ext.Panel({
              floating: true,
              centered: true,
              modal: true,
              width: 300,
              defaults: {
                  labelAlign: 'left',
                  labelWidth: '100%',
                  style: 'border-width: 0px',
                  border: false
              },
              styleHtmlContent: true,
              hideOnMaskTap: false,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Delete Task',
                  items: [
                    {
                     	xtype: 'spacer'
                    },
                    closeButton
                  ]
              }], 
              //items: [res,startDate, personStartTime, endDate, personEndTime, dockedItems]
              items: [deleteConfirmMessage, dockedItems]
          });	
      	return addMemberPanel;
    },
    
    createAddResPanel: function(vwData, itemsList, model, record, 
			paramName, getOrderAction){
    	
        var orderId = vwData.id;
        var firstResId = Ext.AceRoute.store.resourceStore.getAt(0); // get ths first item from the store
        var orderResId = 0;
  	    var resIdSelected = firstResId;
  	    var startTime, endTime;
  	    
  	    //var commonUtil = new Ext.AceRoute.util.CommonUtil();
  	    var resStartDateValue = CommonUtil.convertToUTCDateStr(vwData.start_date);
  	    var resEndDateValue = CommonUtil.convertToUTCDateStr(vwData.end_date);
		    
  	    var currentDate = new Date();
  	  
     	var res = {
 		     xtype: 'selectfield',
 		     id: 'resId',
             name: 'resName',
             label: 'Member',
             store: Ext.AceRoute.store.resourceStore,
             displayField : 'res_displayname',
             valueField : 'res_id',
             listeners: { 
                 change: { 
                 	fn: function(src, value){
                 		resIdSelected = value;
                 	},
                 	scope: this 
                 }
             }
         };
     	
     	 var startDate = {
     	        xtype: 'datepickerfield',
    	        id: 'resStartDateId',
                name: 'resStartDate',
                useClearIcon: true,
                hideOnMaskTap: true,
                height: 20,
                picker: {
                    slots: [ 'month', 'day','year' ],
                    yearFrom: currentDate.getFullYear()
                },
                label: 'StartDate' 
	        };
     	
         var personStartTime = {
                xtype: 'schpickerfield',
	            name: 'resStartTime',
	            id: 'resStartTimeId', 
	            label: 'Start Time',
	            value: startTime,
	            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
	                                           // if the could names do not match then, it will not be replaced.
	            picker: {
	                useTitles: true,
                    slots: [
	                    {
	                        name : 'hour',
	                        title: 'Hour',
	                        data : [
	                            {text: '0', value: '0'},
	                            {text: '1', value: '1'},
	                            {text: '2', value: '2'},
	                            {text: '3', value: '3'},
	                            {text: '4', value: '4'},
	                            {text: '5', value: '5'},
                                {text: '6', value: '6'},
	                            {text: '7', value: '7'},
                                {text: '8', value: '8'},
	                            {text: '9', value: '9'},
	                            {text: '10', value: '10'},
                                {text: '11', value: '11'},
                                {text: '12', value: '12'}
	                        ]
                         }, {
	                        name : 'mins',
                            title: 'Min',
	                        data : [
	                            {text: '00', value: '00'},
	                            {text: '05', value: '05'},
	                            {text: '10', value: '10'},
	                            {text: '15', value: '15'},
	                            {text: '20', value: '20'},
	                            {text: '25', value: '25'},
                                {text: '30', value: '30'},
                                {text: '35', value: '35'},
                                {text: '40', value: '40'},
	                            {text: '45', value: '45'},
	                            {text: '50', value: '50'},
	                            {text: '55', value: '55'}
	                        ]
	                    }, 
	                    {
	                        name : 'ampm',
                            title: 'AM/PM',
	                        data : [
                                {text: 'am', value: 'am'},
	                            {text: 'pm', value: 'pm'}
                            ]
	                    }
	                ]
	            }
             };
         
         var endDate = {
      	        xtype: 'datepickerfield',
     	        id: 'resEndDateId',
                 name: 'resEndDate',
                 useClearIcon: true,
                 hideOnMaskTap: true,
                 height: 20,
                 picker: {
                     slots: [ 'month', 'day','year' ],
                     yearFrom: currentDate.getFullYear()
                 },
                 label: 'EndDate' 
 	        };
         
         var personEndTime = {
                xtype: 'schpickerfield',
	            name: 'resEndTime',
	            id: 'resEndTimeId', 
	            label: 'End Time',
	            value: endTime,
	            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
	                                           // if the could names do not match then, it will not be replaced.
	            picker: {
	                useTitles: true,
                    slots: [
	                    {
	                        name : 'hour',
	                        title: 'Hour',
	                        data : [
	                            {text: '0', value: '0'},
	                            {text: '1', value: '1'},
	                            {text: '2', value: '2'},
	                            {text: '3', value: '3'},
	                            {text: '4', value: '4'},
	                            {text: '5', value: '5'},
                                {text: '6', value: '6'},
	                            {text: '7', value: '7'},
                                {text: '8', value: '8'},
	                            {text: '9', value: '9'},
	                            {text: '10', value: '10'},
                                {text: '11', value: '11'},
                                {text: '12', value: '12'}
	                        ]
                         }, {
	                        name : 'mins',
                            title: 'Min',
	                        data : [
	                            {text: '00', value: '00'},
	                            {text: '05', value: '05'},
	                            {text: '10', value: '10'},
	                            {text: '15', value: '15'},
	                            {text: '20', value: '20'},
	                            {text: '25', value: '25'},
                                {text: '30', value: '30'},
                                {text: '35', value: '35'},
                                {text: '40', value: '40'},
	                            {text: '45', value: '45'},
	                            {text: '50', value: '50'},
	                            {text: '55', value: '55'}
	                        ]
	                    }, 
	                    {
	                        name : 'ampm',
                            title: 'AM/PM',
	                        data : [
                                {text: 'am', value: 'am'},
	                            {text: 'pm', value: 'pm'}
                            ]
	                    }
	                ]
	            }
             };
         
        var addMemberPanel = null;
         
     	var closeButton = [{
         		xtype: 'button',
         		text:'X',
                handler: function() {
                	addMemberPanel.hide();
                }
     	}];
     	
     	var saveButton = [{
     		xtype: 'button',
     		text:'Save',
             iconMask: true,
             stretch: false,
             scope:this,
             handler: function(event, btn) {
           	    var url = Ext.AceRoute.appUrl;
           	    var action = 'saveordertmemb';
           	    
//      		    var resStartTimeValue = Ext.getCmp('resStartTimeId').getValue();
//      		    var resEndTimeValue = Ext.getCmp('resEndTimeId').getValue();
           	    this.addOrSaveResource(action, url, orderId, 
           	    		orderResId, resIdSelected, 
           	    		resStartDateValue,  
           	    		resEndDateValue, itemsList, 
           	    		model, record, 
            			paramName, getOrderAction, vwData);
             }
 		}];
 		var cancelButton = [{
     		xtype: 'button',
     		text:'Cancel',
             iconMask: true,
             stretch: false,
             handler: function() {
            	 addMemberPanel.hide();
             }
 		}];
 		
 		var dockedItems = [new Ext.Toolbar({
 	        ui: 'light',
 	        dock: 'top',
 	        items: [saveButton, cancelButton]	
 	    })];
 		
 		addMemberPanel = new Ext.Panel({
             floating: true,
             centered: true,
             modal: true,
             width: 300,
             styleHtmlContent: true,
             hideOnMaskTap: false,
             dockedItems: [{
                 xtype: 'toolbar',
                 title: 'Add Member',
                 items: [
                   {
                    	xtype: 'spacer'
                   },
                   closeButton
                 ]
             }], 
             //items: [res,startDate, personStartTime, endDate, personEndTime, dockedItems]
             //items: [res, personStartTime, personEndTime, dockedItems]
             items: [res, dockedItems]
         });	
     	return addMemberPanel;
     },
     createEditResPanel: function(taskSelected, vwOrderData, itemsList, model, record, 
 			paramName, getOrderAction){
    	
//    	 taskSelected: Object
//    	 end_dateWithoutTime: "11/11/2011"
//    	 end_time: "1321041600000"
//    	 end_timeampm: "12:0 pm"
//    	 order_id: "1321745542907"
//    	 ordertres_id: "1322462482716"
//    	 res_id: "1311635474311"
//    	 start_dateWithoutTime: "11/11/2011"
//    	 start_time: "1321038000000"
//    	 start_time_ampm: "11:0 am"
//    	 subt_by: "appengine"
    		 
         var orderId = taskSelected.order_id;
         var orderResId = taskSelected.ordertres_id;
   	     var resIdSelected = taskSelected.res_id;
   	     
//   	     var startDateStr = taskSelected.start_dateWithoutTime;
//   	     var endDateStr = taskSelected.end_dateWithoutTime;
   	     //var commonUtil = new Ext.AceRoute.util.CommonUtil();
	     var resStartDateValue = CommonUtil.convertToUTCDateStr(vwOrderData.start_date);
	     var resEndDateValue = CommonUtil.convertToUTCDateStr(vwOrderData.end_date);
	     
	     var startDate = new Date(resStartDateValue);
   	     var endDate = new Date(resEndDateValue);
		
   	     var startTime = taskSelected.start_time_ampm;
   	     var endTime = taskSelected.end_time_ampm;
   	    	 
      	 var res = {
  		     xtype: 'selectfield',
  		     id: 'resId',
              name: 'resName',
              label: 'Member',
              store: Ext.AceRoute.store.resourceStore,
              displayField : 'res_first',
              valueField : 'res_id',
              value: resIdSelected,
              listeners: { 
                  change: { 
                  	fn: function(src, value){
                  		resIdSelected = value;
                  	},
                  	scope: this 
                  }
              }
          };
      	
      	 var startDate = {
      	        xtype: 'datepickerfield',
     	        id: 'resStartDateId',
                 name: 'resStartDate',
                 useClearIcon: true,
                 hideOnMaskTap: true,
                 height: 20,
                // value: startDate,
                 picker: {
                     slots: [ 'month', 'day','year' ],
                     yearFrom: startDate.getFullYear()
                 },
                 label: 'StartDate' 
 	        };
      	
          var personStartTime = {
                 xtype: 'schpickerfield',
 	            name: 'resStartTime',
 	            id: 'resStartTimeId', 
 	            label: 'Start Time',
 	            value: startTime,
 	            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
 	                                           // if the could names do not match then, it will not be replaced.
 	            picker: {
 	                useTitles: true,
                     slots: [
 	                    {
 	                        name : 'hour',
 	                        title: 'Hour',
 	                        data : [
 	                            {text: '0', value: '0'},
 	                            {text: '1', value: '1'},
 	                            {text: '2', value: '2'},
 	                            {text: '3', value: '3'},
 	                            {text: '4', value: '4'},
 	                            {text: '5', value: '5'},
                                 {text: '6', value: '6'},
 	                            {text: '7', value: '7'},
                                 {text: '8', value: '8'},
 	                            {text: '9', value: '9'},
 	                            {text: '10', value: '10'},
                                 {text: '11', value: '11'},
                                 {text: '12', value: '12'}
 	                        ]
                          }, {
 	                        name : 'mins',
                             title: 'Min',
 	                        data : [
 	                            {text: '00', value: '00'},
	                            {text: '05', value: '05'},
	                            {text: '10', value: '10'},
	                            {text: '15', value: '15'},
	                            {text: '20', value: '20'},
	                            {text: '25', value: '25'},
                                {text: '30', value: '30'},
                                {text: '35', value: '35'},
                                {text: '40', value: '40'},
	                            {text: '45', value: '45'},
	                            {text: '50', value: '50'},
	                            {text: '55', value: '55'}
 	                        ]
 	                    }, 
 	                    {
 	                        name : 'ampm',
                             title: 'AM/PM',
 	                        data : [
                                 {text: 'am', value: 'am'},
 	                            {text: 'pm', value: 'pm'}
                             ]
 	                    }
 	                ]
 	            }
              };
          
          var endDate = {
       	        xtype: 'datepickerfield',
      	        id: 'resEndDateId',
                  name: 'resEndDate',
                  useClearIcon: true,
                  hideOnMaskTap: true,
                  height: 20,
                  //value: endDate,
                  picker: {
                      slots: [ 'month', 'day','year' ],
                      yearFrom: endDate.getFullYear()
                  },
                  label: 'EndDate' 
  	        };
          
          var personEndTime = {
                 xtype: 'schpickerfield',
 	            name: 'resEndTime',
 	            id: 'resEndTimeId', 
 	            label: 'End Time',
 	            value: endTime,
 	            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
 	                                           // if the could names do not match then, it will not be replaced.
 	            picker: {
 	                useTitles: true,
                     slots: [
 	                    {
 	                        name : 'hour',
 	                        title: 'Hour',
 	                        data : [
 	                            {text: '0', value: '0'},
 	                            {text: '1', value: '1'},
 	                            {text: '2', value: '2'},
 	                            {text: '3', value: '3'},
 	                            {text: '4', value: '4'},
 	                            {text: '5', value: '5'},
                                 {text: '6', value: '6'},
 	                            {text: '7', value: '7'},
                                 {text: '8', value: '8'},
 	                            {text: '9', value: '9'},
 	                            {text: '10', value: '10'},
                                 {text: '11', value: '11'},
                                 {text: '12', value: '12'}
 	                        ]
                          }, {
 	                        name : 'mins',
                             title: 'Min',
 	                        data : [
 	                            {text: '00', value: '00'},
	                            {text: '05', value: '05'},
	                            {text: '10', value: '10'},
	                            {text: '15', value: '15'},
	                            {text: '20', value: '20'},
	                            {text: '25', value: '25'},
                                {text: '30', value: '30'},
                                {text: '35', value: '35'},
                                {text: '40', value: '40'},
	                            {text: '45', value: '45'},
	                            {text: '50', value: '50'},
	                            {text: '55', value: '55'}
 	                        ]
 	                    }, 
 	                    {
 	                        name : 'ampm',
                             title: 'AM/PM',
 	                        data : [
                                 {text: 'am', value: 'am'},
 	                            {text: 'pm', value: 'pm'}
                             ]
 	                    }
 	                ]
 	            }
              };
          
         var addMemberPanel = null;
          
      	var closeButton = [{
          		xtype: 'button',
          		text:'X',
                 handler: function() {
                 	addMemberPanel.hide();
                 }
      	}];
      	
      	var saveButton = [{
      		xtype: 'button',
      		text:'Save',
              iconMask: true,
              stretch: false,
              scope:this,
              handler: function(event, btn) {
            	    var url = Ext.AceRoute.appUrl;
            	    var action = 'saveorder';
            	    
            	    var resStartTimeValue = Ext.getCmp('resStartTimeId').getValue();
	       		    var resEndTimeValue = Ext.getCmp('resEndTimeId').getValue();
            	    this.addOrSaveResource(action, url, orderId, 
            	    		orderResId, resIdSelected, 
            	    		resStartDateValue, resStartTimeValue, 
            	    		resEndDateValue, resEndTimeValue, itemsList, 
            	    		model, record, 
                			paramName, getOrderAction);
              }
  		}];
  		var cancelButton = [{
      		xtype: 'button',
      		text:'Cancel',
              iconMask: true,
              stretch: false,
              handler: function() {
             	 addMemberPanel.hide();
              }
  		}];
  		
  		var dockedItems = [new Ext.Toolbar({
  	        ui: 'light',
  	        dock: 'top',
  	        items: [saveButton, cancelButton]	
  	    })];
  		
  		addMemberPanel = new Ext.Panel({
  			  autoRender: true,
              floating: true,
              centered: true,
              modal: true,
              width: 300,
              styleHtmlContent: true,
              hideOnMaskTap: false,
              dockedItems: [{
                  xtype: 'toolbar',
                  title: 'Update Member',
                  items: [
                    {
                     	xtype: 'spacer'
                    },
                    closeButton
                  ]
              }], 
              //items: [res,startDate, personStartTime, endDate, personEndTime, dockedItems]
              items: [res, personStartTime, personEndTime, dockedItems]
          });	
      	return addMemberPanel;
      },
      createDeleteResPanel: function(taskSelected, vwOrderData, itemsList, 
    		  model, record){
    	  
//    	  deleteordertmemb&ordertres_id=12345|123456
    	  var orderId = vwOrderData.id;
          var orderResId = taskSelected.res_id;
    	  var addMemberPanel = null;
           
       	  var closeButton = [{
           		xtype: 'button',
           		text:'X',
                  handler: function() {
                  	addMemberPanel.hide();
                  }
       	  }];
       	  var deleteConfirmMessage = {
       	          xtype: 'textfield',
      	          id: 'deleteConfirmMessageId',
                  name: 'deleteConfirmMessage',
                  hideOnMaskTap: true,
//                  style: 'width: 50%', 
                  readonly: true,
                  label: 'Do you want to delete?' 
  	        };
       	  var deleteButton = [{
       		   xtype: 'button',
       		   text:'Yes',
               iconMask: true,
               stretch: false,
               scope:this,
               handler: function(event, btn) {
             	    var url = Ext.AceRoute.appUrl;
             	    this.deleteResource(url, vwOrderData, orderId, orderResId, itemsList);
               }
   		 }];
   		var cancelButton = [{
	       	   xtype: 'button',
	       	   text:'Cancel',
               iconMask: true,
               stretch: false,
               handler: function() {
              	 addMemberPanel.hide();
               }
   		}];
   		
   		var dockedItems = [new Ext.Toolbar({
   	        ui: 'light',
   	        dock: 'top',
   	        items: [deleteButton, cancelButton]	
   	    })];
   		
   		addMemberPanel = new Ext.Panel({
               floating: true,
               centered: true,
               modal: true,
               width: 300,
               defaults: {
                   labelAlign: 'left',
                   labelWidth: '100%',
                   style: 'border-width: 0px',
                   border: false
               },
               styleHtmlContent: true,
               hideOnMaskTap: false,
               dockedItems: [{
                   xtype: 'toolbar',
                   title: 'Delete Member',
                   items: [
                     {
                      	xtype: 'spacer'
                     },
                     closeButton
                   ]
               }], 
               //items: [res,startDate, personStartTime, endDate, personEndTime, dockedItems]
               items: [deleteConfirmMessage, dockedItems]
           });	
       	return addMemberPanel;
       },
       addOrSaveResource: function(action, url, orderId, 
	    		orderResId, resIdSelected, 
  	    		resStartDateValue, 
  	    		resEndDateValue, itemsList,
  	    		model, record, 
  	    		paramName, getOrderAction, vwData){
    	   
//       addOrSaveResource: function(action, url, orderId, 
//	    		orderResId, resIdSelected, 
//   	    		resStartDateValue, resStartTimeValue, 
//   	    		resEndDateValue, resEndTimeValue, itemsList,
//   	    		model, record, 
//    			paramName, getOrderAction){
    	 
//    	//var commonUtil = new Ext.AceRoute.util.CommonUtil();
// 		
//    	var resStartUtc = CommonUtil.
//    				convertToUTCFromStartAndEndDate(resStartDateValue, resStartTimeValue );
//     	var resEndUtc = CommonUtil.
//     				convertToUTCFromStartAndEndDate(resEndDateValue, resEndTimeValue );
//     	//var commonUtil = new Ext.AceRoute.util.CommonUtil();
//    		
//       	var resStartUtc = CommonUtil.
//       				convertToUTCFromStartAndEndDate(resStartDateValue, resStartTimeValue );
//        	var resEndUtc = CommonUtil.
//        				convertToUTCFromStartAndEndDate(resEndDateValue, resEndTimeValue );
//        	
//        	var resStartTime = (new Date(resStartUtc)).getTime();
//       	var resEndTime = (new Date(resEndUtc)).getTime();
//       	var arguments = {addOrSaveResource
//   			toRefreshObj: itemsList,
//   			orderId: orderId,
//   			action: action,
//   			model: model,
//   			record: record,
//   			paramName: paramName,
//   			getOrderAction: getOrderAction,
//   			functionToInvoke: this.refreshData
//           };
//       	
//      	    Ext.Ajax.request({
//      	        url: url,
//      	        method: 'POST',
//      	        params: {
//      	        	loginref:   Ext.AceRoute.loginref,
//          	  		action:		"saveordertmemb",
//          	  	    end_time:   resEndTime,
//          	  		order_id:	orderId,
//          	  	    ordertres_id:	orderResId, // new task for this order
//          	  	    res_id: resIdSelected,
//          	  	    start_time: resStartTime
//                },
//                argument: arguments,
//                success: this.saveResSuccessResponseHandler,
//                faliure: this.saveResFailureResponseHandler
//      	    });
//     	var resStartTime = (new Date(resStartUtc)).getTime();
//    	var resEndTime = (new Date(resEndUtc)).getTime();
//    	var arguments = {
//			toRefreshObj: itemsList,
//			orderId: orderId,ource
//			action: action,
//			model: model,
//			record: record,
//			paramName: paramName,
//			getOrderAction: getOrderAction,
//			functionToInvoke: this.refreshData
//        };
//    	
//   	    Ext.Ajax.request({
//   	        url: url,
//   	        method: 'POST',
//   	        params: {
//   	        	loginref:   Ext.AceRoute.loginref,
//       	  		action:		"saveordertmemb",
//       	  	    end_time:   resEndTime,
//       	  		order_id:	orderId,
//       	  	    ordertres_id:	orderResId, // new task for this order
//       	  	    res_id: resIdSelected,
//       	  	    start_time: resStartTime
//             },
//             argument: arguments,
//             success: this.saveResSuccessResponseHandler,
//             faliure: this.saveResFailureResponseHandler
//   	    });
    	   
    	   
//    	var tsSt = CommonUtil.convertToUTC(new Date());
//       	indexOfZero = tsSt.indexOf("-00");
//   	    var tsStampSub = tsSt.substring(0,indexOfZero);
//   	    tsStampSub = tsStampSub+"GMT+0000";
//   	    
//       	console.log(' tsStampSub '+tsStampSub);
//       	
//       	var tsStamp = new Date(tsStampSub).getTime();
//       	
//       	var ajaxcallObj = {
//   			action:			'saveorder',
//			loginref:		Ext.AceRoute.loginref,
//			mtoken: 		Ext.AceRoute.loginref,
//			order_id:		orderId,
//			res_addid:		"88001"//resource_addid
//       	};
//   	
//       	Ext.Ajax.request({
//      	        url: url,
//      	        method: 'POST',
//      	        params: ajaxcallObj,
//                success: handleResponse
//      	    });
    	   
    	   var res_addid = '';
    	   if(typeof vwData.res_addid !== "undefined" && vwData.res_addid !== ""){
    		   if(typeof resIdSelected.data !== 'undefined' && typeof resIdSelected.data.res_id !== 'undefined'){
    			   res_addid = vwData.res_addid + "|" + resIdSelected.data.res_id;
    		   }else{
    			   res_addid = vwData.res_addid + "|" + resIdSelected;
    		   }
    	   }else{
    		   res_addid = resIdSelected; //resIdSelected.data.res_id;
    	   }
    	   
    	   var cust_contactid = vwData.cust_contactid;
			var cust_id = vwData.cust_id;
			var cust_siteid = vwData.cust_siteid;
			var dragged = false;
			var event_geocode = vwData.event_geocode;
			var loginRef = Ext.AceRoute.loginref;
			var order_flg = '0|';
			var order_id = vwData.id;
			var order_inst = vwData.order_inst;
			var order_name  = vwData.order_name;
			var order_notes = "Test";
			var order_po = vwData.order_po;
			var order_prtid = vwData.order_prtid;
			var order_recid = vwData.order_recid;
			var order_typeid = vwData.order_typeid;
			var order_wkfid = vwData.order_wkfid;
			var res_id = vwData.res_id;
			var reset = 0;
			
			var type = 'false';
			var url = Ext.AceRoute.appUrlPost;
        	var wkfid_upd = 0;
			
        	this.addOrSaveOrder(cust_contactid,
        			cust_id,
        			cust_siteid ,
        			dragged,
        			event_geocode,
        			loginRef,
        			order_flg,
        			order_id,
        			order_inst,
        			order_name,
        			order_notes,
        			order_po,
        			order_prtid,
        			order_recid,
        			order_typeid,
        			order_wkfid,
        			reset,
        			res_id,
        			res_addid,
        			type,
        			url,
        			wkfid_upd);
    	   
     },
     deleteResource: function(url, vwData, orderId, orderResId, itemsList){
//    	 var arguments = {
//			toRefreshObj: itemsList,
//			orderId: orderId
//		 };
//    	 Ext.Ajax.request({
//		        url: url,
//		        method: 'POST',
//		        params: {
//		        	loginref:   Ext.AceRoute.loginref,
//	    	  		action:		"deleteordertmemb",
//	    	  	    ordertres_id:	orderResId // new task for this order
//	            },
//	            argument: arguments,
//	            success: this.deleteResSuccessResponseHandler,
//	            faliure: this.deleteResFailureResponseHandler
//		 });
    	var res_addid = vwData.res_addid; //default
    	var newResAddId = '';
    	console.log(" before delete, res_addid "+res_addid);
    	if(typeof vwData.res_addid !== "undefined"){
    		if(vwData.res_addid.indexOf(orderResId) >= 0){
    			var index = vwData.res_addid.indexOf(orderResId);
    			if(index >= 0){
    				var resources = vwData.res_addid.split("|");
    				for(i=0;i<resources.length;i++){
    					if(resources[i] !== orderResId){
    						newResAddId += resources[i] + "|";
    					}
    				}
    			}
    		}
    	}
    	console.log(" after delete, newResAddId "+newResAddId);
    	res_addid = newResAddId;
    	var cust_contactid = vwData.cust_contactid;
		var cust_id = vwData.cust_id;
		var cust_siteid = vwData.cust_siteid;
		var dragged = false;
		var event_geocode = vwData.event_geocode;
		var loginRef = Ext.AceRoute.loginref;
		var order_flg = '0|';
		var order_id = vwData.id;
		var order_inst = vwData.order_inst;
		var order_name  = vwData.order_name;
		var order_notes = "Test";
		var order_po = vwData.order_po;
		var order_prtid = vwData.order_prtid;
		var order_recid = vwData.order_recid;
		var order_typeid = vwData.order_typeid;
		var order_wkfid = vwData.order_wkfid;
		var res_id = vwData.res_id;
		var reset = 0;
		
		var type = 'false';
		var url = Ext.AceRoute.appUrlPost;
     	var wkfid_upd = 0;
			
     	this.addOrSaveOrder(cust_contactid,
     			cust_id,
     			cust_siteid ,
     			dragged,
     			event_geocode,
     			loginRef,
     			order_flg,
     			order_id,
     			order_inst,
     			order_name,
     			order_notes,
     			order_po,
     			order_prtid,
     			order_recid,
     			order_typeid,
     			order_wkfid,
     			reset,
     			res_id,
     			res_addid,
     			type,
     			url,
     			wkfid_upd);
    	 
	 },
	 addOrSavePart: function(action, loginref, order_id, 
			 orderpart_id, orderpart_qty, 
			 orderpart_typeid, part_id, 
			 tstamp, url, 
			 itemsList, model, 
			 record, paramName, getOrderAction){
 	 
	 	 var arguments = {
				toRefreshObj: itemsList,
				orderId: order_id,
				action: action,
				model: model,
				record: record,
				paramName: paramName,
				getOrderAction: getOrderAction,
				functionToInvoke: this.refreshData
	     };
	 	
	 	 Ext.Ajax.request({
   	        url: url,
   	        method: 'POST',
   	        params: {
   	        	action:	action,
   	        	//loginref: loginref,
   	        	mtoken: Ext.AceRoute.loginref,
       	  		order_id: order_id,
       	  		orderpart_id: orderpart_id, // new task for this order
       	  	    orderpart_qty: orderpart_qty,
       	  		orderpart_typeid: orderpart_typeid, // res id, TODO
       	  		part_id: part_id,
       	  		tstamp:	tstamp	
             },
             argument: arguments,
             success: this.savePartSuccessResponseHandler,
             faliure: this.savePartFailureResponseHandler
   	     });
	  },
	  deletePart: function(url, action , orderId, orderpartId, itemsList, model, record, 
    			paramName, getOrderAction){
		  
		 var arguments = {
			toRefreshObj: itemsList,
			orderId: orderId,
			action: action,
			model: model,
			record: record,
			paramName: paramName,
			getOrderAction: getOrderAction,
			functionToInvoke: this.refreshData
		 };
		  
    	 Ext.Ajax.request({
		        url: url,
		        method: 'POST',
		        params: {
		        	//loginref: Ext.AceRoute.loginref,
		        	mtoken: Ext.AceRoute.loginref,
	    	  		action:	action,
	    	  		orderpart_id: orderpartId // new task for this order
	            },
	            argument: arguments,
	            success: this.deletePartSuccessResponseHandler,
	            faliure: this.deletePartFailureResponseHandler
		 });
	  },
	  addOrSaveTask: function(action, loginref, 
		    		order_id, ordertask_id, ordertask_hrs,
		    		ordertask_typeid, task_id, tstamp, url , itemsList,
		    		model, record, 
		    		paramName, getOrderAction
	    		){
	 	 
		 	 var arguments = {
					toRefreshObj: itemsList,
					orderId: order_id,
					action: action,
					model: model,
					record: record,
					paramName: paramName,
					getOrderAction: getOrderAction,
					functionToInvoke: this.refreshData 
		     };
		 	
		 	 Ext.Ajax.request({
	   	        url: url,
	   	        method: 'POST',
	   	        params: {
	   	        	action:	action,
	   	        	//loginref: loginref,
	   	        	mtoken: Ext.AceRoute.loginref,
	       	  		order_id: order_id,
	       	  	    ordertask_id: ordertask_id, // new task for this order
	       	  	    ordertask_hrs: ordertask_hrs,
	       	  	    ordertask_typeid: ordertask_typeid, // res id, TODO
	       	        task_id: task_id,
	       	  		tstamp:	tstamp
	             },
	             argument: arguments,
	             success: this.saveTaskSuccessResponseHandler,
	             faliure: this.saveTaskFailureResponseHandler
	   	     });
	  },
	  deleteTask: function(url, action , orderId, ordertaskId, itemsList, model, record, 
     			paramName, getOrderAction, addMemberPanel){
		  
		  var arguments = {
				toRefreshObj: itemsList,
				orderId: orderId,
				action: action,
				model: model,
				record: record,
				paramName: paramName,
				getOrderAction: getOrderAction,
				functionToInvoke: this.refreshData,
				panel: addMemberPanel
		  };
		  
	      Ext.Ajax.request({
			        url: url,
			        method: 'POST',
			        params: {
			        	//loginref:   Ext.AceRoute.loginref,
			        	mtoken: Ext.AceRoute.loginref,
		    	  		action:		action,
		    	  	    ordertask_id:	ordertaskId // new task for this order
		            },
		            argument: arguments,
		            success: this.deleteTaskSuccessResponseHandler,
		            faliure: this.deleteTaskFailureResponseHandler
			 });
		 },
		 deleteImage: function(url, action , orderId, file_id, itemsList, model, record, 
	     			paramName, getOrderAction, addMemberPanel,filterPropertyName, filterPropertyValue){
			  
			  var arguments = {
					toRefreshObj: itemsList,
					orderId: orderId,
					action: action,
					model: model,
					record: record,
					paramName: paramName,
					getOrderAction: getOrderAction,
					functionToInvoke: this.refreshData,
					panel: addMemberPanel,
					filterPropertyName: filterPropertyName, 
					filterPropertyValue: filterPropertyValue
			  };
			  
		      Ext.Ajax.request({
				        url: url,
				        method: 'POST',
				        params: {
				        	//loginref:   Ext.AceRoute.loginref,
				        	mtoken: Ext.AceRoute.loginref,
			    	  		action:		action,
			    	  		file_id:	file_id // new task for this order
			            },
			            argument: arguments,
			            success: this.deleteImageSuccessResponseHandler,
			            faliure: this.deleteTaskFailureResponseHandler
		     });
	  },
			 
	  deleteImageSuccessResponseHandler: function(){
    	 var functionToInvoke = this.argument.functionToInvoke;
    	 var panel = this.argument.panel;
 		 functionToInvoke.apply(this, [this.argument]); // notice to handle "this" properly
 		 var msg = new Ext.MessageBox({
 			buttons: Ext.MessageBox.OKCANCEL, 
 			modal : true
 		 });
 		
 		 msg.show({
 			msg: 'Deleted Successfully.'
 		 });
      },		 
      saveResSuccessResponseHandler: function(){
    	  var functionToInvoke = this.argument.functionToInvoke;
  		  functionToInvoke.apply(this, [this.argument]); // notice to handle "this" properly
//  		  Ext.Msg.alert('', 'Saved Successfully.', Ext.emptyFn);
  		  var msg = new Ext.MessageBox({
 			buttons: Ext.MessageBox.OKCANCEL, 
 			modal : true
 		  });
 		
 		  msg.show({
 			msg: 'Saved Successfully.'
 		  });
      }, 
      saveResFailureResponseHandler: function(){
    	  Ext.Msg.alert('', 'Save Failed.', Ext.emptyFn);
      },
      deleteResSuccessResponseHandler: function(){
      	var orderId = this.argument.orderId;
      	var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
      	
      	var orderResXmlData = ajaxUtil.invokeUrlGetXml(
      			Ext.AceRoute.appUrl+"?action=getordertmemb&order_id="+orderId);
      	
      	var orderResStoreTemp
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: 'OrderResource',
			    data : orderResXmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: 'ordertmemb'
			        }
			    }
			});
			
         var orderResStore = this.argument.toRefreshObj.store; //Ext.StoreMgr.get('customerSiteStore');
         orderResStore.removeAll();
         orderResStoreTemp.each(function(record){
    		  orderResStore.add(record.copy());
	     });
         Ext.Msg.alert('', 'Deleted Successfully.', Ext.emptyFn);
     },
     deleteResFailureResponseHandler: function(){
    	 Ext.Msg.alert('', 'Deletion Failed.', Ext.emptyFn);
     },
     saveTaskSuccessResponseHandler: function(){
    	 var functionToInvoke = this.argument.functionToInvoke;
 		 functionToInvoke.apply(this, [this.argument]); // notice to handle "this" properly
//    	 Ext.Msg.alert('', 'Saved Successfully.', Ext.emptyFn);
 		 var msg = new Ext.MessageBox({
 			buttons: Ext.MessageBox.OKCANCEL, 
 			modal : true
 		 });
 		
 		 msg.show({
 			msg: 'Saved Successfully.'
 		 });
     },
     saveTaskFailureResponseHandler: function(){
    	 Ext.Msg.alert('', 'Save Failed.', Ext.emptyFn);
     },
     deleteTaskSuccessResponseHandler: function(){
    	 var functionToInvoke = this.argument.functionToInvoke;
    	 var panel = this.argument.panel;
    	 
 		 functionToInvoke.apply(this, [this.argument]); // notice to handle "this" properly
 		 Ext.Msg.alert('', 'Deleted Successfully.', function(){
 			panel.hide();
 		 });
      },
     savePartSuccessResponseHandler: function(){
    	 var functionToInvoke = this.argument.functionToInvoke;
 		 functionToInvoke.apply(this, [this.argument]); // notice to handle "this" properly
// 		 Ext.Msg.alert('', 'Saved Successfully.', Ext.emptyFn).on('hide', 
// 				function() {    
//				Ext.getBody().mask();
//			}, null, {single: true}); 
 		var msg = new Ext.MessageBox({
 			buttons: Ext.MessageBox.OKCANCEL, 
 			modal : true
 		});
 		
 		msg.show({
 			msg: 'Saved Successfully.'
 		});
 		
// 		msg.confirm("Security", "111Vikas Are you sure you do not want a security code?<p>If so press 'Yes' to not set a security code.",
//			function(btn, text){
//				if (btn == 'yes'){
//					pthis.hide(); // hide the modal panel
//				}
// 		});	
 		 
// 		Ext.MessageBox.show({
// 		   title:    'Verification',
// 		   msg:      'Please approve by checking the box below.<br /><br /><input id="approval" type="checkbox" /> I approve this change',
// 		   buttons:  Ext.MessageBox.OKCANCEL,
// 		   fn: function(btn) {
// 		      if( btn == 'ok') {
// 		         if (Ext.get('approval').getValue() == 'on'){
// 		            Ext.MessageBox.alert('Demo', 'Approval acquired');
// 		         } else {
// 		            Ext.MessageBox.alert('Demo', 'Approval not acquired');
// 		         }
// 		      }
// 		   }
// 		});
 		
     },
     savePartFailureResponseHandler: function(){
    	 //Ext.Msg.alert('', 'Save Failed.', Ext.emptyFn);
    	 var msg = new Ext.MessageBox({
  			buttons: Ext.MessageBox.OKCANCEL, 
  			modal : true
  		});
  		
  		msg.show({
  			msg: 'Saved Failed.'
  		});
     },
     deletePartSuccessResponseHandler: function(){
    	 var functionToInvoke = this.argument.functionToInvoke;
 		 functionToInvoke.apply(this, [this.argument]); // notice to handle "this" properly
// 		 Ext.Msg.alert('', 'Deleted Successfully.', Ext.emptyFn);
 		var msg = new Ext.MessageBox({
 			buttons: Ext.MessageBox.OKCANCEL, 
 			modal : true
 		});
 		
 		msg.show({
 			msg: 'Deleted Successfully.'
 		});
      },
     refreshData: function(arg){
    	 var orderId = arg.orderId;
    	 var action = arg.action;
    	 var model = arg.model;
		 var record = arg.record;
		 var paramName = arg.paramName;
		 var getOrderAction = arg.getOrderAction;
		 var filterPropertyName = arg.filterPropertyName;
		 var filterPropertyValue = arg.filterPropertyValue;
		 
         var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
         var xmlData = ajaxUtil.invokeUrlGetXml(
        			Ext.AceRoute.appUrl+"?action="+getOrderAction+"&"+paramName+"="+orderId+"&mtoken="+Ext.AceRoute.loginref);
        	
         var storeTemp;
         if(typeof filterPropertyName !== "undefined"){
        	 storeTemp = new Ext.data.Store({
	  			    autoLoad: true,
	  			    model: model,
	  			    data : xmlData,
	  			    proxy: {
	  			        type: 'memory',
	  			        reader: {
	  			            type: 'xml',
	  			            record: record
	  			        }
	  	    	    },
	  	    	    filters: [
  	    	              {
  	  	                  property: filterPropertyName,
  	  	                  value   : filterPropertyValue
  	  	              }
  	  	            ]
	  			});
         }else{
        	 storeTemp = new Ext.data.Store({
	  			    autoLoad: true,
	  			    model: model,
	  			    data : xmlData,
	  			    proxy: {
	  			        type: 'memory',
	  			        reader: {
	  			            type: 'xml',
	  			            record: record
	  			        }
	  	    	    }
	  			});
         }
  			
         var storeToRefresh = this.argument.toRefreshObj.store; //Ext.StoreMgr.get('customerSiteStore');
         storeToRefresh.removeAll();
         storeTemp.each(function(record){
        	 storeToRefresh.add(record.copy());
  	     });
     },
     addOrSaveOrder: function (cust_contactid, cust_id, cust_siteid ,
 			dragged, event_geocode, loginRef,
 			order_flg, order_id, order_inst, order_name, order_notes,
 			order_po, order_prtid, order_recid, order_typeid, order_wkfid, 
 			reset, res_id, res_addid,
 			type, url, wkfid_upd){
     	
     	//var commonUtil = new Ext.AceRoute.util.CommonUtil();
 		
     	var startDate = Ext.getCmp('startDate').getValue();
     	var startTime = Ext.getCmp('startTimeId').getValue();
     	var eventDuration = Ext.getCmp('eventDurationId').getValue();
     	
     	var startTimeIndexOfColumn = startTime.indexOf(":");
     	var startTimeHour = startTime.slice(0,startTimeIndexOfColumn);
     	var startTimeMinute;
     	var indexOfAmPm;
     	
     	if((startTime.indexOf("am") > 0) || (startTime.indexOf("pm") > 0)){
     		if(startTime.indexOf("am") > 0){
     			indexOfAmPm = startTime.indexOf("am");
     			startTimeMinute = startTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
     		}
     		if(startTime.indexOf("pm") > 0){
     			indexOfAmPm = startTime.indexOf("pm");
     			startTimeHour = parseInt(startTimeHour) + 12; 
     			startTimeMinute = startTime.slice(startTimeIndexOfColumn+1, (indexOfAmPm-1));
     		}
     	}
     	
     	var startTimeInMilliSec; 
     	if(typeof startTimeHour !== "undefined"){
     		startTimeInMilliSec = ((parseInt(startTimeHour))*60 + parseInt(startTimeMinute))*60*1000;
     	}
     	
     	var startDateTemp = new Date((new Date(startDate)).getTime() + startTimeInMilliSec ); 
     	
     	var indexOfColumn = eventDuration.indexOf(":");
     	var eventDurationHour = eventDuration.slice(0,indexOfColumn);
     	var eventDurationMinute = eventDuration.slice(indexOfColumn+1);
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
     	
     	var orderStartWindow = Ext.getCmp('orderStartWindowId').getValue();
     	var orderEndWindow = Ext.getCmp('orderEndWindowId').getValue();
     	
     	var tsSt = CommonUtil.convertToUTC(new Date());
     	indexOfZero = tsSt.indexOf("-00");
 	    var tsStampSub = tsSt.substring(0,indexOfZero);
 	    tsStampSub = tsStampSub+"GMT+0000";
 	    
     	console.log(' tsStampSub '+tsStampSub);
     	
     	var tsStamp = new Date(tsStampSub).getTime();
     	
     	var ajaxcallObj = {
     		action:			'saveorder',
 			cust_contactid:	cust_contactid,
 			cust_id:		cust_id,
 			cust_siteid:	cust_siteid,
 			dragged:		dragged,
 			end_date:		endDateUtc,
 			event_geocode:  event_geocode,
 			extsys_id:		'',
 			loginref:		Ext.AceRoute.loginref,
 			mtoken: 		Ext.AceRoute.loginref,
 			orderEndTime:	orderEndTime,
 			order_endwin:   orderEndWindow,
 			order_id:		order_id,
 			order_inst:		order_inst,
 			order_name:		order_name,
 			order_notes:	order_notes,
 			order_po:		order_po,
 			order_prtid:	order_prtid,
 			order_recid:	order_recid,
 			order_typeid:	order_typeid,
 			order_flg:		order_flg,
 			orderStartTime:	orderStartTime,
 			order_startwin: orderStartWindow,
 			order_wkfid:	order_wkfid,
 			res_id:			res_id,
 			res_addid:		res_addid,
 			reset:			reset,
 			start_date:		startDateUtc,
 			type: 			type,
 			update_time:	tsStamp,
 			wkfid_upd:		0
     	}; 
     	
     	Ext.Ajax.request({
    	        url: url,
    	        method: 'POST',
    	        params: ajaxcallObj,
             success: handleResponse
    	    });
     }
});

Ext.reg('OrderDetail', Ext.AceRoute.view.OrderDetail);

handleResponse = function(r){
//	alert("Data has been saved successfully.");
//	Ext.Msg.alert('', 'Data has been saved successfully.', Ext.emptyFn).on('hide', 
//			function() {
//				Ext.getBody().mask();
//			}, null, {single: true});
	
	var msg = new Ext.MessageBox({
			buttons: Ext.MessageBox.OKCANCEL, 
			modal : true
	});
	
	msg.show({
		msg: 'Saved Successfully.'
	});
	
	Ext.StoreMgr.get('orderStore').read();
}

//Ext.AceRoute.view.SessionDetail = Ext.extend(Ext.form.FormPanel, {
//    ui: 'green',
//    cls: 'x-toolbar-dark',
//    baseCls: 'x-toolbar',
//    
//    initComponent: function() {
////        this.addEvents(
////            /**
////             * @event filter
////             * Fires whenever the user changes any of the form fields
////             * @param {Object} values The current value of each field
////             * @param {Ext.form.FormPanel} form The form instance
////             */
////            'filter'
////        );
////        
////        this.enableBubble('filter');
//        
//        Ext.apply(this, {
//            defaults: {
//                listeners: {
//                    change: this.onFieldChange,
//                    scope: this
//                }
//            },
//            
//            layout: {
//                type: 'hbox',
//                align: 'center'
//            },
//            
//            items: [
//                {
//                    xtype: 'selectfield',
//                    name: 'gender',
//                    prependText: 'Gender:',
//                    options: [
//                        {text: 'Both',   value: ''},
//                        {text: 'Male',   value: 'male'},
//                        {text: 'Female', value: 'female'}
//                    ]
//                },
//                {
//                    xtype: 'selectfield',
//                    name: 'sector',
//                    prependText: 'Sector:',
//                    options: [
//                        {text: 'All',            value: ''},
//                        {text: 'Agriculture',    value: 'agriculture'},
//                        {text: 'Transportation', value: 'transportation'},
//                        {text: 'Services',       value: 'services'},
//                        {text: 'Clothing',       value: 'clothing'},
//                        {text: 'Health',         value: 'health'},
//                        {text: 'Retail',         value: 'retail'},
//                        {text: 'Manufacturing',  value: 'manufacturing'},
//                        {text: 'Arts',           value: 'arts'},
//                        {text: 'Housing',        value: 'housing'},
//                        {text: 'Food',           value: 'food'},
//                        {text: 'Wholesale',      value: 'wholesale'},
//                        {text: 'Construction',   value: 'construction'},
//                        {text: 'Education',      value: 'education'},
//                        {text: 'Personal Use',   value: 'personal'},
//                        {text: 'Entertainment',  value: 'entertainment'},
//                        {text: 'Green',          value: 'green'}
//                    ]
//                },
//                {
//                    xtype: 'spacer'
//                },
//                {
//                    xtype: 'selectfield',
//                    name: 'sort_by',
//                    prependText: 'Sort by:',
//                    options: [
//                        {text: 'Newest',           value: 'newest'},
//                        {text: 'Oldest',           value: 'oldest'},
//                        {text: 'Expiring',         value: 'expiration'},
//                        {text: 'Amount Remaining', value: 'amount_remaining'},
//                        {text: 'Popularity',       value: 'popularity'},
//                        {text: 'Loan Amount',      value: 'loan_amount'}
//                    ]
//                },
//                {
//                    xtype: 'spacer'
//                },
//                {
//                    xtype: 'searchfield',
//                    name: 'q',
//                    placeholder: 'Search',
//                    listeners : {
//                        change: this.onFieldChange,
//                        keyup: function(field, e) {
//                            var key = e.browserEvent.keyCode;
//                            
//                            // blur field when user presses enter/search which will trigger a change if necessary.
//                            if (key === 13) {
//                                field.blur();
//                            }
//                        },
//                        scope : this
//                    }
//                }
//            ]
//        });
//            
//        Ext.AceRoute.view.SessionDetail.superclass.initComponent.apply(this, arguments);
//    },
//    
//    /**
//     * This is called whenever any of the fields in the form are changed. It simply collects all of the 
//     * values of the fields and fires the custom 'filter' event.
//     */
//    onFieldChange : function(comp, value) {
//        this.fireEvent('filter', this.getValues(), this);
//    }
//});
//
//Ext.reg('SessionDetail', Ext.AceRoute.view.SessionDetail);