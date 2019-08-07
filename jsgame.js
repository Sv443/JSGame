/**
 * JSGame - a lightweight library that makes game development with vanilla JS easier
 * © 2019 Sv443 (https://sv443.net/ - https://github.com/Sv443)
 * 
 * Licensed under the MIT license: https://sv443.net/LICENSE
 * Usage, redistribution and monetization of this library is only allowed if you follow the terms listed in the MIT license
 * 
 * 
 * @license MIT
 * @author Sv443
 * @version 0.2.0
 */

"use-strict";
var jsg = {};

jsg.info = {
	name: "JSGame",
	version: "0.2.0",
    authorShort: "Sv443",
    authorLong: "Sv443 <sven.fehler@web.de> (https://sv443.net/)",
    desc: "",
	features: "Collision, Raytracing, Animation, Notification, Menu",
}

let watermarkEnabled = true;
document.head.childNodes.forEach(cn => {
    if(cn.attributes != undefined)
    {
        let jsgidx = undefined;
        for(let i = 0; i < cn.attributes.length; i++)
        {
            if(cn.nodeName == "META" && cn.attributes[i].name == "name" && cn.attributes[i].value == "jsgame_watermark_enabled") jsgidx = i;
        }
        if(cn.attributes[jsgidx + 1] != undefined) if(cn.attributes[jsgidx + 1].value == "false") watermarkEnabled = false;
    }
});
if(watermarkEnabled) console.log(`%c Powered by ${jsg.info.name} (v${jsg.info.version}) - © 2019 ${jsg.info.authorShort} (https://sv443.net/) - licensed under the MIT license (https://sv443.net/LICENSE) `, "background-color:#454545;color:white;padding:0.2em;font-size:1.3em;");




// MARKER shortened functions
const gebid = id => document.getElementById(id);
const gebcn = cln => document.getElementsByClassName(cln);
const gebtn = tn => document.getElementsByTagName(tn);
const qsel = sel => document.querySelector(sel);
const qselall = sel => document.querySelectorAll(sel);
const isEmpty = val => {if(val === "" || val == null || val == undefined) return true; else return false;};

// MARKER get query string
/**
 * Returns an object consisting of key/value pairs that were extracted from the current URL's query string
 * @returns {Object}
 */
jsg.getQStr = () => {
    let raw = window.location.search.substring(1);
    let doneObj = {};
    if(raw.includes("&"))
    {
        let all = raw.split("&");
        all.forEach(val => {
            let key = val.split("=")[0];
            let value;
            let prepVal = [];

            prepVal = val.split("=");
            prepVal.shift();
            if(prepVal.length > 1) value = prepVal.join("=");
            else value = prepVal[0];

            doneObj[key] = value;
        });
    }
    else
    {
        let key = raw.split("=")[0];
        let value;
        let prepVal = [];

        prepVal = raw.split("=");
        prepVal.shift();
        if(prepVal.length > 1) value = prepVal.join("=");
        else value = prepVal[0];

        doneObj[key] = value;
    }

    return doneObj;
}

// MARKER minified js-cookie script (https://github.com/js-cookie/js-cookie)
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function g(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}return function e(l){function C(e,n,o){var t;if("undefined"!=typeof document){if(1<arguments.length){if("number"==typeof(o=g({path:"/"},C.defaults,o)).expires){var r=new Date;r.setMilliseconds(r.getMilliseconds()+864e5*o.expires),o.expires=r}o.expires=o.expires?o.expires.toUTCString():"";try{t=JSON.stringify(n),/^[\{\[]/.test(t)&&(n=t)}catch(e){}n=l.write?l.write(n,e):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var i="";for(var c in o)o[c]&&(i+="; "+c,!0!==o[c]&&(i+="="+o[c]));return document.cookie=e+"="+n+i}e||(t={});for(var a=document.cookie?document.cookie.split("; "):[],s=/(%[0-9A-Z]{2})+/g,f=0;f<a.length;f++){var p=a[f].split("="),d=p.slice(1).join("=");this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1));try{var u=p[0].replace(s,decodeURIComponent);if(d=l.read?l.read(d,u):l(d,u)||d.replace(s,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(e===u){t=d;break}e||(t[u]=d)}catch(e){}}return t}}return(C.set=C).get=function(e){return C.call(C,e)},C.getJSON=function(){return C.apply({json:!0},[].slice.call(arguments))},C.defaults={},C.remove=function(e,n){C(e,"",g(n,{expires:-1}))},C.withConverter=e,C}(function(){})});

