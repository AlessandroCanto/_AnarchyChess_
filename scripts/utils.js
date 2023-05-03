
CHESSAPP.utils = (function(){
	this.extend = function(firstObj, secondObj){
		for(prop in secondObj){
			firstObj[prop] = secondObj[prop];
		}
		return firstObj;
	};
	this.bind = null;
	this.removeClass = function(elem, className){
		//case sensitative, global
		var regex = new RegExp("(^| )" + className + "( |$)", "gi");

		var curClass = elem.className;
		curClass = curClass.replace(regex, "");
		elem.className = curClass;
	}
	this.addClass = function(elem, className){
		if(elem.className != ""){
			this.removeClass(elem, className);
		}
		elem.className += " " + className;        
	}
	this.shallowCopy = function(o){
		var c = {};
		for(var p in o){
			if(o.hasOwnProperty(p)){
				c[p] = o[p];
			}
		}
		return c;
	}

	return this;
})();


if(typeof window.addEventListener === "function"){
	CHESSAPP.utils.bind = function(elem, type, fn){
		elem.addEventListener(type, fn, false);
	}
	CHESSAPP.utils.unbind = function(elem, type, fn){
		elem.removeEventListener(type, fn, false);
	}
}
else if(typeof attachEvent === "function"){
	CHESSAPP.utils.bind = function(elem, type, fn){
		elem.attachEvent("on" + type, fn);
	}
	CHESSAPP.utils.unbind = function(elem, type, fn){
		elem.detachEvent("on" + type, fn);
	}
}
else{
	CHESSAPP.utils.bind = function(elem, type, fn){
		elem["on" + type] = fn;
	}
	CHESSAPP.utils.unbind = function(elem, type, fn){
		elem["on" + type] = null;
	}
}

