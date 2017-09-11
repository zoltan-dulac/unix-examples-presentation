/*
* Requires is.js
*/

/******************************************************************
* Implements ideas from 
* http://spaces.msn.com/members/siteexperts/Blog/cns!1pNcL8JwTfkkjv4gg6LkVCpw!1805.entry
* Allows one to create browser specific css rules inside of CSS of this form:
*
*   html.opera div.className {
*	// CSS that only opera will read
*   }
* 
*   html.gecko.minor1.1 {
*	CSS that only mozilla based browser that use gecko 1.1 
*   }
********************************************************************/

var ConditionalCSS = new function () {
	
	var me = this;
	
	function init () {	
		var sb = new StringBuffer();
		var html = document.getElementsByTagName('html')[0];
		
		//Logger.info(domShowProps(navigator));
		sb.append(StringHelpers.sprintf("%s_%s_%s ",
			BrowserDetect.browser, BrowserDetect.version, BrowserDetect.OS)); 

		sb.append(StringHelpers.sprintf("%s_%s ",
			BrowserDetect.browser, BrowserDetect.version));
			
		sb.append(StringHelpers.sprintf("%s_%s ",
			BrowserDetect.browser, BrowserDetect.OS));

		sb.append(StringHelpers.sprintf("%s ",
			BrowserDetect.OS));

		sb.append(StringHelpers.sprintf("%s ",
			BrowserDetect.browser));
		
		if (BrowserDetect.dataRenderingEngine) {
			sb.append(StringHelpers.sprintf("%s ",
				BrowserDetect.renderingEngine.name));
		}

		sb.append(" js");
	
		
	
		html.className = sb.toString().replace(/\./g, '_');
	}
	
	init();
}