// MARKER menu class

/**
 * 
 * @typedef {Object} MenuOptions
 * @prop {Boolean} [roundedCorners=true] Whether or not the corners of the menu should be rounded
 * @prop {String} [title=""] The title of the menu. Leave empty for no title
 * @prop {Boolean} [closableWithEscapeKey=true] Whether or not the menu should be closable by pressing the ESC key
 * @prop {Boolean} [closableWithButton=true] Whether or not the menu should be closable with a button in the top right corner of the menu
 * @prop {Function} [onClose] A function that should be executed if the menu gets closed (triggers on both ESC key press and close button click)
 * @prop {String} [closeButtonImageSrc="https://sv443.net/cdn/jsg/closebtn.png"] The image that should be used for the close button. Leave empty / undefined for a rounded, red close button
 * @prop {"dark" | "light"} [theme] The theme of the menu. This can be changed at any time by using Menu.setTheme()
 */

jsg.Menu = class
{
    /**
     * Creates a new menu object but doesn't open it. Use Menu.open() to open it
     * @param {Number} [height=50] Height of the menu (in percent)
     * @param {Number} [width=50] Width of the menu (in percent)
     * @param {String} [content] The content of the menu. Can be plain text or HTML - I recommend using [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for this
     * @param {MenuOptions} [options]
     * @returns {Boolean}
     */
    constructor(height = 50, width = 50, content = "<span class=\"jsg_menu_content_empty\"></span>", options)
    {
        //#BEGIN initialization

        if(typeof height != "number" || height < 0 || height > 100) height = 50;
        if(typeof width != "number" || width < 0 || width > 100) width = 50;
        if(isEmpty(content)) content = "<span class=\"jsg_menu_content_empty\"></span>";

        if(!isEmpty(options) && typeof options == "object")
        {
            if(isEmpty(options.roundedCorners)) options.roundedCorners = true;
            if(isEmpty(options.title)) options.title = "";
            if(isEmpty(options.closableWithEscapeKey)) options.closableWithEscapeKey = true;
            if(isEmpty(options.closableWithButton)) options.closableWithButton = true;
            if(isEmpty(options.onClose)) options.onClose = () => {};
            if(isEmpty(options.closeButtonImageSrc)) options.closeButtonImageSrc = "https://sv443.net/cdn/jsg/closebtn.png";
            if(isEmpty(options.theme)) options.theme = "light";
        }
        else if(isEmpty(options) || typeof options != "object") options = {
            roundedCorners: true,
            title: "",
            closableWithEscapeKey: true,
            closableWithButton: true,
            onClose: () => {},
            closeButtonImageSrc: "https://sv443.net/cdn/jsg/closebtn.png",
            theme: "light",
        }
        else throw new Error(`[JSGame | Wrong parameter]: Invalid options provided for the construction of a Menu object. The options parameter has to be of type "object", instead got: "${typeof options}"`);

        if(typeof height != "number" && (height < 0 || height > 100)) throw new Error(`[JSGame | Wrong parameter]: Invalid height "${height}" used in the construction of a Menu object - It has to be of type "number" and has to be between 0 and 100`);
        if(typeof width != "number" && (width < 0 || width > 100)) throw new Error(`[JSGame | Wrong parameter]: Invalid width "${width}" used in the construction of a Menu object - It has to be of type "number" and has to be between 0 and 100`);

        this._height = height;
        this._width = width;
        this._content = content;
        this._options = options;
        this._opened = false;

        if(this._options.theme == "dark") this._style = "color: white; position: fixed; padding: 10px; border: 2px solid #eee; background-color: #444; filter: drop-shadow(5px 5px 6px rgba(0,0,0,0.6));";
        else if(this._options.theme == "light") this._style = "color: black; position: fixed; padding: 10px; border: 2px solid #444; background-color: #ddd; filter: drop-shadow(5px 5px 6px rgba(0,0,0,0.6));";

        //#END initialization
        //#BEGIN create HTML element

        this._domelement = null;

        let menuElem = document.createElement("div");

        menuElem.className = "jsg_menu";

        menuElem.style = this._style;
        menuElem.style.display = "none";
        menuElem.style.top = ((100 - this._height) / 2) + "vh";
        menuElem.style.left = ((100 - this._width) / 2) + "vw";
        menuElem.style.height = height + "vh";
        menuElem.style.width = width + "vw";
        if(this._options.roundedCorners) menuElem.style.borderRadius = "18px";
        else menuElem.style.borderRadius = "0";

        if(!isEmpty(this._options.title)) menuElem.innerHTML = `<div class="jsg_menu_title" style="font-size: 30px; text-align: center;">${this._options.title}</div><br><div class="jsg_menu_content">${this._content}</div>`;
        else menuElem.innerHTML = `<div class="jsg_menu_content">${this._content}</div>`;

        this._domelement = menuElem;

        if(document.body != null) document.body.appendChild(menuElem);
        else throw new Error(`[JSGame | No body]: The document body couldn't be found. Make sure to create a new Menu object only if you are sure that the document body exists (the DOM is loaded)`);


        if(this._options.closableWithButton)
        {
            let closeBtnElem = document.createElement("img");
            closeBtnElem.onclick = () => {
                this.close();
                this._options.onClose(this);
            }
            closeBtnElem.className = "jsg_menu_closebtn";
            closeBtnElem.title = "Close";
            closeBtnElem.src = this._options.closeButtonImageSrc;
            closeBtnElem.style = "cursor: pointer; position: absolute; top: 0; right: 0; width: 30px; height: 30px;";

            this._domelement.appendChild(closeBtnElem);
        }

        if(this._options.closableWithEscapeKey)
        {
            document.addEventListener("keyup", e => {
                if(!this._opened) return;
                if(e.key == "Escape") this.close();
            });
        }

        return true;
    }

    /**
     * Opens the menu
     * @param {Boolean} [fadeIn=true] Whether or not to fade the menu in
     * @returns {Boolean} Returns true if the menu could be opened and false if the menu was already open
     */
    open(fadeIn = true)
    {
        if(this._opened) return false;

        if(typeof fadeIn != "boolean") throw new Error(`[JSGame | Wrong parameter]: Invalid type "${typeof fadeIn}" used in Menu.open() - It has to be of type "boolean" (can be either true or false)`);
        
        this._opened = true;

        this._domelement.style = this._style;
        this._domelement.style.opacity = "0";
        this._domelement.style.display = "block";
        if(fadeIn) this._domelement.style.transition = "opacity 0.15s ease-in";
        setTimeout(() => {
            this._domelement.style.opacity = "1";
            this._domelement.style.top = ((100 - this._height) / 2) + "vh";
            this._domelement.style.left = ((100 - this._width) / 2) + "vw";
            this._domelement.style.height = this._height + "vh";
            this._domelement.style.width = this._width + "vw";
            if(this._options.roundedCorners) this._domelement.style.borderRadius = "18px";
            else this._domelement.style.borderRadius = "0";
        }, 5);

        return true;
    }

    /**
     * Closes the menu
     * @param {Boolean} [fadeOut=true] Whether or not to fade the menu out
     * @returns {Boolean} Returns true if the menu could be closed and false if the menu was already closed
     */
    close(fadeOut = true)
    {
        if(!this._opened) return false;

        if(typeof fadeOut != "boolean") throw new Error(`[JSGame | Wrong parameter]: Invalid type "${typeof fadeOut}" used in Menu.close() - It has to be of type "boolean" (can be either true or false)`);
        
        this._opened = false;

        this._domelement.style = this._style;
        this._domelement.style.top = ((100 - this._height) / 2) + "vh";
        this._domelement.style.left = ((100 - this._width) / 2) + "vw";
        this._domelement.style.height = this._height + "vh";
        this._domelement.style.width = this._width + "vw";
        if(this._options.roundedCorners) this._domelement.style.borderRadius = "20px";
        else this._domelement.style.borderRadius = "0";
        
        this._domelement.style.opacity = "1";
        this._domelement.style.display = "block";
        if(fadeOut) this._domelement.style.transition = "opacity 0.15s ease-out";
        setTimeout(() => {
            this._domelement.style.opacity = "0";

            setTimeout(() => {
                this._domelement.style.display = "none";
            }, 250);
        }, 15);

        return true;
    }

    /**
     * Sets the color theme of the menu
     * @param {"dark" | "light"} theme
     * @returns {String}
     */
    setTheme(theme)
    {
        let possibleThemes = ["dark", "light"];
        if(!possibleThemes.includes(theme)) throw new Error(`[JSGame | Wrong parameter]: Wrong theme "${theme}" used in Menu.setTheme() - Possible values are: "${possibleThemes.join("\", \"")}"`);

        if(theme == "dark")
        {
            this._options.theme = "dark";

            this._style = "color: white; position: fixed; padding: 10px; border: 2px solid #eee; background-color: #444; filter: drop-shadow(5px 5px 6px rgba(0,0,0,0.6));";

            this._domelement.style.color = "white";
            this._domelement.style.borderColor = "#eee";
            this._domelement.style.backgroundColor = "#444";
        }
        else
        {
            this._options.theme = "light";

            this._style = "color: black; position: fixed; padding: 10px; border: 2px solid #444; background-color: #ddd; filter: drop-shadow(5px 5px 6px rgba(0,0,0,0.6));";
            
            this._domelement.style.color = "black";
            this._domelement.style.borderColor = "#444";
            this._domelement.style.backgroundColor = "#ddd";
        }

        return this._options.theme;
    }

    /**
     * Sets the menu's innerHTML property to the provided content
     * @param {String} content 
     * @returns {Boolean}
     */
    setInnerHTML(content)
    {
        this._content = content;
        this._domelement.getElementsByClassName("jsg_menu_content")[0].innerHTML = content;

        return true;
    }

    /**
     * Runs the provided function on close
     * @param {Function} funct The function to run on close
     * @returns {Boolean}
     */
    onClose(funct)
    {
        if(typeof funct != "function") throw new Error(`[JSGame | Wrong parameter]: Wrong type "${typeof funct}" provided in Menu.onClose() - expected type: "function"`);

        this._options.onClose = funct;
        return true;
    }
}

