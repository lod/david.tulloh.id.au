---
title: Dynamically sized random image from Flickr album
date: 2025-02-12
tags: ["javascript", "blog"]
---

When I got to the end of putting together this blog it was looking a little bare, I felt in needed a nice photo. Not being able to decide on the photo to use, I thought a random photo from an album would be better... because choosing a album'ss worth of images would somehow be easier (I consider the current photos placeholders, because I still haven't solved the actual original problem).

Rather than self hosting this I, for some reason (probably because 11ty images are fiddly and annoying), decided to go with Flickr.  Flickr turned out to work really well.

So the task and constraints were:

* Load a random image from a specified flickr album
* Do it all client side


<a href="#dynamic_flick_image_tldr">tl;dr just link to the bloody answer</a>

## First draft - Claude

For the first draft I decided to give AI another go.

I've previously tried AI (ChatGPT and Claude) for Ansible and Python development work and found it underwhelming.  But a friend and various random strangers online keep talking about how wonderful it is, and it had been a fair while since I last gave them a shot.

It was surprisingly good.  Claude supplies a kinda-live development environment with sourcecode and finished webpage tabs that you can switch between.  You can also highlight lines and say "explain" or "change this".  It was limited by not being able to actually connect the flickr API so I couldn't iterate with the system.  I think this is Claude setting the connect-src Content-Security-Policy, probably to prevent running third party scripts that completely compromise your session.

Initially the system didn't work because it was missing the `user_id` parameter. I identified this but decided to just feed Claude the error message to see how it would do, and it did great.

The HTML wrapper around everything wasn't necessary but I can see why some folks would like it, and it didn't get in my way.

Ultimately, a really good start.  I'd already found the API calls I needed, but it took a while, Claude had the correct calls immediately.  Having the basic functionality just done was fantastic, especially as my Javascript is super rusty.  There were bits I didn't like, I suspect I could have worked with Claude to sort those out. I ended up keeping about half of the generated Javascript in my second and third drafts, along with adding a bunch more.

<a href="/2025/dynamic_flickr_draft1.html">Standalone draft 1</a> or <a href="https://claude.site/artifacts/5a136213-523e-4eb3-bec9-9168993054fb">Claude hosted version</a>

<details><summary>Embedded draft1 example</summary>
<iframe title="Claude generated first draft" src="/2025/dynamic_flickr_draft1.html" style="width: 100%; height: 45rem; background-color: #EEE;"></iframe>
</details>

