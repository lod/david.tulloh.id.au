var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

function scale_temp (v) {
	return Math.pow(v-30,1/1.8); // square-rootish
	return v-30; // linear
}

function descale_temp (y) {
	return Math.pow(y,1.8)+30;
}

function temp_label (v) {
	var temp_canvas = document.getElementById("temp_data");
	var ctx = temp_canvas.getContext("2d");
	var h = temp_canvas.clientHeight;
	
	// Range from 150 to 30 degrees
	// Top and bottom have 12px dead zones, to keep text within visible scale
	h = h - 24;
	// var y = 12 + h - h/(150-30)*(v-30); // linear
	var y = 12 + h - h/scale_temp(150)*scale_temp(v);

	ctx.font = "20px sans-serif";
	ctx.fillStyle = "black";
	ctx.textAlign = "right";
	ctx.textBaseline = "middle";
	ctx.fillText(v+"°", canvas.offsetWidth-5, y);
}

temp_label(150);
temp_label(100);
temp_label(80);
temp_label(50);
temp_label(30);

document.getElementById("temp_data").addEventListener('click', function(event) {
	console.log(event, this);
	if (event.button) return; // Not left-button, ignore

	// var y = this.clientHeight - event.pageY - this.offsetTop;
	// Top and bottom have 12px dead zones, to keep text within visible scale
	var h = this.clientHeight - 24;
	var y = this.clientHeight - (event.pageY - this.offsetTop) - 12;
	if (y < 0) y = 0;
	if (y > h) y = h;

	var scaled = scale_temp(150)*y/h;
	var v = descale_temp( scaled );

	// TODO: Bias towards nice numbers

	console.log("TClick", v, event.pageY, h, y, scaled);

	window.location.href = 'temperature_based.html?t='+v;
});


}
/*
     FILE ARCHIVED ON 06:27:02 Nov 03, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 05:38:36 Jan 25, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.663
  exclusion.robots: 0.023
  exclusion.robots.policy: 0.01
  esindex: 0.013
  cdx.remote: 12.096
  LoadShardBlock: 273.219 (3)
  PetaboxLoader3.datanode: 319.3 (5)
  PetaboxLoader3.resolve: 212.627 (3)
  load_resource: 288.576 (2)
*/