// MARKER audio class
jsg.Audio = class
{
    /**
     * Creates a new Audio object but doesn't play it yet - use Audio.play() to play it
     * @param {String} src The URL or relative path to the audio file that should be played
     * @param {Boolean} preload Whether or not the audio should be preloaded
     */
    constructor(src, preload = false)
    {
        if(typeof src != "string") throw new Error(`[JSGame | Wrong parameter]: Wrong type "${typeof src}" provided in the construction of an Audio object - expected type: "string"`);
        if(typeof preload != "boolean") throw new Error(`[JSGame | Wrong parameter]: Wrong type "${typeof preload}" provided in the construction of an Audio object - expected type: "boolean"`);

        this._domelement = null;

        let audioElem = document.createElement("audio");

        audioElem.className = "jsg_audio";

        if(!preload) audioElem.preload = "none";
        else audioElem.preload = "auto";

        audioElem.controls = "false";
        audioElem.innerHTML = `<source src="${src}">`;
        audioElem.style = "position: fixed; top: 150vh; display: none;";

        this._domelement = audioElem;

        document.body.appendChild(audioElem);

        return true;
    }

    /**
     * Plays or resumes the audio
     */
    play()
    {
        this._domelement.play();

        return true;
    }

    /**
     * Pauses the audio
     */
    pause()
    {
        this._domelement.pause();
        
        return true;
    }

    /**
     * Stops the audio (Like pause but resets the time back to 0)
     */
    stop()
    {
        this._domelement.pause();
        this._domelement.currentTime = 0;

        return true;
    }

    /**
     * Skips the audio to the specified time
     * @param {Number} time Floating point number
     * @returns {Number} Returns the time the audio has been set to
     */
    setTime(time = 0.0)
    {
        if(typeof time != "number") throw new Error(`[JSGame | Wrong parameter]: Wrong type "${typeof time}" provided in Audio.setTime() - expected type: "number" (floating point number)`);

        time = parseFloat(time);
        this._domelement.currentTime = time;

        return this._domelement.currentTime;
    }

    /**
     * Returns the current time of the audio
     * @returns {Number}
     */
    getTime()
    {
        return this._domelement.currentTime;
    }

    /**
     * Sets the volume of the audio
     * @param {Number} volume Floating point number between 0.0 and 1.0
     * @returns {Number} Returns the volume the audio has been set to
     */
    setVolume(volume = 1.0)
    {
        if(typeof volume != "number") throw new Error(`[JSGame | Wrong parameter]: Wrong type "${typeof volume}" provided in Audio.setVolume() - expected type: "number" (floating point number)`);

        volume = parseFloat(volume);

        if(volume < 0.0) volume = 0.0;
        if(volume > 1.0) volume = 1.0;

        this._domelement.volume = volume;

        return this._domelement.volume;
    }

    /**
     * Returns the current volume of the audio
     * @returns {Number} Floating point number between 0.0 and 1.0
     */
    getVolume()
    {
        return this._domelement.volume;
    }

    /**
     * Enable or disable loop for the audio
     * @param {Boolean} enabled Set to true to enable the loop, false to disable it
     */
    setLoop(enabled = true)
    {
        if(typeof enabled != "boolean") throw new Error(``);

        if(enabled) this._domelement.setAttribute("loop", "true");
        else this._domelement.removeAttribute("loop");

        return true;
    }
}

