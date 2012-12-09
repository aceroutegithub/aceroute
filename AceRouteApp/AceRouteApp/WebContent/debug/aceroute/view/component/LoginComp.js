Ext.AceRoute.view.LoginPanel1 = Ext.extend(Ext.Panel, {
	
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
    dropDownOptionToOpen: 'image',
      
    initComponent: function(){
 	
        this.dockedItems = [{
            xtype: 'toolbar',
            id:'toolbarId',
            scroll: 'horizontal',  
            items:[
				  {
					    ui: 'back',
					    text: 'Back',
					    scope: this,
					    handler: function(){
					        this.ownerCt.setActiveItem(this.prevCard, {
					            type: 'slide',
					            reverse: true,
					            scope: this,
					            after: function(){
					                this.destroy();
					            }
					        });
					    }
				   }
              ]
        }];
        this.listeners = {
            activate: { 
            	fn: function(){
            	
            	}, 
            	scope: this 
            }
        };
        Ext.AceRoute.view.LoginPanel1.superclass.initComponent.call(this);
    }
});
Ext.reg('login', Ext.AceRoute.view.LoginPanel1);
