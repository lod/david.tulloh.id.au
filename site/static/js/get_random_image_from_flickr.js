async function draw_random_image_from_flickr(target_img, api_key, user_id, album_id) {
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

		const sresponse = await fetch(
			`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${api_key}&photo_id=${photo.id}&format=json&nojsoncallback=1`
		);
		const sizing_resp = await sresponse.json();
		if (sizing_resp.stat !== 'ok') {
              throw new Error(sizing_resp.message || 'Failed to load image sizes');
        }

		srcset_a = sizing_resp.sizes.size.map((x)=>`${x.source} ${x.width}w`);

		// Still need to do some futzing to keep the aspect ratio in line
		// srcset is controlled by width, so works great with height=auto
		// but if we are height constrained it will squish the final image.
		target_ratio = target_img.width / target_img.height;
		image_ratio = photo.width_o / photo.height_o;


		// Update the image URL
		// Use clone/replace to update out of DOM - single redraw
		clone = target_img.cloneNode(true);
		clone.onerror = "";  // only update once, prevent loops
		clone.srcset = srcset_a.join();
		clone.sizes = "auto";
		clone.alt = photo.title;

		// TODO: This may mess stuff up if the sizing changes, like a screen rotation
		if (image_ratio < target_ratio) {
          // our sizing is height controlled
		  clone.style.width = `${target_img.height * image_ratio}px`;
		} else {
		  // our sizing is width controlled
		  clone.style.height = "auto";
		}

		target_img.replaceWith(clone);  // Single redraw
	} catch (error) {
		console.log("draw_random_image_from_flickr:", error.message || 'error without message detail');
	}
}
