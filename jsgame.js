"use-strict";

const jsgi = {
	"name": "JSGame",
	"version": "Prerelease-1",
	"author": "Sv443",
	"desc": "Collision, Raytracing, Animation, Notification, Menu"
}

var qstr = window.location.search.substring(1);
var urlhost = window.location.host, urlpath = window.location.pathname, cururl = urlhost + urlpath, fullurl = cururl + "?" + qstr;

var clscel = gebtn("script"), cwm = false;for(var i = 0; i < clscel.length; i++){if(clscel[i].getAttribute("jsg_disable_watermark") == "true") cwm = true;}
if(!cwm) console.log("%c Powered by " + jsgi.name + " v" + jsgi.version + " - © " + jsgi.author + " 2018 ( https://sv443.net/ ) - licensed under the MIT license ", "background-color:#454545;color:white;padding:0.2em;font-size:1.3em;");


// minified js-cookie script ( https://github.com/js-cookie/js-cookie )
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function g(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}return function e(l){function C(e,n,o){var t;if("undefined"!=typeof document){if(1<arguments.length){if("number"==typeof(o=g({path:"/"},C.defaults,o)).expires){var r=new Date;r.setMilliseconds(r.getMilliseconds()+864e5*o.expires),o.expires=r}o.expires=o.expires?o.expires.toUTCString():"";try{t=JSON.stringify(n),/^[\{\[]/.test(t)&&(n=t)}catch(e){}n=l.write?l.write(n,e):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var i="";for(var c in o)o[c]&&(i+="; "+c,!0!==o[c]&&(i+="="+o[c]));return document.cookie=e+"="+n+i}e||(t={});for(var a=document.cookie?document.cookie.split("; "):[],s=/(%[0-9A-Z]{2})+/g,f=0;f<a.length;f++){var p=a[f].split("="),d=p.slice(1).join("=");this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1));try{var u=p[0].replace(s,decodeURIComponent);if(d=l.read?l.read(d,u):l(d,u)||d.replace(s,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(e===u){t=d;break}e||(t[u]=d)}catch(e){}}return t}}return(C.set=C).get=function(e){return C.call(C,e)},C.getJSON=function(){return C.apply({json:!0},[].slice.call(arguments))},C.defaults={},C.remove=function(e,n){C(e,"",g(n,{expires:-1}))},C.withConverter=e,C}(function(){})});





