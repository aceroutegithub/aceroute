
function init() {
    // the next line makes it impossible to see Contacts on the HTC Evo since it
    // doesn't have a scroll button
    // document.addEventListener("touchmove", preventBehavior, false);
    document.addEventListener("deviceready", function () {
    	//var appController = new Ext.AceRoute.controller.AppController();
    }, false);
}
