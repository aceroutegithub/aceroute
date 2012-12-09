var sessionCard = null;

//function handleScroll(scrollerObject,offsetObject) {
//    alert("handleScroll")
//}

Ext.AceRoute.view.SessionListXml = Ext.extend(Ext.Panel, {
	
	layout: 'card',
    groupByDay: true,
    hasInitializedDate: false,
    scroll: 'vertical', 
    currentDaySelected: null,
    currentMonthSelected: null,
    currentYearSelected: null,
    dateButton: null,
    _controller: null,
    _selfRef: null,
    anchor:	"30%",
    custContactStore: null,
    autoRender: true,
    
    
    type: undefined,
	cust_contactid: undefined,
	cust_id: undefined,
	cust_siteid: undefined,
	end_date: undefined,
	orderEndTime: undefined,
	order_id: undefined,
	order_inst: undefined,
	order_name: undefined,
	order_notes: undefined,
	order_po: undefined,
	order_prtid: undefined,
	orderStartTime: undefined,
	order_recid: '1234',
	order_typeid: undefined,
	order_wkfid: undefined,
	res_id: undefined,
	resource_addid: undefined,
	start_date: undefined,
	wkfid_upd: undefined,
    
//    listeners: {
//        afterrender: function(comp) {
//               // comp is this Ext.Component == wrapper
//               comp.scroller.on('scroll',handleScroll);
//         }
//     },

    initComponent: function() {
    	
    	this.setSelfRef(this);
    	
    	Ext.AceRoute.store.orderStore.on('load',
    			this.initializeData, this);
    	
//    	Ext.AceRoute.store.orderStore.sort('order_name');    	
//    	Ext.AceRoute.store.orderStore.on('load', function(store, records, options) {alert(records);});
    	
    	var orderListTemplate = new Ext.XTemplate(
                '<tpl for=".">',
                    '<div>',
	                    '<div>',
	                        '<ol>',
		                        '<li>{orderPriorityName}</li>',
		                        '<li>{start_time}</li>',
		                        
		                    '</ol>',
	                    '</div>',
                        '<div>',
                            '{order_name}',
                        '</div>',
                        '<div>',
                            '<ol>',
                                '<li>Contact: {cust_contactid}</li>',
                                '<li>Start Time: {start_time}</li>',
                                '<li><input type="button" name="orderDetails" value="Details" class="x-button-label" onclick="showOrderDetails({id})"/></li>',
                                '<li><input type="button" name="navigate" value="Map" class="x-button-label" onclick="navigateOnClick({id})"/></li>',
                            '</ol>',
                        '</div>',
                    '</div>',
                '</tpl>', {
//                	'<div class="{[this.myTplFunc(values)]}">',
                    myTplFunc: function(values) {
                        alert(values);
                    }
                }
            );
    	
    	this.list = new Ext.List({
    		grouped: true,
    	    fullscreen: true,
    	    scroll: 'vertical',
    	    itemTpl : orderListTemplate, //'{orderForList}',
    	    store: Ext.AceRoute.store.orderStore,
    	    listeners: {
				render: function(c){
					//Ext.AceRoute.store.orderStore.load();
				},
				scope: this
			}
    	});
    	
        this.list.on('selectionchange', this.onSelect, this);
        this.listpanel = new Ext.Panel({
            items: this.list,
            scroll: 'vertical',
            layout: 'fit',
//            dockedItems: [{
//                xtype: 'toolbar',
//                title: this.confTitle+'dfdsf'
//            }],
            listeners: {
                activate: { fn: function(){
                    this.list.getSelectionModel().deselectAll();
                    Ext.repaint();
                }, scope: this }
            }
        })
        
        this.items = this.listpanel;
        //this.on('activate', this.checkActiveDate, this);
        this.on('render',
            function() {
               this.el.on(
            	{ 
            		scope: this,
	            	swipe: 
	            	   function (e) { 
	            	   		if(e.direction === "right"){
	            		    	this.goDateNext(null);
	            		    }else if(e.direction === "left"){
	            		    	this.goDateBack(null);
	            		    }
	            	   } 
	            }); 
            }
        );
        Ext.AceRoute.view.SessionListXml.superclass.initComponent.call(this);  
    },
    callMe: function(){
    	
    },
    setSelfRef: function(self){
    	this._selfRef = self;
    },
    getSelfRef: function(){
    	return this._selfRef;
    },
    setMvcController: function(controller){
    	this._controller = controller;
    },
    
    checkActiveDate: function(){
    	if (!this.hasInitializedDate && this.dateButtons) {
            var currentTime = new Date(),
                month = currentTime.getMonth() + 1,
                day = currentTime.getDate(),
                year = currentTime.getFullYear();
            
            if(day  < 10){
            	day = '0'+day;
            }
            if(month < 10){
            	month = '0'+month;
            }
            this.currentDaySelected = day;
            this.currentMonthSelected = month;
            this.currentYearSelected = year;
            
            var dateIndex = this.dateButtons.items.findIndex('dateData', year+'/'+month+'/'+day);
            
            if (dateIndex !== -1){ 
            	this.startDateIndex = dateIndex;
            }
            this.dateButtons.setPressed(this.startDateIndex);
            this.changeDate(
            	this.dateButtons.items.getAt(this.startDateIndex));
            
            var fromDateToShow = this.currentYearSelected+'-'+
								 this.currentMonthSelected+'-'+
								 this.currentDaySelected;
            
            var newDatePlusOneDay = new Date(
		 			(new Date(
		 					this.currentYearSelected, 
		 					this.currentMonthSelected-1, 
		 					this.currentDaySelected)).getTime() 
        			    + (86400000)) ;
            
			var toDateToShow = newDatePlusOneDay.getFullYear() +'-'+ 
						(newDatePlusOneDay.getMonth() + 1)+'-'+
						newDatePlusOneDay.getDate();
			
			var arguments = {
				caller: this,
				invoke: this.updateStore,
				from: fromDateToShow,
				to: toDateToShow,
				direction: 'back'
			};
			
			var messages = {
				mtoken: Ext.AceRoute.loginref,
				action: 'getorders', 
				tz: 'US/Pacific',
				from: fromDateToShow,
				to: toDateToShow
			};
			
			this.submit(Ext.AceRoute.appUrl, 
				this.reloadEntitiesSuccess, 
				null, 
				messages, 
				arguments);
            
            this.doComponentLayout();
            this.hasInitializedDate = true;
        }
    }, 
    
    initializeData: function(store) {
    	if(!this.hasInitializedDate){
	    	var data = store.data;
	    	// First fill the sessions to the speaker store
	        var length   = data.items.length,
	            proposal, i;
	        
	        if (this.groupByDay) {
	            // Gather dates, create a split button around them
	            var dates = store.collect('start_dateWithoutTime'),
	                buttons = [], length  = dates.length, i;
	            
	            var dateToShow, monthToShow, yearToShow;
	            
	            if(this.currentDaySelected != null){
	            	dateToShow = this.currentDaySelected;
	            }
	            if(this.currentMonthSelected != null){
	            	monthToShow = this.currentMonthSelected;
	            }
	            if(this.currentYearSelected != null){
	            	yearToShow = this.currentYearSelected;
	            }
	            
	            if(typeof dateToShow === 'undefined'){
	            	var date = new Date();
	            	dateToShow = date.getDate();
	            	monthToShow = date.getMonth()+1;
	            	yearToShow = date.getFullYear();
	            }
	            
	            dateButton = {
	                text: yearToShow+"/"+monthToShow+"/"+dateToShow, 
	                dateData: yearToShow+"/"+monthToShow+"/"+dateToShow,
	                id: 'dateButton',
	                name: 'dateButton',
	                index: 0,
	                scope: this,
	                style: 'width: 45%', 
	                //defaults: { flex: 1 },
	                handler: this.changeDate
	            };
	            this.addNewOrderButton = new Ext.SegmentedButton({
	                items: [{
	                	text: 'Add Order', 
	                    dateData: 'Add Order',
	                    scope: this,
	                    handler: this.addOrder
	                }],
	                //defaults: { flex: 1 } //,
	                style: 'width: 30%'
	            });
	            this.backDateButton = new Ext.SegmentedButton({
	                items: [{
	                	text: '<<', 
	                    //dateData: 'back',
	                    ui: 'back',
	                    scope: this,
	                    handler: this.goDateBack
	                }],
	                //defaults: { flex: 1 }//,
	                style: 'width: 15%'
	            });
	            this.nextDateButton = new Ext.SegmentedButton({
	                items: [{
	                	text: '>>',  
	                    //dateData: 'Next',
	                    ui: 'forward', 
	                    scope: this,
	                    handler: this.goDateNext
	                }],
	                //defaults: { flex: 1 },
	                style: 'width: 20%' 
	            });
	            this.dateButtons = new Ext.SegmentedButton({
	                items: [
	                        this.backDateButton,
	                        this.addNewOrderButton,
	                        dateButton, 
	                        this.nextDateButton
	                ],
	                //defaults: { flex: 1 },
	                style: 'width: 100%'
	            });
	            this.listpanel.addDocked({ 
	                xtype: 'toolbar',
	                //ui: 'gray',
	                items: this.dateButtons,
	                layout: { pack: 'center' }
	            });
	            // Take off the spinner
	            this.list.el.unmask();
	            if (this.listpanel.isVisible()) {  
	                this.checkActiveDate();
	            }
	        }
    	}
    },
    changeDate: function(btn) {
    	if(typeof btn !== 'undefined' && typeof btn.dateData !== 'undefined'){
    		
    		console.log(' btn.dateData '+btn.dateData);
    		var btnData = btn.dateData.toString().replaceAll('-','/');
    		var currSelectedDate = new Date(btnData);
    		console.log(' currSelectedDate '+currSelectedDate);
    		this.currentMonthSelected = currSelectedDate.getMonth()+1;
            this.currentDaySelected = currSelectedDate.getDate();
            this.currentYearSelected = currSelectedDate.getFullYear();
            
            var fromDateToShow = this.currentYearSelected+'-'+
				 this.currentMonthSelected+'-'+
				 this.currentDaySelected;
            console.log(' fromDateToShow '+fromDateToShow);
			var newDatePlusOneDay = new Date(
				(new Date(
						this.currentYearSelected, 
						this.currentMonthSelected-1, 
						this.currentDaySelected)).getTime() 
				   + (86400000)) ;
			
			var toDateToShow = newDatePlusOneDay.getFullYear() +'-'+ 
				(newDatePlusOneDay.getMonth() + 1)+'-'+
				newDatePlusOneDay.getDate();
			
			var arguments = {
				caller: this,
				invoke: this.updateStore,
				from: fromDateToShow,
				to: toDateToShow,
				direction: 'back'
			};
			
			var messages = {
				mtoken: Ext.AceRoute.loginref,
				action: 'getorders', 
				tz: 'US/Pacific',
				from: fromDateToShow,
				to: toDateToShow
			};
			
			this.submit(Ext.AceRoute.appUrl, 
				this.reloadEntitiesSuccess, 
				null, 
				messages, 
				arguments);
	            
	        this.list.store.clearFilter();
	        this.list.store.filter('start_dateWithoutTime', btn.dateData);
	        this.list.scroller.scrollTo({y: 0}, false);
    	}
    },  
    goDateBack: function(btn){
         var newDate = new Date(
        		 			(new Date(
        		 					this.currentYearSelected, 
        		 					this.currentMonthSelected-1, 
        		 					this.currentDaySelected)).getTime() 
        		 			- 86400000);
         
         var newDatePlusOneDay = new Date(
		 			(new Date(
		 					this.currentYearSelected, 
		 					this.currentMonthSelected-1, 
		 					this.currentDaySelected)).getTime() 
		 			);
         
         //var retMsg = this._controller.callMethod("Job List");
         
         this.currentMonthSelected = newDate.getMonth() + 1;
         this.currentDaySelected = newDate.getDate();
         this.currentYearSelected = newDate.getFullYear();
         
         if(this.currentMonthSelected < 10){
        	 this.currentMonthSelected = '0'+this.currentMonthSelected;
         }
         if(this.currentDaySelected < 10){
        	 this.currentDaySelected = '0'+this.currentDaySelected;
         }
         var fromDateToShow = this.currentYearSelected+'-'+
         					  this.currentMonthSelected+'-'+
         					  this.currentDaySelected;
         var toDateToShow = newDatePlusOneDay.getFullYear() +'-'+ 
         					(newDatePlusOneDay.getMonth() + 1)+'-'+
         					newDatePlusOneDay.getDate();
         
         var arguments = {
            caller: this,
        	invoke: this.updateStore,
        	from: fromDateToShow,
        	to: toDateToShow,
        	direction: 'back'
         };
         
         var messages = {
        	mtoken: Ext.AceRoute.loginref,
        	action: 'getorders', 
        	tz: 'US/Pacific',
        	from: fromDateToShow,
        	to: toDateToShow
         };
	        
         this.submit(Ext.AceRoute.appUrl, 
        		 this.reloadEntitiesSuccess, 
        		 null, 
        		 messages, 
        		 arguments);
    },
    goDateNext: function(btn){
        var newDate = new Date(
       		 			(new Date(
       		 					this.currentYearSelected, 
       		 					this.currentMonthSelected-1, 
       		 					this.currentDaySelected)).getTime() 
       		 			+ 86400000);
        
        
        var newDatePlusOneDay = new Date(
		 			(new Date(
		 					this.currentYearSelected, 
		 					this.currentMonthSelected-1, 
		 					this.currentDaySelected)).getTime() 
        			    + (2 * + 86400000)) ;
        
        this.currentMonthSelected = newDate.getMonth()+1;
        this.currentDaySelected = newDate.getDate();
        this.currentYearSelected = newDate.getFullYear();
        
        if(this.currentMonthSelected < 10){
       	 	this.currentMonthSelected = '0'+this.currentMonthSelected;
        }
        if(this.currentDaySelected < 10){
       	 	this.currentDaySelected = '0'+this.currentDaySelected;
        }
       
		var fromDateToShow = this.currentYearSelected+'-'+
							  this.currentMonthSelected+'-'+
							  this.currentDaySelected;
		
		var toDateToShow = newDatePlusOneDay.getFullYear() +'-'+
							(newDatePlusOneDay.getMonth() + 1)+'-'+
							newDatePlusOneDay.getDate();
		
		var arguments = {
			caller: this,
			invoke: this.updateStore,
			from: fromDateToShow,
			to: toDateToShow,
			direction: 'forward'
		};
		
		var messages = {
		    mtoken: Ext.AceRoute.loginref,
			action: 'getorders', 
			tz: 'US/Pacific',
			from: fromDateToShow,
			to: toDateToShow
		};
		
		this.submit(Ext.AceRoute.appUrl, 
       		 this.reloadEntitiesSuccess, 
       		 null, 
       		 messages, 
       		 arguments);
    },
    updateStore: function(storeToUpdate, fromDate, toDate, direction){
    	this.list.store.proxy.extraParams = {
    		mtoken: Ext.AceRoute.loginref,
        	action: 'getorders', 
        	tz: 'US/Pacific',
        	from: fromDate,
        	to: toDate
        };
    	
    	Ext.StoreMgr.get('orderStore').load();
    	//if(direction == 'back'){
    		Ext.getCmp('dateButton').setText(fromDate);
    		Ext.getCmp('dateButton').dateData = fromDate;
//    	}else{
//    		Ext.getCmp('dateButton').setText(toDate);
//    		Ext.getCmp('dateButton').dateData = toDate;
//    	}
    	
    	this.list.store.clearFilter();
//    	this.list.store.filter('start_dateWithoutTime', '2011/09/24');
    	this.list.scroller.scrollTo({y: 0}, false);
    },
    addOrder: function(){
        
//    	    var index = Ext.AceRoute.store.orderStore.findExact('id',records[0].data.id);
//    	  	var dataMatch = Ext.AceRoute.store.orderStore.getAt(index);
//            var data = dataMatch.data;
//            
//            var orderStoreUpdate = new Ext.data.Store({ 
//                model: "Order",
//                storeId: "orderStoreUpdateId",
//                proxy: {
//                    type: "localstorage",
//                    id: "id"            
//                }
//            });
            
    		sessionCard = this.createAddOrderComp();
            // submit(url, reloadEntitiesSuccess, failure, messages, arguments);
    	    // Tell the parent panel to animate to the new card
            this.setActiveItem(sessionCard, 'slide');
        
    },
    onSelect: function(selectionmodel, records){
        if (records[0] !== undefined) {
    	    var index = Ext.AceRoute.store.orderStore.findExact('id',records[0].data.id);
    	  	var dataMatch = Ext.AceRoute.store.orderStore.getAt(index);
            var data = dataMatch.data;
            
            var orderStoreUpdate = new Ext.data.Store({ 
                model: "Order",
                storeId: "orderStoreUpdateId",
                proxy: {
                    type: "localstorage",
                    id: "id"            
                }
            });
            
            sessionCard = this.createEditOrderComp(data, orderStoreUpdate);
            // submit(url, reloadEntitiesSuccess, failure, messages, arguments);
    	    // Tell the parent panel to animate to the new card
            this.setActiveItem(sessionCard, 'slide');
        }
    },
    createEditOrderComp: function(data, orderStoreUpdateLocal){
    	
//    	action:saveorder
//    	cust_contactid:
//    	cust_id:1313730249264
//    	cust_siteid:
//    	dragged:false
//    	end_date:2011/11/18 10:30 -00:00
//    	event_geocode:1
//    	loginref:12345
//    	orderEndTime:1321612200000
//    	order_endwin:4:00 am
//    	order_id:0
//    	order_inst:
//    	order_name:test2
//    	order_notes:
//    	order_po:
//    	order_prtid:3
//    	order_recid:
//    	order_typeid:1313825583494
//    	order_flg:0|
//    	orderStartTime:1321607700000
//    	order_startwin:1:15 am
//    	order_wkfid:1
//    	res_id:1313903247455
//    	resource_addid:
//    	reset:0
//    	start_date:2011/11/18 9:15 -00:00
//    	type:true
//    	tstamp:1321764720000
//    	wkfid_upd:0
    		
    	 orderStoreUpdateLocal.add(data);
    	 var order = orderStoreUpdateLocal.getAt(0);
    	 
    	 this.data = data;
    	 this.cust_contactid = data.cust_contactid;
		 this.cust_id = data.cust_id;
		 this.cust_siteid = data.cust_siteid;
		 this.duration = data.duration;
		 this.end_date =  data.end_date;
		 this.orderEndTime = data.orderEndTime;
		 this.order_endwin = data.order_endwin;
		 this.order_id = data.id;
		 this.order_name = data.order_name;
		 this.order_notes = data.order_notes;
		 this.order_po = data.order_po;
		 this.order_prtid = data.order_prtid;
		 this.orderStartTime = data.orderStartTime;
		 this.order_startwin = data.order_startwin;
		 this.order_recid = data.orderStartTime;
		 this.order_typeid = data.order_typeid;
		 this.order_wkfid = data.order_wkfid;
		 this.res_id = data.res_id;
		 this.resource_addid = data.resource_addid;
		 this.site_addr = data.site_addr;
		 this.site_geocode = data.site_geocode;
		 this.start_date = data.start_date;
		 this.start_dateWithoutTime = data.start_dateWithoutTime;
		 this.start_time = data.start_time;
		 this.wkfid_upd = data.wkfid_upd;
    		
     	 var startDateTimePicker = new Ext.extension.DateTimePicker({
             useTitles: true,
 			 id:'dt',
             value: {
                 day: 23,
                 month: 2,
                 year: 2000,
 				hour:13,
 				minute:45
             },
 			listeners:{
 				"hide":function(picker){
 				}
 			}
         });
         
         var endDateTimePicker = new Ext.extension.DateTimePicker({
             useTitles: true,
 			id:'dt',
             value: {
                 day: 23,
                 month: 2,
                 year: 2000,
 				hour:13,
 				minute:45
             },
 			listeners:{
 				"hide":function(picker){
 					endDateSelected = picker.getValue();
 				}
 			}
         });
        
        var currentDate = new Date(); 
        var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
        
        var custContactXmlData = ajaxUtil.invokeUrlGetXml(
				Ext.AceRoute.appUrl+"?action=getcontact&cust_id="+this.cust_id+"&mtoken="+Ext.AceRoute.loginref);
        var custContactStore
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: 'CustomerContact',
			    data : custContactXmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: 'contact'
			        }
			    }
			});
	        
	    var custSiteXmlData = ajaxUtil.invokeUrlGetXml(
	    					Ext.AceRoute.appUrl+"?action=getsite&cust_id="+this.cust_id+"&mtoken="+Ext.AceRoute.loginref);
        
	    var custSiteStore = null;
        
        if(typeof this.cust_id !== "undefined"){
        	custSiteStore = new Ext.data.Store({
			    autoLoad: true,
			    id:'customerSiteStore',
	    		name: 'customerSiteStore',
	    		model: 'CustomerSite',
			    data : custSiteXmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: 'site'
			        }
			    }
			});
        };
        
        var editButton = [{
	    		xtype: 'button',
	    		text:'Save',
	            iconMask: true,
	            stretch: false,
	            scope: this,
	            handler: function(event, btn) {
	            	var editTaskPanel = this.createEditPartPanel(taskSelected);
	            	editTaskPanel.show();
	            }
		}];
		var dockedItems = [new Ext.Toolbar({
	        ui: 'light',
	        dock: 'top',      
	        items: [editButton]	
	    })];
    	