const Menu = new function() {
	this.new = function(id, title, innerhtml, width, height, border_rounded, closable_ESC, closable_btn, on_close, close_img_src) {
		if(typeof id == "string" && typeof title == "string" && typeof innerhtml == "string" && typeof width == "number" && typeof height == "number") {
			if(gebid("jsg_menu_" + id) != null) {
				console.error("a menu with the ID " + id + " already exists - not creating a new one");
				return;
			}
			
			if(isempty(border_rounded)) border_rounded = true;
			if(typeof closable_ESC != "boolean") closable_ESC = true;
			if(typeof closable_btn != "boolean") closable_btn = true;
			if(isempty(on_close)) on_close = function(){};
			if(isempty(close_img_src)) close_img_src = "https://sv443.net/resources/images/jsg_menu_close.png";

			var menuelem = document.createElement("div");
			menuelem.style.display = "none";
			menuelem.style.opacity = "0";
			menuelem.style.transition = "opacity 0.3s ease-in";
			menuelem.id = "jsg_menu_" + id;
			menuelem.style.position = "fixed";
			menuelem.style.top = ((100 - height) / 2) + "vh";
			menuelem.style.left = ((100 - width) / 2) + "vw";
			menuelem.style.width = width + "vw";
			menuelem.style.height = height + "vh";
			menuelem.style.padding = "0.2em";
			menuelem.style.border = "0.25em solid #454545";
			if(border_rounded) menuelem.style.borderRadius = "1.2em"; else menuelem.style.borderRadius = "0";
			if(closable_btn) closebtnih = '<img onclick="Menu.close(\'' + id + '\')" class="jsg_menuclosebtn" title="Close" src="https://raw.githubusercontent.com/Sv443/JSGame/master/closebtn.png" style="cursor:pointer;position:absolute;top:0;right:0;width:1.5em;height:1.5em;">'; else closebtnih = "";
			menuelem.style.backgroundColor = "#ddd";

			menuelem.innerHTML="<div class='jsg_menutitle' style='font-size:1.5em;text-align:center;'>" + title + "</div>"
			+ closebtnih + "<br>" + innerhtml;

			document.body.appendChild(menuelem);

			if(closable_ESC) document.addEventListener("keydown", e => {if(e.keyCode == 27) Menu.close(id);});
		}
		else {
			console.error("the arguments for Menu.new() are wrong");
			return false;
		}
	}
	this.close = function(id) {
		try {
			setTimeout(()=>{gebid("jsg_menu_" + id).style.display = "none";},500);
			gebid("jsg_menu_" + id).style.opacity = "0";
			gebid("jsg_menu_" + id).style.transition = "opacity 0.3s ease-in";
		}
		catch(err) {
			console.error("couldn't find menu with id " + id + ". Is the ID correct and was the menu created correctly?");
			return false;
		}
	}
	this.open = function(id) {
		try {
			gebid("jsg_menu_" + id).style.display = "block";
			setTimeout(()=>{
				gebid("jsg_menu_" + id).style.opacity = "1";
				gebid("jsg_menu_" + id).style.transition = "opacity 0.3s ease-out";
			},20);
		}
		catch(err) {
			console.error("couldn't find menu with id " + id + ". Is the ID correct and was the menu created correctly?");
			return false;
		}
	}
	this.theme = function(id, theme) {
		try {
			if(theme == "dark") {
				gebid("jsg_menu_" + id).style.backgroundColor = "#454545";
				gebid("jsg_menu_" + id).style.color = "white";
				gebid("jsg_menu_" + id).style.borderColor = "#ddd";
				gebid("jsg_menu_" + id).style.transition = "background-color 0.4s ease-out, color 0.4s ease-out, border-color 0.4s ease-out";
			}
			else {
				gebid("jsg_menu_" + id).style.backgroundColor = "#ddd";
				gebid("jsg_menu_" + id).style.color = "black";
				gebid("jsg_menu_" + id).style.borderColor = "#454545";
				gebid("jsg_menu_" + id).style.transition = "background-color 0.4s ease-out, color 0.4s ease-out, border-color 0.4s ease-out";
			}
		}
		catch(err) {
			console.error("couldn't find menu with id " + id + ". Is the ID correct and was the menu created correctly?");
			return false;
		}
	}
	this.setInnerHTML = function(id, inner_html) {
		try {
			gebid("jsg_menu_" + id).innerHTML = inner_html;
		}
		catch(err) {
			console.error("couldn't find menu or inner_html is not valid");
			return false;
		}
	}
	this.setOuterHTML = function(id, outer_html) {
		try {
			gebid("jsg_menu_" + id).outerHTML = outer_html;
		}
		catch(err) {
			console.error("couldn't find menu or outer_html is not valid");
			return false;
		}
	}
}

const Audio = new function() {
	this.new = function(id, src, preload) {
		if(preload === false) preload = false; else if(isempty(preload)) preload = true; else preload = true;
		if(id != "demo"){if(isempty(id) || isempty(src)){console.error("values for Audio.new() can't be left undefined, empty or null!");return;}}
		if(id == "demo"){src="https://raw.githubusercontent.com/Sv443/TextAdventureGame/master/fallingtree0.mp3";}
		
		var audio = document.createElement("audio");
		if(!preload) audio.preload="none"; else audio.preload="auto";
		audio.id="jsg_audio" + id;
		audio.controls="false";
		audio.innerHTML='<source src="' + src + '">';
		audio.style="position:fixed;top:120vh;display:none;";
		document.body.appendChild(audio);
	}
	this.play = function(id) {
		if(isempty(gebid("jsg_audio" + id))){console.error("you need to create the audio before you try to play it or you entered the wrong id");return;}
		gebid("jsg_audio" + id).play();
	}
	this.pause = function(id) {
		if(isempty(gebid("jsg_audio" + id))){console.error("you need to create the audio before you try to pause it or you entered the wrong id");return;}
		gebid("jsg_audio" + id).pause();
	}
	this.stop = function(id) {
		if(isempty(gebid("jsg_audio" + id))){console.error("you need to create the audio before you try to stop it or you entered the wrong id");return;}
		gebid("jsg_audio" + id).pause();
		gebid("jsg_audio" + id).currentTime=0;
	}
	this.setTime = function(id, time) {
		if(isempty(gebid("jsg_audio" + id))){console.error("you need to create the audio before you try to set its time it or you entered the wrong id");return;}
		gebid("jsg_audio" + id).currentTime=time;
	}
	this.getTime = function(id) {
		if(isempty(gebid("jsg_audio" + id))){console.error("you need to create the audio before you try to get its time it or you entered the wrong id");return;}
		return gebid("jsg_audio" + id).currentTime;
	}
	this.volume = function(id, volume) { // volume must be a float (between 0 and 1.0)
		if(isempty(gebid("jsg_audio" + id))){console.error("you need to create the audio before you try to change the volume or you entered the wrong id");return;}
		gebid("jsg_audio" + id).volume=volume;
	}
	this.loop = function(id, looping) {
		if(isempty(gebid("jsg_audio" + id))){console.error("you need to create the audio before you try to activate/deactivate the looping attribute or you entered the wrong id");return;}
		if(looping !== false && looping !== true){console.error("you need to enter either true or false in the Audio.loop() function");return;}
		if(looping) gebid("jsg_audio" + id).setAttribute("loop", "true");
		else gebid("jsg_audio" + id).removeAttribute("loop");
	}
}

