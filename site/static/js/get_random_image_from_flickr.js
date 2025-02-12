// First draft actually written by claude, it was fairly good
async function draw_random_image_from_flickr(target_img, api_key, user_id, album_id, target_width, target_height) {
	try {
		const response = await fetch(
			`https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${api_key}&photoset_id=${album_id}&user_id=${user_id}&per_page=500&format=json&nojsoncallback=1&extras=o_dims,url_o`
		);

		const photolist_resp = await response.json();

		if (photolist_resp.stat !== 'ok') {
			throw new Error(photolist_resp.message || 'Failed to load album');
		}

		const photos = photolist_resp.photoset.photo;
		if (!photos.length) {
			throw new Error('No photos found in this album');
		}

		// Select a random photo
		const photo = photos[Math.floor(Math.random() * photos.length)];
		const sizing = get_closest_size(target_width, target_height, photo.width_o, photo.height_o);
		console.log(sizing);

		// Update the image URL
		// Use clone/replace to update out of DOM - single redraw
		clone = target_img.cloneNode(true);
		clone.onerror = "";  // only update once, prevent loops
		if (sizing.key == "o") {
			clone.src = photo.url_o;  // special secret
		} else {
			clone.src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${sizing.key}.jpg`;
		}
		clone.alt = photo.title;
		clone.style.height = `${sizing.height}px`;
		clone.style.width = `${sizing.width}px`;
		target_img.replaceWith(clone);  // Single redraw
	} catch (error) {
		console.log("draw_random_image_from_flickr:", error.message || 'error without message detail');
	}
}

function get_closest_size(target_width, target_height, width_o, height_o) {
	/* Image sizing: https://www.flickr.com/services/api/misc.urls.html
		* size is set via the longest edge
		*  s    thumbnail    75    cropped square
		*  q    thumbnail    150    cropped square
		*  t    thumbnail    100
		*  m    small    240
		*  n    small    320
		*  w    small    400
		*  (none)    medium    500
		*  z    medium    640
		*  c    medium    800
		*  b    large    1024
		*  ... bigger options trimmed
		*  o    original    arbitrary
		*/
	const sizing = {
		100: "t",
		240: "m",
		320: "n",
		400: "w",
		// 500: "",  // For this to work you need to drop the _ too, just disable for now
		640: "z",
		800: "c",
		1024: "b",
	};

	const size_opts = (new Uint32Array(Object.keys(sizing))).sort().reverse()

	o_ratio = width_o/height_o;  // >1 is landscape, 1.3 is common
	t_ratio = target_width/target_height;

	// Sizing is based on original longest dimension, our constrained is determined by the ratios
	if (o_ratio < t_ratio) {
		// our sizing is height controlled
		if (o_ratio > 1) {
			// selection based on width
			target = target_height * o_ratio;
		} else {
			// selection based on height
			target = target_height;
		}
	} else {
		// our sizing is width controlled
		if (o_ratio > 1) {
			// selection based on width
			target = target_width;
		} else {
			// selection dimension is height, use ratio to convert width
			target = target_width / o_ratio;
		}
	}

	console.log("sizing w/h", `orig ${width_o}/${height_o} = ${o_ratio}`, `target ${target_width}/${target_height} = ${t_ratio}`, `${o_ratio < t_ratio ? "height": "width"} controlled`, `selection based on ${o_ratio > 1 ? "width": "height"}`, `target = ${target}`);

	
	// Original photo dimensions are in height_o and width_o
	// We want the closest to the target width, but no greater than
	// we start from the bigger values and work down
	for (var opt of size_opts) {
		if (opt <= target) {
			console.log("Choice", opt, sizing[opt]);
			break;
		}
	}

	// no match, go for the smallest
	// opt = size_opts[size_opts.length-1];
	return {
                "key": sizing[opt],
                "height": o_ratio > 1 ? opt / o_ratio : opt,
                "width": o_ratio > 1 ? opt : opt * o_ratio,
            };
}
