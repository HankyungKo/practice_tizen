/*global tau*/
(function() {
    var XML_METHOD = "GET",
        CHART_TYPE = ["game", "life", "education"],
        CATEGORY_CODE = {
            "game": "DP01",
            "life": "DP04",
            "education": "DP08"
        },
        API_ADDRESS = "http://apis.skplanetx.com/tstore/categories/",
        API_VERSION = "1",
        CHART_SIZE = 15,
        SORT_ORDER = "F",
        APP_KEY = "302fdebc-c9da-3651-8d3a-6f84a3f29ae7",
        LIST_CLASSNAME = {
            "li": "li-has-multiline li-has-thumb-left",
            "span": "ui-li-sub-text li-text-sub",
            "img": "ui-li-thumb-left"
        };

    function emptyElement(elm) {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
        }

        return elm;
    }

    function getStarScore(score) {
        var roundScore = Math.round(score * 2),
            starScore = "",
            i;

        for (i = roundScore; i > 1; i -= 2) {
            starScore += "★";
        }
        if (i >= 1) {
            starScore += "☆";
        }

        return starScore;
    }

    function showDetail(title, data) {
    	var elmTitle = document.querySelector("#title-detail"),
    		elmListDetail = document.querySelector("#ui-list-detail"),
    		elmRowDescription = document.createElement("li"),
    		elmRowIcon = document.createElement("li"),
            elmIcon;

    	 
        emptyElement(elmTitle).appendChild(document.createTextNode(title));
     
        emptyElement(elmListDetail);
        
        elmIcon = document.createElement("div");
        elmIcon.className = "icon-download";
        if (data["download"] >= 1000000) {
            elmIcon.style.backgroundImage = "url('./image/download-03.png')";
            elmIcon.appendChild(document.createTextNode(Math.floor(data["download"] / 1000000)));
        } else if (data["download"] >= 10000) {
            elmIcon.style.backgroundImage = "url('./image/download-02.png')";
            elmIcon.appendChild(document.createTextNode(Math.floor(data["download"] / 10000)));
        } else if (data["download"] >= 100) {
            elmIcon.style.backgroundImage = "url('./image/download-01.png')";
            elmIcon.appendChild(document.createTextNode(Math.floor(data["download"] / 100)));
        } else {
            elmIcon.style.backgroundImage = "url('./image/download-00.png')";
            elmIcon.appendChild(document.createTextNode(data["download"]));
        }
        elmRowIcon.appendChild(elmIcon);

        elmIcon = document.createElement("div");
        elmIcon.className = "icon-score";
        elmIcon.style.backgroundImage = "url('./image/score-01.png')";
        elmIcon.appendChild(document.createTextNode(data["score"].toFixed(1)));
        elmRowIcon.appendChild(elmIcon);

        
        elmRowDescription.appendChild(document.createTextNode(data["description"]));
        elmRowDescription.setAttribute("id", "detail-description");
     
        elmListDetail.appendChild(elmRowIcon);
        elmListDetail.appendChild(elmRowDescription);
     
        
        tau.changePage("#page-detail");
        
    }

    function loadDataFromServer() {
    	var elmListChart,
        	elmRowChart,
        	elmSpanScore,
        	elmImgThumbnail,
        	detailData,
        	xmlhttp,
        	requestUrl,
        	j;
 
    	for (j = 0; j < CHART_TYPE.length; j++) {
    		elmListChart = document.querySelector("#ui-list-" + CHART_TYPE[j]);
    		requestUrl = API_ADDRESS +
        	 		 CATEGORY_CODE[CHART_TYPE[j]] +
        	 		 "?version=" + API_VERSION +
        	 		 "&count=" + CHART_SIZE +
        	 		 "&order=" + SORT_ORDER +
        	 		 "&appKey=" + APP_KEY;
    		xmlhttp = new XMLHttpRequest();
    		xmlhttp.open(XML_METHOD, requestUrl, false);
    		xmlhttp.onreadystatechange = function() {
    			var xmlResponse;
    	 
    			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
    				xmlResponse = JSON.parse(xmlhttp.responseText);
    				xmlResponse = xmlResponse.tstore.products.product;
    				for (i = 0; i < CHART_SIZE; i++) {
    					elmRowChart = document.createElement("li");
    					elmRowChart.className = LIST_CLASSNAME["li"];
    					elmRowChart.appendChild(document.createTextNode(xmlResponse[i].name));
    					
    					elmSpanScore = document.createElement("span");
    					elmSpanScore.className = LIST_CLASSNAME["span"];
    					elmSpanScore.appendChild(document.createTextNode(getStarScore(xmlResponse[i].score)));
    					elmRowChart.appendChild(elmSpanScore);
    	 
    	            
    					elmImgThumbnail = document.createElement("img");
    					elmImgThumbnail.className = LIST_CLASSNAME["img"];
    					elmImgThumbnail.src = xmlResponse[i].thumbnailUrl;
    					elmRowChart.appendChild(elmImgThumbnail);
    	 
    					detailData = {
    						"download": xmlResponse[i].downloadCount,
    	                    "score": xmlResponse[i].score,
    	                    "description": xmlResponse[i].description
    					};
    					elmRowChart.addEventListener("click", showDetail.bind(this, xmlResponse[i].name, detailData));

    	            
    					elmListChart.appendChild(elmRowChart);
    				}
    			}
    	    xmlhttp = null;
    	
    		};
    		xmlhttp.send();
    	}
    	
    	
    	

    }

    function keyEventHandler(ev) {
    	var page = document.getElementsByClassName("ui-page-active")[0],
        pageId = page ? page.id : "";
    	
    	if (ev.keyName === "back") {
            if (pageId === "page-main") {
            	try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            } else {
                window.history.back();
            }
        }
    }

    function addDefaultEvents() {
        window.addEventListener("tizenhwkey", keyEventHandler);
    }

    function init() {
        addDefaultEvents();
        loadDataFromServer();
    }

    window.onload = init;
}());