/*
 * Orginally from http://www.quirksmode.org/js/detect.html. 
 * Modifications by Zoltan Hawryluk to allow for:
 *   - really strange Safari behaviour.
 *   - support for Fennec and Opera Mini.
 */
 

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.getVersion();
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	getVersion: function () {
		
		var version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| null;
		
		if (version >= 100) {
			if (this.browser == 'Safari') {
				version = this.getOlderSafariVersion(version);
			} else {
				version = 'an unknown version'
			}
		}
		
		return version;
	},
	/* This information from http://developer.apple.com/internet/safari/uamatrix.html */
	getOlderSafariVersion:  function (version) {
		if (version < 100) {
			return 1;
		} else if (version < 125.2) {
			return 1.1;
		} else if (version < 312.1) {
			return 1.2;
		} else if (version < 412) {
			return 1.3;
		} else if (version < 523.1) {
			return 2;
		} else if (version <= 523.12) {
			return 3;
		}
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			versionSearch: "Chrome/",
			identity: "Chrome"
			
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			versionSearch: navigator.userAgent.indexOf("Version")!=-1?"Version":null,
			identity: "Safari"
		},
		{
			string: navigator.appVersion,
			subString: "Opera Mini",
			identity: "Opera Mini",
			versionSearch: "Opera Mini"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Fennec",
			identity: "Fennec"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		},
		{
			string: navigator.userAgent,
			subString: "J2ME/MIDP",
			identity: "J2ME"
		}
	]

};
BrowserDetect.init();