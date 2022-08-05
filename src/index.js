/*global L*/

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import json from './block.json';

function initMap( { clientId, attributes, setAttributes, updateMetaCoordinates } ) {
	const mapId  = 'map-' + clientId;
	const latLng = [ attributes.lat, attributes.lon ];
	const map    = L.map( mapId ).setView( latLng, 13 );

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

		setAttributes( {
			lat: latLng.lat,
			lon: latLng.lng,
		} );

		updateMetaCoordinates( latLngStr );
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

function edit( props ) {
	const postType = useSelect(
		select => select( 'core/editor' ).getCurrentPostType(),
		[]
	);

	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );
	const updateMetaCoordinates = value => {
		setMeta( { ...meta, api_coordinates_pp: value } );
		console.log( 'meta api_coordinates_pp set to ' + value );
	};

	const mapId = 'map-' + props.clientId;

	// Create the Leaflet map once this block has been attacted to the DOM.
	useEffect( () => initMap( { ...props, updateMetaCoordinates } ), [ mapId ] );

	return (
		<div { ...useBlockProps() }>
			<p>
				Current latitude: { props.attributes.lat }<br />
				Current longitude: { props.attributes.lon }
			</p>
			<div id={ mapId }
				className="map-pp"
				style={ { height: '180px' } }
			>
				Loading map..
			</div>
		</div>
	);
}

function save( { attributes } ) {
	return (
		<div { ...useBlockProps.save( {
			className: 'map-pp',
			style: { height: '180px' },
			'data-lat': attributes.lat,
			'data-lon': attributes.lon,
		} ) }>
			Loading map..
		</div>
	);
}

registerBlockType( json.name, {
	edit,
	save,
} );