const Coll = new function() {
	this.isColliding = function(a, b){
		if(typeof a != "object" || typeof b != "object") {console.error("The attributes in the Coll.isColliding() function need to be HTML elements and can't be left empty!");return false;}
		var coll = !(((a.y + a.height) < (b.y)) || (a.y > (b.y + b.height)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
		if(coll) document.dispatchEvent(new Event("collision"));
		return coll;
	}
	this.boundingRect = function(a, b) {
		if(typeof a != "object" || typeof b != "object") {console.error("The attributes in the Coll.boundingRect() function need to be HTML elements and can't be left empty!");return false;}
		if(a.getBoundingClientRect().top < b.getBoundingClientRect().bottom) var col1 = true;
		else var col1 = false;
		if(a.getBoundingClientRect().bottom > b.getBoundingClientRect().top) var col2 = true;
		else var col2 = false;
		if(a.getBoundingClientRect().right > b.getBoundingClientRect().left) var col3 = true;
		else var col3 = false;
		if(a.getBoundingClientRect().left < b.getBoundingClientRect().right) var col4 = true;
		else var col4 = false;

		if(col1 && col2 && col3 && col4){document.dispatchEvent(new Event("br_collision"));return true;}
		else return false;
	}
}

const Ray = new function() {
	this.cast = function(id, on_element, length, width, initial_rotation, collide_with, on_collide, increments, ray_texture, collider_texture) {
		if(!isempty(id) && typeof on_element == "object" && typeof length == "string" && typeof width == "string" && typeof initial_rotation == "string" && typeof collide_with == "object" && typeof on_collide == "function" && typeof increments == "number") {
			if(isempty(ray_texture)) ray_texture = "https://sv443.net/resources/images/blank.png";
			if(isempty(collider_texture)) collider_texture = "https://sv443.net/resources/images/blank.png";
			on_element.style.position="relative";
			var ray = document.createElement("img");
			ray.id="jsg_ray_" + id;
			ray.style.position="absolute";
			ray.style.left="calc(50% - " + width + " / 2)";
			ray.style.top="50%";
			ray.style.src=ray_texture;
			ray.style.width=width;
			ray.style.height=length;
			ray.dataset.rotation=initial_rotation.replace("deg", "");
			ray.style.transform="rotate(" + (parseInt(initial_rotation) - 180) + "deg)";
			ray.style.transformOrigin="top center";
			on_element.appendChild(ray);

			var b = 0, rbcs = [];
			for(var i = 0; i < increments; i++) {
				var raybc = document.createElement("img");
				raybc.id="jsg_ray_" + id + "_raybc_" + i;
				raybc.className="jsg_ray_" + id + "_raybcs";
				raybc.style.position="absolute";
				raybc.style.left="0%";
				raybc.style.bottom=b + "%";
				raybc.style.src=collider_texture;
				raybc.style.width=width;
				raybc.style.height=width;
				ray.appendChild(raybc);
				b += 100 / increments;

				rbcs.push(raybc);
			}

			setInterval(function(){
				if(isempty(gebid("jsg_ray_" + id))) return;
				var colliding = false;
				for(var ii = 0; ii < collide_with.length; ii++) {
					if(Coll.boundingRect(ray, collide_with[ii])) {
						for(var i = 0; i < rbcs.length; i ++) {
							if(Coll.boundingRect(rbcs[i], collide_with[ii])) colliding = true;
						}
						on_collide(colliding);
					}
					else on_collide(colliding);
				}
			},50);
		}
		else{console.error("One or more of the attributes in the Ray.cast() function was missing or not correct!");return false;}
	}
	this.rotate = function(id, rotation, ease) {
		if(isempty(gebid("jsg_ray_" + id))) return;
		if(isempty(ease)) ease = "linear";
		if(!isempty(id) && !isempty(rotation)) {
			var ray = gebid("jsg_ray_" + id);
			ray.style.transform="rotate(" + (parseInt(rotation) - 180) + "deg)";
			ray.dataset.rotation=rotation.replace("deg", "");
			var trtm = "0.15";
			if(ease == "off" || !ease){trtm = "0"; ease = "linear";}
			ray.style.transition="transform " + trtm + "s " + ease;

			/*var raybc = gebid("jsg_ray_" + id + "_raybc");
			raybc.style.transform="rotate(-" + (parseInt(rotation) - 180) + "deg)";*/
		}
		else {
			console.error("One or more of the attributes in the Ray.rotate() function was missing or empty!");
		}
	}
	this.remove = function(id) {
		var ray = gebid("jsg_ray_" + id);
		ray.innerHTML="";
		ray.outerHTML="";
	}
	this.changeAttribute = function(id, attribute, value) {
		if(!isempty(id) && !isempty(attribute) && !isempty(value)) {
			if(attribute == "width") {
				gebid("jsg_ray_" + id).style.width=value;
				gebid("jsg_ray_" + id).style.left="calc(50% - " + value + " / 2)";
				var cwdthbcs = gebcn("jsg_ray_" + id + "_raybcs");
				for(var i = 0; i < cwdthbcs.length; i++) {
					cwdthbcs[i].style.width=value;
					cwdthbcs[i].style.height=value;
				}
			}
			if(attribute == "length") {
				gebid("jsg_ray_" + id).style.height=value;
			}
			else {
				console.error("The attribute of the Ray.changeAttribute() function can be either width or length, not " + attribute);
			}
		}
		else {
			console.error("The attributes of the Ray.changeAttribute() function can't be left empty!");
		}
	}
}

const Anim = new function() {
	this.new = function(id, element, states, interval) {
		if(typeof id != "string" || typeof element != "object" || !Array.isArray(states) || typeof interval != "number"){console.error("the arguments in the Anim.new() function are wrong!");return false;}
		
		var fa = 1;
		element.src = states[0];
		element.className="jsg_anim_" + id;
		element.dataset.anim_toggled = "on";
		
		for(var i = 0; i < states.length; i++) preloadImage(states[i]);

		setInterval(gts, interval);

		function gts() {
			if(element.dataset.anim_toggled == "off") {}
			else {
				element.src = states[fa];
				fa++;
				if(fa >= states.length) fa = 0;
			}
		}
	}
	this.toggle = function(id, on_off) {
		var anel = gebcn("jsg_anim_" + id)[0];
		if(on_off == "off") anel.dataset.anim_toggled = "off";
		else anel.dataset.anim_toggled = "on";
	}
	this.getState = function(id) {
		if(!isempty(gebcn("jsg_anim_" + id)[0]) && !isempty(gebcn("jsg_anim_" + id)[0].dataset.anim_toggled)) return gebcn("jsg_anim_" + id)[0].dataset.anim_toggled;
		else return "error";
	}
}

const Notif = new function() {
	this.grant = function() {
		if (!Notification) return false;
		
		if(Notification.permission !== "granted"){
			Notification.requestPermission();
			return true;
		}
	}
	this.send = function(title, body, icon_src, on_click) {
		if(isempty(icon_src)) icon_src = "";
		if(isempty(on_click) || typeof on_click != "function") on_click = function(){};
		if(isempty(title) || isempty(body) || typeof title != "string" || typeof body != "string"){console.error("The title and body attributes in the Notif.send() function have to be strings and can't be left empty");return false;}
		
		if(Notification.permission !== "granted") Notification.requestPermission();
		else {
		  	var notification = new Notification(title, {
				icon: icon_src,
				body: body
		 	});
			
		  	notification.onclick = function () {
				on_click();
		  	};
		}
	}
}

function copy(text) {
	var copyelem = document.createElement("textarea");
	copyelem.id="jsg_copyta";
	copyelem.innerHTML=text;
	document.body.appendChild(copyelem);
	gebid("jsg_copyta").select();
	document.execCommand("copy");
	clearih("jsg_copyta");
	clearoh("jsg_copyta");
}


function preloadImage(src) {
    var img = new Image();
    img.src=src;
}


















function gebid(id){return document.getElementById(id);}function gebcn(classname){return document.getElementsByClassName(classname);}function gebtn(tagname){return document.getElementsByTagName(tagname);}function isempty(string){if(string === undefined || string === null || string == "") return true;else return false;}