//		var signpanel = new Ext.Panel({   
//    		id: 'signaturePanel',
//    		plugins: [new Ext.AceRoute.ux.plugins.signaturePad({width: 500, height: 100})]
//		});
		
		var editOrderLocal = new Ext.AceRoute.view.SessionDetail({
    		
        	scroll: 'vertical',
        	anchor:	"40%",
        	viewData: data,
        	autoRender: true,
        	
        	items: [
					
				new Ext.form.FieldSet({
        	        bodyBorder: false,
        	        border: false,
                	layout: {
                	    type: 'auto',
                	    align: 'left'
                	},
                	defaults: {
                        labelAlign: 'left',
                        labelWidth: '32%',
                        style: 'border-width: 0px',
                        border: false
                    },
                    autoRender: true,
	                items:[
			                    {
			        		    xtype: 'selectfield',
			        		    id: 'custId',
			                    name: 'custId',
			                    label: 'Customer',
			                    store: Ext.AceRoute.store.custStore,
			                    displayField : 'cust_name',
			                    valueField : 'cust_id',
			                    value: this.cust_id,
			                    listeners: { 
			                    	change: { 
			                         	fn: function(src, value){
			                         		this.cust_id = value;
			                         		this.updateCustStores(this.cust_id, ajaxUtil);
			                         	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			        		    xtype: 'selectfield',
			        		    id: 'contactSiteId',
			                    name: 'contactSiteId',
			                    label: 'Site',
			                    store: custSiteStore,
			                    displayField : 'site_name',
			                    valueField : 'site_id',
			                    value: this.cust_siteid,
			                    listeners: { 
			                    	change: { 
			                         	fn: function(src, value){
				                     		this.cust_siteid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			          		      xtype: 'textfield',
			          		      id : 'siteAddrId',
			          		      name : 'siteAddr',
			          		      label: 'Addr',
			          		      readOnly: true,
			          		      useClearIcon: false,
			          		      autoCapitalize : false,
			          		      value: this.site_addr,
				          		  listeners: { 
				                    	focus: { 
				                         	fn: function(src, value){
				                         		var orderData = {
				                       		    	site_addr: this.site_addr,
							                       	site_geocode: this.site_geocode,
							                        start_dateWithoutTime: this.start_dateWithoutTime,
							                       	start_time: this.start_time,
							                       	data: this.data
				                       		    }; 
				                         		this.showOrderAddressOnMap(orderData);
					                     	},
					                     	scope: this 
					                     }
				                  }
			          		},
			                {
			          		      xtype: 'textfield',
			          		      id : 'name',
			          		      name : 'name',
			          		      label: 'Name',
			          		      useClearIcon: true,
			          		      autoCapitalize : false,
			          		      value: this.order_name
			          		},
			          		{
			        		    xtype: 'selectfield',
			                    name: 'resourceId',
			                    label: 'Resource',
			                    store: Ext.AceRoute.store.resourceStore,
			                    displayField : 'res_displayname',
			                    valueField : 'res_id',
			                    value: this.res_id,
			                    listeners: { 
			                    	change: { 
			                         	fn: function(src, value){
				                     		this.res_id = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },  
			          		{
			        		    xtype: 'selectfield',
			                    name: 'statusTypeId',
			                    label: 'Status',
			                    store: Ext.AceRoute.store.statusStore,
			                    displayField : 'statustype',
			                    valueField : 'wkf_id',
			                    value: this.order_wkfid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.order_wkfid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			        	        xtype: 'datepickerfield',
			        	        id:'startDate',
			                    name: 'startDate',
			                    useClearIcon: true,
			                    hideOnMaskTap: true,
			                    height: 20,
			                    value: new Date(this.start_dateWithoutTime), 
		        	            picker: {
			                        slots: [ 'month', 'day','year' ],
			                        yearFrom: currentDate.getFullYear()
			                    },
			                    label: 'StartDate' 
		        	        },
			                {
            	                xtype: 'schpickerfield',
            		            name: 'startTime',
            		            id: 'startTimeId', 
            		            label: 'StartAt',
            		            value: this.start_time,
            		            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
            		                                           // if the could names do not match then, it will not be replaced.
            		            //valueFormat: 'hour:mins',
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
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
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
			                },
			                {
            	                xtype: 'schpickerfield',
            	                name: 'eventDuration',
            		            id: 'eventDurationId', 
            		            label: 'Duration<br/><font size="1">(H:M)</font>',
            		            value: this.duration,
            		            valueFormat: 'hour:mins', // note that we are using the column names in the format.
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
            		                            {text: '12', value: '12'},
            		                            {text: '13', value: '13'},
            		                            {text: '14', value: '14'},
            		                            {text: '15', value: '15'},
            		                            {text: '16', value: '16'},
            		                            {text: '17', value: '17'},
            		                            {text: '18', value: '18'},
            		                            {text: '19', value: '19'},
            		                            {text: '20', value: '20'},
            		                            {text: '21', value: '21'},
            		                            {text: '22', value: '22'},
            		                            {text: '23', value: '23'},
            		                            {text: '24', value: '24'}
            		                        ]
            	                         }, {
            		                        name : 'mins',
            	                            title: 'Min',
            		                        data : [
            		                            {text: '00', value: '00'},
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
            		                        ]
            		                    }
            		                ]
            		            }
			                },
			                {
			        		    xtype: 'selectfield',
			                    name: 'orderTypeId',
			                    label: 'Type',
			                    store: Ext.AceRoute.store.orderTypeStore,
			                    displayField : 'ordertype_name',
			                    valueField : 'ordertype_id',
			                    value: this.order_typeid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.order_typeid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			               {
			        		    xtype: 'selectfield',
			                    name: 'priorityTypeId',
			                    label: 'Priority',
			                    store: Ext.AceRoute.store.priorityStore,
			                    displayField : 'priorityType',
			                    valueField : 'priority_id',
			                    value: this.order_prtid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.order_prtid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			        		    xtype: 'selectfield',
			        		    id: 'contactId',
			                    name: 'contactId',
			                    label: 'Contact',
			                    store: custContactStore,
			                    displayField : 'contact_displayname',
			                    valueField : 'contact_id',
			                    value: this.cust_contactid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.cust_contactid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
            	                xtype: 'schpickerfield',
            		            name: 'orderStartWindow',
            		            id: 'orderStartWindowId', 
            		            label: 'StartWin<br/><font size="1">(H:M)</font>',
            		            value: this.order_startwin,
            		            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
            		                                           // if the could names do not match then, it will not be replaced.
            		            //valueFormat: 'hour:mins',
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
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
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
			                },
			                {
            	                xtype: 'schpickerfield',
            		            name: 'orderEndWindow',
            		            id: 'orderEndWindowId', 
            		            label: 'EndWin<br/><font size="1">(H:M)</font>',
            		            value: this.order_endwin,
            		            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
            		                                           // if the could names do not match then, it will not be replaced.
            		           // valueFormat: 'hour:mins',
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
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
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
			                }
//			                ,
//			                signpanel
			            	,
			                {
			                	xtype:'toolbar',
			                	ui: 'light',
			        	        dock: 'top',
			        	        items: [{
			        	        	xtype: 'button',
			        	    		text:'Save',
			        	            iconMask: true,
			        	            stretch: false,
			        	            scope: this,
			        	            handler: function(event, btn) {
			        	            	
			        	            	var cust_contactid = this.cust_contactid;
	        	            			var cust_id = this.cust_id;
	        	            			var cust_siteid = this.cust_siteid;
	        	            			var dragged = false;
	        	            			var event_geocode = this.event_geocode;
	        	            			var loginRef = Ext.AceRoute.loginref;
	        	            			var order_flg = '0|';
	        	            			var order_id = this.order_id;
	        	            			var order_inst = this.order_inst;
	        	            			var order_name  = this.order_name;
	        	            			var order_notes = this.order_notes;
	        	            			var order_po = this.order_po;
	        	            			var order_prtid = this.order_prtid;
	        	            			var order_recid = this.order_recid;
	        	            			var order_typeid = this.order_typeid;
	        	            			var order_wkfid = this.order_wkfid;
	        	            			var res_id = this.res_id;
	        	            			var reset = 0;
	        	            			var resource_addid = this.resource_addid;
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
			        	            			resource_addid,
			        	            			type,
			        	            			url,
			        	            			wkfid_upd);
				                  	    
			        	            }
			        	        }]
			                }
		          	]
				})
             ]
               
        });        
    	
    	orderStoreUpdateLocal.sync();
    	return editOrderLocal;
    },
    createAddOrderComp: function(){
    	
//    	action:saveorder
//    	cust_contactid:
//    	cust_id:
//    	cust_siteid:
//    	dragged:false
//    	end_date:2011/11/18 10:30 -00:00
//    	event_geocode:1
//    	loginref:12345
//    	orderEndTime:1321612200000
//    	order_endwin:6:30 am
//    	order_flg:0|
//    	order_id:0
//    	order_inst:
//    	order_name:test2
//    	order_notes:
//    	order_po:
//    	order_prtid:2
//    	order_recid:
//    	order_typeid:1313825583494
//    	orderStartTime:1321607700000
//    	order_startwin:1:15 am
//    	order_wkfid:1
//    	res_id:1313903247455
//    	resource_addid:
//    	reset:0
//    	start_date:2011/11/18 9:15 -00:00
//    	type:true
//    	tstamp:1321764540000
//    	wkfid_upd:0
    	
    	// Failed														Working
//    		action: "saveorder"
//    		cust_contactid: "1313729641969"						cust_contactid:
//    		cust_id: "1296981890711"							cust_id:1318443439911
//    		cust_siteid: "1296981890710"						cust_siteid:1317418345779
//    		dragged: false										dragged:false
//    		end_date: "2011/12/23 10:00 -00:00"					end_date:2011/11/15 13:30 -00:00
//    		event_geocode: 1									event_geocode:1
//    		loginref: "12345"									loginref:12345
//    		orderEndTime: 1324634400000							orderEndTime:1321363800000
//    		orderStartTime: 1324630800000						orderStartTime:1321353000000
//    		order_endwin: "3:00 am"								order_endwin:2:15 AM
//    		order_flg: "0|"										order_flg:0|
//    		order_id: 0											order_id:0
//    		order_inst: undefined								order_inst:
//    		order_name: "111"									order_name:test 001
//    		order_notes: undefined								order_notes:
//    		order_po: undefined									order_po:
//    		order_prtid: "1"									order_prtid:2
//    		order_recid: undefined								order_recid:N/A
//    		order_startwin: "2:00 am"							order_startwin:1:15 AM
//    		order_typeid: "1298762642984"						order_typeid:1313825751268
//    		order_wkfid: "0"									order_wkfid:1
//    		res_id: "1311635474311"								res_id:0
//    		reset: 0											reset:0
//    		resource_addid: undefined							resource_addid:
//    		start_date: "2011/12/23 9:00 -00:00"				start_date:2011/11/15 10:30 -00:00
//    		tstamp: 1324631460000								tstamp:1321742520000
//    		type: "true"
//    		wkfid_upd: 0

//       Add Order Working
//    	loginref:12345
//    	action:saveorder
//    	type:true
//    	cust_id:1318443439911
//    	order_id:0
//    	event_geocode:1
//    	start_date:2011/11/15 10:30 -00:00
//    	end_date:2011/11/15 13:30 -00:00
//    	orderStartTime:1321353000000
//    	orderEndTime:1321363800000
//    	order_name:test 001
//    	cust_siteid:1317418345779
//    	cust_contactid:
//    	order_po:
//    	order_typeid:1313825751268
//    	order_prtid:2
//    	order_inst:
//    	order_wkfid:1
//    	order_recid:N/A
//    	res_id:0
//    	order_startwin:1:15 AM
//    	order_endwin:2:15 AM
//    	resource_addid:
//    	order_notes:
//    	order_flg:0|
//    	reset:0
//    	wkfid_upd:0
//    	dragged:false
//    	tstamp:1321742520000
//    	Submit:Submit Form
    	
    	
    	 this.cust_contactid = undefined;
		 this.cust_id;
		 this.cust_siteid = undefined;
		 this.duration = undefined;
		 this.end_date =  undefined;
		 this.event_geocode = 1;
		 this.orderEndTime = undefined;
		 this.order_endwin = undefined;
		 this.order_id = 0; // for new order orde id is 0
		 this.order_inst = '';
		 this.order_name = undefined;
		 this.order_notes = '';
		 this.order_po = '';
		 this.order_prtid = undefined;
		 this.orderStartTime = undefined;
		 this.order_startwin = undefined;
		 this.order_recid = 'N/A';
		 this.order_typeid = undefined;
		 this.order_wkfid = undefined;
		 this.res_id = undefined;
		 this.resource_addid = '';
		 this.start_date = undefined;
		 this.start_dateWithoutTime = undefined;
		 this.start_time = undefined;
		 this.wkfid_upd = undefined;
    		
		 var startDateTimePicker = new Ext.extension.DateTimePicker({
             useTitles: true,
 			 id:'dt',
             value: {
                 day: 23,
                 month: 2,
                 year: 2000,
 				hour:13,
 				minute:45
             },
 			listeners:{
 				"hide":function(picker){
 				}
 			}
         });
         
         var endDateTimePicker = new Ext.extension.DateTimePicker({
             useTitles: true,
 			id:'dt',
             value: {
                 day: 23,
                 month: 2,
                 year: 2000,
 				hour:13,
 				minute:45
             },
 			listeners:{
 				"hide":function(picker){
 					endDateSelected = picker.getValue();
 				}
 			}
         });
      
  	    var retStr =  this.currentMonthSelected
	    	+ "/" + this.currentDaySelected 
	    	+ "/" + this.currentYearSelected; 
        console.log(' retStr '+retStr);
  	    var start_date = new Date(retStr);
  	    var currentDate = new Date();
  	    
        var ajaxUtil = new Ext.AceRoute.util.AjaxUtil();
        var custId;
        var custStore = Ext.AceRoute.store.custStore;
        if(typeof custStore !== "undefined" && custStore.getCount() > 0){
	        var dataMatch = custStore.getAt(0);
	        var d = dataMatch.data;
	        custId = d.cust_id;
	        this.cust_id = d.cust_id;
        }
        
        var custContactXmlData = ajaxUtil.invokeUrlGetXml(
				Ext.AceRoute.appUrl+"?action=getcontact&cust_id="+custId+'&mtoken='+Ext.AceRoute.loginref);
        var custContactStore
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: 'CustomerContact',
			    data : custContactXmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: 'contact'
			        }
			    }
			});
	     
        if(typeof custContactStore !== "undefined"){
        	this.cust_contactid = custContactStore.getAt(0).data.contact_id;
        	console.log(' this.cust_contactid '+this.cust_contactid);
        }
	    var custSiteXmlData = ajaxUtil.invokeUrlGetXml(
	    					Ext.AceRoute.appUrl+"?action=getsite&cust_id="+custId+'&mtoken='+Ext.AceRoute.loginref);
        var custSiteStore
	    	= new Ext.data.Store({
			    autoLoad: true,
			    model: 'CustomerSite',
			    data : custSiteXmlData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: 'site'
			        }
			    }
			});
        
        if(typeof custSiteStore !== "undefined"){
        	this.cust_siteid = custSiteStore.getAt(0).data.site_id;
        	console.log(' this.cust_siteid '+this.cust_siteid);
        }
        
        var orderTypeStore = Ext.AceRoute.store.orderTypeStore;
        if(typeof orderTypeStore !== "undefined"){
        	this.order_typeid = orderTypeStore.getAt(0).data.ordertype_id;
        }
        var statusStore = Ext.AceRoute.store.statusStore;
        if(typeof statusStore !== "undefined"){
        	this.order_wkfid = statusStore.getAt(0).data.wkf_id;
        }
        var priorityStore = Ext.AceRoute.store.priorityStore;
        if(typeof priorityStore !== "undefined"){
        	this.order_prtid = priorityStore.getAt(0).data.priority_id;
        }
        var resStore = Ext.AceRoute.store.resourceStore;
        if(typeof resStore !== "undefined"){
        	this.res_id = resStore.getAt(0).data.res_id;
        }
        
        var editButton = [{  
	    		xtype: 'button',
	    		text:'Save',
	            iconMask: true,
	            stretch: false,
	            scope: this,
	            handler: function(event, btn) {
	            	var editTaskPanel = this.createEditPartPanel(taskSelected);
	            	editTaskPanel.show();
	            }
		}];
		var dockedItems = [new Ext.Toolbar({
	        ui: 'light',
	        dock: 'top',
	        items: [editButton]	
	    })];
    	
		var addOrderLocal = new Ext.AceRoute.view.SessionDetail({
    		
        	scroll: 'vertical',
        	anchor:	"40%",
        	items: [
					
				new Ext.form.FieldSet({
        	        bodyBorder: false,
        	        border: false,
                	layout: {
                	    type: 'auto',
                	    align: 'left'
                	},
                	defaults: {
                        labelAlign: 'left',
                        labelWidth: '32%',
                        style: 'border-width: 0px',
                        border: false
                    },
	                items:[
			                    {
			        		    xtype: 'selectfield',
			        		    id: 'custId',
			                    name: 'custId',
			                    label: 'Customer',
			                    store: Ext.AceRoute.store.custStore,
			                    displayField : 'cust_name',
			                    valueField : 'cust_id',
			                    value: custId,
			                    listeners: { 
			                    	change: { 
			                         	fn: function(src, value){
			                         		this.cust_id = value;
			                         		this.updateCustStores(this.cust_id, ajaxUtil);
		                         	    },
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			        		    xtype: 'selectfield',
			        		    id: 'contactSiteId',
			                    name: 'contactSiteId',
			                    label: 'Site',
			                    store: custSiteStore,
			                    displayField : 'site_name',
			                    valueField : 'site_id',
			                    value: this.cust_siteid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.cust_siteid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			          		      xtype: 'textfield',
			          		      id : 'name',
			          		      name : 'name',
			          		      label: 'Name',
			          		      useClearIcon: true,
			          		      autoCapitalize : false,
			          		      value: this.order_name,
			          		      listeners: { 
			                    	change: { 
			                         	fn: function(src, value){
				                     		this.order_name = value;
				                     	},
				                     	scope: this 
				                     }
			                      }
			          		},
			          		{
			        		    xtype: 'selectfield',
			                    name: 'resourceId',
			                    label: 'Resource',
			                    store: Ext.AceRoute.store.resourceStore,
			                    displayField : 'res_displayname',
			                    valueField : 'res_id',
			                    value: this.res_id,
			                    listeners: { 
			                    	change: { 
			                         	fn: function(src, value){
				                     		this.res_id = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },  
			          		{
			        		    xtype: 'selectfield',
			                    name: 'statusTypeId',
			                    label: 'Status',
			                    store: Ext.AceRoute.store.statusStore,
			                    displayField : 'statustype',
			                    valueField : 'wkf_id',
			                    value: this.order_wkfid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.order_wkfid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			        	        xtype: 'datepickerfield',
			        	        id:'startDate',
			                    name: 'startDate',
			                    useClearIcon: true,
			                    hideOnMaskTap: true,
			                    height: 20,
			                    value:  start_date, 
		        	            picker: {
			                        slots: [ 'month', 'day','year' ],
			                        yearFrom: currentDate.getFullYear()
			                    },
			                    label: 'StartDate' 
		        	        },
			                {
            	                xtype: 'schpickerfield',
            		            name: 'startTime',
            		            id: 'startTimeId', 
            		            label: 'StartAt',
            		            value: this.start_time,
            		            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
            		                                           // if the could names do not match then, it will not be replaced.
            		            //valueFormat: 'hour:mins',
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
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
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
			                },
			                {
            	                xtype: 'schpickerfield',
            	                name: 'eventDuration',
            		            id: 'eventDurationId', 
            		            label: 'Duration<br/><font size="1">(H:M)</font>',
            		            value: this.duration,
            		            valueFormat: 'hour:mins', // note that we are using the column names in the format.
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
            		                            {text: '12', value: '12'},
            		                            {text: '13', value: '13'},
            		                            {text: '14', value: '14'},
            		                            {text: '15', value: '15'},
            		                            {text: '16', value: '16'},
            		                            {text: '17', value: '17'},
            		                            {text: '18', value: '18'},
            		                            {text: '19', value: '19'},
            		                            {text: '20', value: '20'},
            		                            {text: '21', value: '21'},
            		                            {text: '22', value: '22'},
            		                            {text: '23', value: '23'},
            		                            {text: '24', value: '24'}
            		                        ]
            	                         }, {
            		                        name : 'mins',
            	                            title: 'Min',
            		                        data : [
            		                            {text: '00', value: '00'},
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
            		                        ]
            		                    }
            		                ]
            		            }
			                },
			                {
			        		    xtype: 'selectfield',
			                    name: 'orderTypeId',
			                    label: 'Type',
			                    store: Ext.AceRoute.store.orderTypeStore,
			                    displayField : 'ordertype_name',
			                    valueField : 'ordertype_id',
			                    value: this.order_typeid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.order_typeid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			               {
			        		    xtype: 'selectfield',
			                    name: 'priorityTypeId',
			                    label: 'Priority',
			                    store: Ext.AceRoute.store.priorityStore,
			                    displayField : 'priorityType',
			                    valueField : 'priority_id',
			                    value: this.order_prtid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.order_prtid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
			        		    xtype: 'selectfield',
			        		    id: 'contactId',
			                    name: 'contactId',
			                    label: 'Contact',
			                    store: custContactStore,
			                    displayField : 'contact_displayname',
			                    valueField : 'contact_id',
			                    value: this.cust_contactid,
			                    listeners: { 
				                    change: { 
				                     	fn: function(src, value){
				                     		this.cust_contactid = value;
				                     	},
				                     	scope: this 
				                     }
			                    }
			                },
			                {
            	                xtype: 'schpickerfield',
            		            name: 'orderStartWindow',
            		            id: 'orderStartWindowId', 
            		            label: 'StartWin<br/><font size="1">(H:M)</font>',
            		            value: this.order_startwin,
            		            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
            		                                           // if the could names do not match then, it will not be replaced.
            		            //valueFormat: 'hour:mins',
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
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
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
			                },
			                {
            	                xtype: 'schpickerfield',
            		            name: 'orderEndWindow',
            		            id: 'orderEndWindowId', 
            		            label: 'EndWin<br/><font size="1">(H:M)</font>',
            		            value: this.order_endwin,
            		            valueFormat: 'hour:mins ampm', // note that we are using the column names in the format.
            		                                           // if the could names do not match then, it will not be replaced.
            		           // valueFormat: 'hour:mins',
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
            		                            {text: '15', value: '15'},
            	                                {text: '30', value: '30'},
            		                            {text: '45', value: '45'},
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
			                },
			                {
			                	xtype:'toolbar',
			                	ui: 'light',
			        	        dock: 'top',
			        	        items: [{
			        	        	xtype: 'button',
			        	    		text:'Save',
			        	            iconMask: true,
			        	            stretch: false,
			        	            scope: this,
			        	            handler: function(event, btn) {
			        	            	
			        	            	var cust_contactid = this.cust_contactid;
	        	            			var cust_id = this.cust_id;
	        	            			var cust_siteid = this.cust_siteid;
	        	            			var dragged = false;
	        	            			var event_geocode = this.event_geocode;
	        	            			var loginRef = Ext.AceRoute.loginref;
	        	            			var order_flg = '0|';
	        	            			var order_id = this.order_id;
	        	            			var order_inst = this.order_inst;
	        	            			var order_name  = this.order_name;
	        	            			var order_notes = this.order_notes;
	        	            			var order_po = this.order_po;
	        	            			var order_prtid = this.order_prtid;
	        	            			var order_recid = this.order_recid;
	        	            			var order_typeid = this.order_typeid;
	        	            			var order_wkfid = this.order_wkfid;
	        	            			var res_id = this.res_id;
	        	            			var reset = 0;
	        	            			var resource_addid = this.resource_addid;
	        	            			var type = 'true';
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
			        	            			resource_addid,
			        	            			type,
			        	            			url,
			        	            			wkfid_upd);
			        	            }
			        	        }]
			                }
		          	]
				})
             ]
               
        });        
    	
    	//orderStoreUpdateLocal.sync();
    	return addOrderLocal;
    },
    updateCustStores: function(custId, ajaxUtil){
    	var custSiteXmlDataTemp = ajaxUtil.invokeUrlGetXml(
				Ext.AceRoute.appUrl+"?action=getsite&cust_id="+this.cust_id+'&mtoken='+Ext.AceRoute.loginref);
 		
 	    var custSiteStoreTemp
	    	= new Ext.data.Store({
			    autoLoad: true,
			    id:'customerSiteStoreTemp',
	    		name: 'customerSiteStoreTemp',
	    		model: 'CustomerSite',
			    data : custSiteXmlDataTemp,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'xml',
			            record: 'site'
			        }
			    }
			});
 	     
 	   var custContactXmlDataTemp = ajaxUtil.invokeUrlGetXml(
				Ext.AceRoute.appUrl+"?action=getcontact&cust_id="+this.cust_id+'&mtoken='+Ext.AceRoute.loginref);
 	   
       var custContactStoreTemp
   	    	= new Ext.data.Store({
   			    autoLoad: true,
   			    model: 'CustomerContact',
   			    data : custContactXmlDataTemp,
   			    proxy: {
   			        type: 'memory',
   			        reader: {
   			            type: 'xml',
   			            record: 'contact'
   			        }
   			    }
   			});
 		
        cmp = Ext.getCmp('contactId');
	    	cmp.setValue(' '); // notice space
	    	var contactStore = cmp.store; //Ext.StoreMgr.get('customerSiteStore');
	    	contactStore.removeAll();
	    	custContactStoreTemp.each(function(record){
	    		contactStore.add(record.copy());
 		});
	    	contactStore.clearFilter();
 		
	    	cmp = Ext.getCmp('contactSiteId');
	    	cmp.setValue(' '); // notice space
	    	var custSiteStore = cmp.store; //Ext.StoreMgr.get('customerSiteStore');
	    	custSiteStore.removeAll();
	    	custSiteStoreTemp.each(function(record){
 			custSiteStore.add(record.copy());
 		});
 		custSiteStore.clearFilter();
    },
    addOrSaveOrder: function (cust_contactid, cust_id, cust_siteid ,
			dragged, event_geocode, loginRef,
			order_flg, order_id, order_inst, order_name, order_notes,
			order_po, order_prtid, order_recid, order_typeid, order_wkfid, 
			reset, res_id, resource_addid,
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
     			res_addid:		resource_addid,
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
    },
    submit: function(url, success, failure, messages, arguments){
    	Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: messages,
            success: success,
            failure: failure,
            argument: arguments
        });
    },
    
   custContactResponseHandler: function(re)
	{
		var req = re.currentTarget;
		if (req.readyState == 4)
	    {
	        // Make sure the status is "OK"
	        if (req.status == 200)
	        {
	            var xmlDoc = req.responseText;
	            //alert('someResponseHandler 2'+xmlDoc);
				//arguments.callee.caller.apply();
				var funcToCall = req.arguments.invokeFunc;
				var callerObj = req.arguments.callerObject;
				var paramToPass = req.arguments.param;
				
	            this.custContactStore
	            	= new Ext.data.Store({
	        		    autoLoad: true,
	        		    model: 'CustomerContact',
	        		    data : req.responseXML,
	        		    proxy: {
	        		        type: 'memory',
	        		        reader: {
	        		            type: 'xml',
	        		            record: 'contact'
	        		        }
	        		    }
	        		});
	            
	            funcToCall.apply(callerObj, [this.custContactStore]);
	        }
	        else
	        {
	            alert("There was a problem retrieving the XML data:\n" +req.statusText);
	        }
	    }
		
	},
	setCustContactStore: function(st){
		this.custContactStore = st;
		Ext.getCmp('contactId').store.data = st.data;
		Ext.getCmp('contactId').store.sync();
		//Ext.getCmp('contactId').store.load();
	},

    reloadEntitiesSuccess: function(re){
    	try {
    		var args = arguments;
    		var store = new Ext.data.Store({
    		    autoLoad: true,
    		    model: 'Order',
		  		  sorters: [
		  		        {
		  		          property: 'jobsGroupName',
		  		          direction: 'ASC'
		  		        },
		  		        {
		  		    	  property: 'start_date',
		  		    	  direction: 'ASC'
		  		        }
		  		  ],
		  		  getGroupString: function(r){
		            return r.get('jobsGroupName'); 
		          }, 
    		    data : re.responseXML,
    		    proxy: {
    		        type: 'memory',
    		        reader: {
    		            type: 'xml',
    		            record: 'event'
    		        }
    		    }
    		});
            var argsPassedToFunc;
    		if(args.length > 1){
    			argsPassedToFunc = args[1];
    			var caller = argsPassedToFunc.argument.caller;
    			var fromDateToShow = argsPassedToFunc.argument.from;
    			var toDateToShow = argsPassedToFunc.argument.to;
    			var direction = argsPassedToFunc.argument.direction;
    			
    			argsPassedToFunc.argument.invoke.apply(caller, [store, fromDateToShow, toDateToShow, direction]);
    		}
    	}catch(e){
    		alert(' exception '+e);
    	}
    },
    showOrderAddressOnMap: function(orderData){
    	alert('showOrderAddressOnMap')
    	this._controller.isMapRenderingCompleteOnAddressClick = false;
    	this._controller.refreshMapTab(orderData);
    	this._controller.isMapRenderingCompleteOnAddressClick = true;
    }
    
});

