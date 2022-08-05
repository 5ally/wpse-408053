## About

Just a sample block which displays an interactive map, where the _block attributes and a post meta_ named `api_coordinates_pp` will be updated after clicking on a location in the map or dragging the map's marker.

*Based on the [official example or Leaflet's quick start guide](https://leafletjs.com/examples/quick-start/), and uses [Leaflet v1.8.0](https://leafletjs.com/download.html) and the React's `useEffect` hook (without exposing refs).*

* **Back-end/editor preview**
    ![Preview image](https://user-images.githubusercontent.com/47658419/183037526-a806c54a-6561-48b5-b460-b5c78eb7ae19.png)

* **Front-end preview** (Twenty Twenty-One & WordPress v6.0.1)
    ![Preview image](https://user-images.githubusercontent.com/47658419/183036412-fe2326c0-72bb-400c-8266-eef5aafc3775.png)

This is how I registered the post meta above:

```php
register_post_meta( 'locations', 'api_coordinates_pp', array(
	'single'         => true,
	'type'           => 'string',
	'show_in_rest'   => true,
	'auth_callback'  => function () {
		return current_user_can( 'edit_posts' );
	},
) );
```

And enqueued the `leaflet` stylesheet and script files using:

```php
wp_register_style( 'leaflet', 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css', array(), null );
wp_register_script( 'leaflet', 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.js', array(), null );
```

Also, to ensure the "Custom Fields" **meta box** does *not* "overwrite" the meta value that's changed via the block editor, I used the following to turn the `api_coordinates_pp` meta to a **protected** meta without having to change the meta key to `_api_coordinates_pp`: [(see this question and my answer there for more details](https://wordpress.stackexchange.com/q/408053/137402))

```php
add_filter( 'is_protected_meta', 'wpse_408053_filter_is_protected_meta', 10, 3 );
function wpse_408053_filter_is_protected_meta( $protected, $meta_key, $meta_type ) {
	return ( 'post' === $meta_type && 'api_coordinates_pp' === $meta_key ) ?
		true : $protected;
}
```