<details><summary>Generated code</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flickr Random Image Viewer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    .container {
      margin-top: 20px;
    }
    #imageContainer {
      margin: 20px 0;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #imageContainer img {
      max-width: 100%;
      max-height: 500px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #0063dc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #004eb5;
    }
    input {
      padding: 8px;
      font-size: 16px;
      width: 300px;
      margin: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .error {
      color: #dc0000;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Flickr Random Image Viewer</h1>
  
  <div class="container">
    <div>
      <input type="text" id="userId" placeholder="Enter Flickr User ID">
    </div>
    <div>
      <input type="text" id="albumId" placeholder="Enter Flickr Album ID">
    </div>
    <button onclick="loadImages()">Load Random Image</button>
  </div>

  <div id="imageContainer">
    <!-- Images will be displayed here -->
    <img src="/api/placeholder/400/300" alt="placeholder" />
  </div>

  <div id="error" class="error"></div>

  <script>
    const API_KEY = '796e426a98e426b387078fccd022ad3b';
    
    async function loadImages() {
      const albumId = document.getElementById('albumId').value;
      const userId = document.getElementById('userId').value;
      const errorDiv = document.getElementById('error');
      const imageContainer = document.getElementById('imageContainer');
      
      if (!albumId || !userId) {
        errorDiv.textContent = 'Please enter both User ID and Album ID';
        return;
      }

      try {
        errorDiv.textContent = '';
        imageContainer.innerHTML = 'Loading...';

        // Get the photoset information with user_id parameter
        const response = await fetch(
          `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${albumId}&user_id=${userId}&per_page=500&format=json&nojsoncallback=1`
        );
        
        const data = await response.json();
        
        if (data.stat !== 'ok') {
          throw new Error(data.message || 'Failed to load album');
        }

        const photos = data.photoset.photo;
        if (!photos.length) {
          throw new Error('No photos found in this album');
        }

        // Select a random photo
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        
        // Construct the image URL (using medium size)
        const imageUrl = `https://live.staticflickr.com/${randomPhoto.server}/${randomPhoto.id}_${randomPhoto.secret}_z.jpg`;
        
        // Display the image
        imageContainer.innerHTML = `
          <img src="${imageUrl}" alt="${randomPhoto.title}" />
        `;
      } catch (error) {
        errorDiv.textContent = error.message || 'Error loading images';
      }
    }
  </script>
</body>
</html>
```

</details>

## Second draft - The hard way

I could have just taken the Javascript above, copy/pasted it in and been done.  It fulfilled the original requirements.  But that would be too easy, like any good project I needed to introduce some scope creep that would make it at least twice as hard.

I wanted dynamic image size selection.

Modern webpages should be mobile and desktop compatible, even I read far too many websites on my mobile these days. The layout of this site flips around a fair bit to accommodate the radically different screen sizes, the sidebar is on the left on the desktop and on the top for mobile, with a bit of the content removed.

Flickr supports this really nicely, you put a size flag on the end of the URL and it gives you an image of the requested size.  There's always a twist though, the size is based off the longest dimension, so it changes for portrait or landscape images.  If you request a 500px sized image it may be 500x385 or it may be 385x500 (the second number could actually be anything 500 or under but I'm too lazy to crop images so they are all the standard 1.3 ratio).  Luckily the photo list request can be tweaked to supply the dimensions, so I know if it is portrait or landscape before selecting the size option.

The size of the target space also matters, it could be height constrained as in my mobile setup or width constrained in the sidebar.  To make life more interesting this intersects with the image constraints, the mobile setup will typically be height constrained but a wide short banner image will be width constrained.  And I want to keep this all dynamic, because the decision points could change based on the screen ratio and mobiles have lots of different screen ratios.

I ended up with this glorious masterpiece, it actually does work.

<a href="/2025/dynamic_flickr_draft2.html">Sample and test page (too big and ugly to embed)</a>

<details><summary>My mutilated sizing code</summary>

```javascript
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
    clone.onerror = ""; // only update once, prevent loops
    if (sizing.key == "o") {
      clone.src = photo.url_o; // special secret
    } else {
      clone.src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${sizing.key}.jpg`;
    }
    clone.alt = photo.title;
    clone.style.height = `${sizing.height}px`;
    clone.style.width = `${sizing.width}px`;
    target_img.replaceWith(clone); // Single redraw
  } catch (error) {
    console.log("draw_random_image_from_flickr:", error.message || 'error without message detail');
  }
}

function get_closest_size(target_width, target_height, width_o, height_o) {
  /* Image sizing: https://www.flickr.com/services/api/misc.urls.html
    * size is set via the longest edge
    * s  thumbnail  75  cropped square
    * q  thumbnail  150  cropped square
    * t  thumbnail  100
    * m  small  240
    * n  small  320
    * w  small  400
    * (none)  medium  500
    * z  medium  640
    * c  medium  800
    * b  large  1024
    * ... bigger options trimmed
    * o  original  arbitrary
    */
  const sizing = {
    100: "t",
    240: "m",
    320: "n",
    400: "w",
    // 500: "", // For this to work you need to drop the _ too, just disable for now
    640: "z",
    800: "c",
    1024: "b",
  };

  const size_opts = (new Uint32Array(Object.keys(sizing))).sort().reverse()

  o_ratio = width_o/height_o; // >1 is landscape, 1.3 is common
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
```

</details>

## Side mission - lazy loading

I swear it isn't scope creep.

I'm using lazy loading for the images, partly because I don't want the page to wait for them, partly because I don't know what size image to select until the page has been fully laid out.

The classic way to handle this is probably to use `addEventListener("load",...` which triggers once the page has been loaded (window.load event).  And I probably should do that, but I didn't.  Instead I hooked into the img onerror call, which is fired when it can't find the image src.  As I set `src=""` that occurs when it tries to load the image and `loading=lazy` makes that after the page has been laid out.

This is actually a little better than the event listener in theory, as the lazy load should only happen as the image is required.  For example as you scroll down the image is loaded when it gets close to being visible. In practice for my usage the image is at the top/side and immediately visible.  I think replacing the image with the srcset version could retain the lazy aspect as long as the box size didn't change.

The twist is to disable the onerror call during the javascript handling. In case the revised image can't be loaded I don't want it looping on me.

<details><summary>Code</summary>

```html
<img id="flickr_roll" src="" alt="Loading..." loading=lazy onerror="load_img(this)"/>
```

```javascript
    async function load_img(target) {
        const api_key = '796e426a98e426b387078fccd022ad3b';
        const album_id = '72177720323695910';
        const user_id = '202205040@N05';

        await draw_random_image_from_flickr(target, api_key, user_id, album_id);
        // Draw sets target.onerror = "";
    }
```

</details>

## Third draft - browser offload

Eventually I remembered that browsers could do dynamic image selection via the srcset option. It looks like `srcset="thumbnail.png 100w, bigger.png 1000w".  Basically a list of image options with their widths, the browser selects the best option for the required width.  You can also specify pixel density instead of width, essentially these are image size multiples.

To get this to work requires also supplying the sizes parameter, this is a complex mess of media conditions to select the correct srcset option. Fortunately there is an "auto" option which lets the browser choose the best option after rendering the site layout, which is exactly what I want.  The responsive image toolbox also has `<picture>` with multiple `<source>` options selected based on CSS media selector rules, it's designed for choosing between portrait and landscape source options based on the layout, the MDN example has the mobile version use a portrait photo that is a cropped version of the larger landscape.  I've decided I'm far too lazy to go down the multiple photo path, even scope creep needs to stop somewhere.

The twist, because life can never be too easy, is that the browser always does the selection based on the width, and we are frequently not width constrained.  So we still need much of the code from the second draft to map our height constraint into a width constraint, then the browser can do it's thing.  We also need to do this to prevent the browser stretching out of the proper aspect ratio.

This technique also handles the device pixel ratio (DPR) variations.  If your device has a high DPR, like an iPhone with a DPR of 3, then the browser will select an image that is 3x larger to get the proper resolution.  This means the download is 9x bigger and slower (3^2) but that's probably what iPhone users want.  This could be incorporated into the second draft technique using `window.devicePixelRatio` but I didn't know, I discovered DPR was a relevant things while debugging why the mobile image selection seemed too large.

This code is currently running on the blog (as of writing) on the left or top, depending on your browser.

I'm also providing an iframe below though, because it may change in the future.

<a name="dynamic_flick_image_tldr"></a>

<iframe title="Example of dynamic image loading" src="/2025/dynamic_flickr_draft3.html" style="width: 100%; height: 20rem;"></iframe>

<a href="https://github.com/lod/david.tulloh.id.au/blob/cac567cf0bb72d0ea3d45df23d0adf39f66c4cc4/site/static/js/get_random_image_from_flickr.js">Github copy of get_random_image_from_flickr.js</a>

<details open><summary>The code</summary>

```javascript
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
    clone.onerror = ""; // only update once, prevent loops
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

    target_img.replaceWith(clone); // Single redraw
  } catch (error) {
    console.log("draw_random_image_from_flickr:", error.message || 'error without message detail');
  }
}

```

</details>


## Next steps

I experimented with preloading the image.  Currently the "loading" text is from the image placeholder which disappears when the new image starts to load, not when it finishes loading. Preloading the appropriate size is messy. The better solution seems to be to overlay a loading message over the image and then remove it using the image load event. But I've reached the end of my caring for now.

The current setup is a one shot, it doesn't react to future layout changes. For example if a browser window was shrunk down to a narrow column it will switch to the mobile layout and the image size constraints will change, but I won't update the image choice setup.  I could handle this by tracking the img changed event, but it is actually kinda messy. In the current setup the initial placeholder image is large, it fills the available space. When the real image is selected the non-constraining element of this space is shrunk down to retain the aspect ratio.  Handling the layout shift needs to undo this, probably by having the sizing based off a larger container box.  Ignoring this for now because it should be super rare, and everything will still be ok as it currently stands, it is just that the image choice may not be optimal. Another approach may be to use the CSS object-fit property instead of resizing.

Now that I understand how this stuff works I also want to look at how 11ty does the image selection elsewhere in the blog.  The images are all rendered to multiple size options and srcset is used to select the best one.  However the image sizes parameter is set to 100vh, the full screen width. This works for mobile but with the desktop sidebar and substantial margins the reality is more like 50vh, so I should be able to do better.  Hopefully it is just a CSS tweak.
