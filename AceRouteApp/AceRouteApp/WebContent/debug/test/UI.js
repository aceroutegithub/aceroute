Ext.ns("news","demos","Ext.ux");Ext.ux.UniversalUI=Ext.extend(Ext.Panel,{fullscreen:true,layout:"card",backText:"Back",useTitleAsBackText:true,initComponent:function(){this.navigationButton=new Ext.Button({hidden:Ext.is.Phone||Ext.Viewport.orientation=="landscape",text:"Navigation",handler:this.onNavButtonTap,scope:this});this.navigationBar=new Ext.Toolbar({ui:"dark",dock:"top",title:this.title});this.navigationPanel=new Ext.NestedList({store:news.StructureStore,updateTitleText:false,dock:"left",listeners:{itemtap:this.onNavPanelItemTap,scope:this}});if(!Ext.is.Phone){this.navigationPanel.setWidth(250);}this.dockedItems=this.dockedItems||[];this.dockedItems.unshift(this.navigationBar);if(!Ext.is.Phone&&Ext.Viewport.orientation=="landscape"){this.dockedItems.unshift(this.navigationPanel);}else{if(Ext.is.Phone){this.items=this.items||[];this.items.unshift(this.navigationPanel);}}Ext.ux.UniversalUI.superclass.initComponent.call(this);},onNavPanelItemTap:function(subList,subIdx,el,e){var store=subList.getStore(),record=store.getAt(subIdx),recordNode=record.node,nestedList=this.navigationPanel,title=nestedList.renderTitleText(recordNode),card,preventHide,anim;if(record){card=record.get("card");anim=record.get("cardSwitchAnimation");preventHide=record.get("preventHide");}if(Ext.Viewport.orientation=="portrait"&&!Ext.is.Phone&&!recordNode.childNodes.length&&!preventHide){this.navigationPanel.hide();}if(card){this.setActiveItem(card,anim||"slide");this.currentCard=card;}}});news.Main={init:function(){this.ui=new Ext.ux.UniversalUI({navigationItems:news.Structure});}};Ext.setup({glossOnIcon:false,onReady:function(){news.Main.init();}});Ext.ns("demos","demos.Data");