// MARKER animation class
jsg.Animation = class
{
    constructor()
    {

    }

    turnOn()
    {

    }

    turnOff()
    {

    }

    setState()
    {

    }

    getState()
    {

    }
}

// MARKER desktop notification
jsg.Notification = class
{
    constructor()
    {

    }

    grantPermission()
    {

    }

    send()
    {

    }
}

// MARKER copy
/**
 * Copies the passed text to the clipboard
 * @param {String} text
 */
jsg.copy = text => {
    if(typeof text != "string") throw new Error(`[JSGame | Wrong parameter]: Wrong type "${typeof text}" provided in copy() - expected type: "string"`);

    let copyElement = document.createElement("textarea");
	copyElement.className = "jsg_copy_textarea";
	copyElement.innerHTML = text;
    document.body.appendChild(copyElement);
    
	copyElement.select();
    document.execCommand("copy");
    
    copyElement.innerHTML = "";
    copyElement.outerHTML = "";

    try {
        document.removeChild(copyElement);
    }
    catch(err) {}
}

// MARKER preload image
/**
 * Loads an image to the cache
 * @param {String} src The URL to the image you want to preload
 */
jsg.preloadImage = (src) => {
    let preloadImg = new Image();
    preloadImg.src = src;
}

// MARKER collision detection

