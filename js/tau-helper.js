/*global tau*/
(function() {
    function createListHelper() {
        var listHelper = [],
            i;
        if(tau.support.shape.circle){
        	document.addEventListener("pagebeforeshow", function(e){
        		var list = e.target.querySelectorAll(".ui-listview"),
        			len;
        		if(list){
        			len = list.length;
        			for(i=0; i < len;i++){
        				listHelper[i] = tau.helper.SnapListStyle.create(list[i]);
        			}
        		}
        	});
        }
    };
    function createListHelper() {
        var listHelper = [],
            i;
     
        if (tau.support.shape.circle) {
     
            document.addEventListener("pagebeforehide", function() {
                var len = listHelper.length;
     
                if (len) {
                    for (i = 0; i < len; i++) {
                        listHelper[i].destroy();
                    }
                    listHelper = [];
                }
            });
        }
    };

    var elmPageDetail = document.querySelector("#page-detail"),
    elmMarquee = document.querySelector("#title-detail"),
    wgtMarquee;
 
function pageDetailShowHandler() {
    wgtMarquee = new tau.widget.Marquee(elmMarquee, {
        marqueeStyle: "endToEnd"
    });
 
    elmMarquee.addEventListener("marqueeend", marqueeEndHandler);
}

function marqueeEndHandler() {
    wgtMarquee.start();
}
function pageDetailHideHandler() {
    wgtMarquee.destroy();
    wgtMarquee = null;
}
elmPageDetail.addEventListener("pageshow", pageDetailShowHandler, false);
elmPageDetail.addEventListener("pagehide", pageDetailHideHandler, false);

    
    createListHelper();
}());