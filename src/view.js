/*global L*/

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import json from './block.json';

function initMap( element, lat, lon ) {
	const defaults = json.attributes;

	const latLng = [ lat || defaults.lat, lon || defaults.lon ];
	const map    = L.map( element ).setView( latLng, 13 );

	L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
	} ).addTo( map );

	const marker = L.marker( latLng, { draggable: true } ).addTo( map );
	const popup  = L.popup();

	const openPopup = ( latLng, content ) => {
		popup
			.setLatLng( latLng )
			.setContent( content )
			.openOn( map );
	};

	const onDragend = e => {
		const latLng    = e.latlng || e.target.getLatLng();
		const latLngStr = latLng.lat + ',' + latLng.lng;

		openPopup( latLng, 'Current latitude &amp; longitude: ' + latLngStr );
	};

	marker.on( 'dragend', onDragend );
	marker.on( 'click', () => popup.openOn( map ) );

	map.on( 'click', e => {
		marker.setLatLng( e.latlng );
		onDragend( e );
	} );

	const latLngStr = latLng[0] + ',' + latLng[1];
	openPopup( latLng, 'Based on the <a href="https://leafletjs.com/examples/quick-start/">official example</a>' +
		'<br />Current latitude &amp; longitude: ' + latLngStr );
}

domReady( () => {
	// Create the Leaflet maps once the DOM is ready.
	document.querySelectorAll( '.map-pp' ).forEach( el => {
		initMap( el, el.dataset.lat, el.dataset.lon );
	} );
} );