Ext.reg('sessionlistXml', Ext.AceRoute.view.SessionListXml); 

failure = function(r){
    var a = r.argument;
}

submit = function(url, success, failure, messages, arguments){
	Ext.Ajax.request({
        url: url,
        method: 'POST',
        params:{},
        success: success,
        failure: failure,
        argument: arguments
    });
}

reloadEntitiesSuccess = function(r){
	try {
		var args = arguments;
		//note how we set the 'root' in the reader to match the data structure above
		var store = new Ext.data.Store({
		    autoLoad: true,
		    model: 'ContactDetail',
		    data : r.responseXML,
		    proxy: {
		        type: 'memory',
		        reader: {
		            type: 'xml',
		            record: 'user'
		        }
		    }
		});
        
		var index = store.findExact('id','1');
	  	var dataMatch = store.getAt(index);
        var d = dataMatch.data;
 
        var idValue,nameValue,emailValue;
        var currentDate = new Date();
        var startDateSelected = null;
        
       
        
//        sessionCard =  new Ext.Panel({
//            fullscreen: true,
//            layout: {
//                type: 'vbox',
//                align: 'center',
//                pack: 'center'
//            },
//            items: [{
//                xtype: 'button',
//                ui: 'normal',
//                text: 'Show DateTimePicker',
//                handler: function() {
//					datetimePicker.show();
//                }
//            }]
//        });
        
        
        
        var num = 0;
        
	}catch(e){
		alert(' exception '+e); 
	}
}

function onSaveBtn(){
	alert('onSaveBtn'); 
}

handleResponse = function(r){
//	alert("Data has been saved successfully.");
//	Ext.Msg.alert('', 'Data has been saved successfully.', Ext.emptyFn);
	var msg = new Ext.MessageBox({
		buttons: Ext.MessageBox.OKCANCEL, 
		modal : true
	});
	
	msg.show({
		msg: 'Saved Successfully.'
	});
	Ext.StoreMgr.get('orderStore').read();
}