/**
 * Collision detection - offers two functions for different kinds of collision detection
 * @prop {Function} basic
 * @prop {Function} boundingRect
 */
jsg.collision = {
    /**
     * Checks whether or not two HTML elements are colliding / overlapping
     * @param {HTMLElement} elementA
     * @param {HTMLElement} elementB
     * @returns {Boolean}
     */
	basic: (elementA, elementB) => {
        if(typeof elementA != "object" || typeof elementB != "object") throw new Error(`[JSGame | Wrong parameter]: Wrong type(s) "${typeof elementA}" and/or "${typeof elementB}" provided in collision.basic() - expected types: "object<HTMLElement>" and "object<HTMLElement>"`);

        let errc = null;
        try {
            if(elementA.style.display != "inline-block" || elementB.style.display != "inline-block") errc = `[JSGame | Faulty parameter]: The elements passed into collision.basic() need to have the CSS property "display: inline-block;" for this collision detection to work. Please try collision.boundingRect() instead.`;
        } 
        catch(err)
        {
            errc = `[JSGame | Faulty parameter]: The elements passed into collision.basic() don't seem to be HTML elements. Please make sure they are and try again.`;
        }

        if(!isEmpty(errc)) throw new Error(errc);

		return !(((a.y + a.height) < (b.y)) || (a.y > (b.y + b.height)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
    },
    /**
     * Draws a bounding box around the element and checks whether or not these boxes are colliding / overlapping.
     * 
     * Warning! This can get really inaccurate if the two elements are not rectangular or are rotated. Because of this it is advised to try collision.basic() first.
     * @param {HTMLElement} elementA
     * @param {HTMLElement} elementB
     * @returns {Boolean}
     */
	boundingRect: (elementA, elementB) => {
        if(typeof elementA != "object" || typeof elementB != "object") throw new Error(`[JSGame | Wrong parameter]: Wrong type(s) "${typeof elementA}" and/or "${typeof elementB}" provided in collision.boundingRect() - expected types: "object<HTMLElement>" and "object<HTMLElement>"`);

        let col = [false, false, false, false];
        
        if(elementA.getBoundingClientRect().top < elementB.getBoundingClientRect().bottom) col[0] = true;
		if(elementA.getBoundingClientRect().bottom > elementB.getBoundingClientRect().top) col[1] = true;
		if(elementA.getBoundingClientRect().right > elementB.getBoundingClientRect().left) col[2] = true;
		if(elementA.getBoundingClientRect().left < elementB.getBoundingClientRect().right) col[3] = true;

		return ((!!col[0] && !!col[1] && !!col[2] && !!col[3]) === true);
	}
}