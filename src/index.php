<?php
/**
 * Plugin Name: WPSE 408053: Leaflet map demo
 * Plugin URI: https://github.com/5ally/wpse-408053
 * Version: 1.0.0
 * Author: Sally CJ
 * Text Domain: wpse-408053
 *
 * @package wpse-408053
 */

add_action( 'init', 'wpse_408053_init' );
function wpse_408053_init() {
	wp_register_style( 'leaflet', 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css', array(), null );
	wp_register_script( 'leaflet', 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.js', array(), null );

	// NOTE: You will need to manually add 'leaflet' to the **dependencies** of
	// the editor and view scripts! See index.asset.php and view.asset.php in
	// build/wpse-408053.
	register_block_type( __DIR__ );

	register_post_type( 'locations', array(
		'public'       => true,
		'label'        => 'Locations',
		'supports'     => array( 'title', 'editor', 'custom-fields' ), // just the basics for this demo
		'show_in_rest' => true,
	) );

	register_post_meta( 'locations', 'api_coordinates_pp', array(
		'single'         => true,
		'type'           => 'string',
		'show_in_rest'   => true,
		'auth_callback'  => function () {
			return current_user_can( 'edit_posts' );
		},
	) );
}

// Turn the api_coordinates_pp meta to a *protected* meta without having to change
// the meta key (to _api_coordinates_pp).
add_filter( 'is_protected_meta', 'wpse_408053_filter_is_protected_meta', 10, 3 );
function wpse_408053_filter_is_protected_meta( $protected, $meta_key, $meta_type ) {
	return ( 'post' === $meta_type && 'api_coordinates_pp' === $meta_key ) ?
		true : $protected;
}

// Displays the api_coordinates_pp meta value on SINGULAR `locations` CPT pages.
add_filter( 'the_content', 'wpse_408053_filter_the_content' );
function wpse_408053_filter_the_content( $content ) {
	if ( ! is_singular( 'locations' ) ) {
		return $content;
	}

	return sprintf(
		'<p>Current value of the meta api_coordinates_pp: %s</p>',
		get_post_meta( get_the_ID(), 'api_coordinates_pp', true )
	) . $content;
}
