import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import config from "./config.json";
import * as turf from "@turf/turf";


export default class WorkSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            polygonLayers: [],
            selectedPolygons: [],
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.proposal === null) {
            return
        }
        if (this.props.proposal === prevProps.proposal) {
            return;
        }

        if (prevProps.proposal !== null) {
            // remove old polygons
            this.state.polygonLayers.map(function (layer) {
                this.state.map.removeLayer(layer);
            }.bind(this));
        }

        // fly to center of proposal
        let coord = turf.centerMedian(this.props.proposal).geometry.coordinates;
        let latlng = { lat: coord[1], lng: coord[0] };
        this.state.map.flyTo(latlng, 16.5, { duration: 0.3 });

        // when the flying is done, add the polygon
        this.state.map.once('moveend', function () {
            let polygons = [];
            this.props.proposal.features.forEach(function (feature, idx) {
                feature.geometry.coordinates.forEach(function (polygon) {

                    // change from [lat, lng] to [lng, lat]
                    let coords = polygon.map(function (coord) {
                        return [coord[1], coord[0]];
                    });

                    let polygonLayer = L.polygon(coords, { color: config.DESELECTED_COLOR });
                    
                    polygonLayer.on('click', (() => {
                        // position helps removing polygon on union and intersection
                        let position = {featureidx: idx}
                        this.props.selectPolygon(polygonLayer, feature, position);
                    }));

                    polygons.push(polygonLayer);
                }.bind(this));
            }.bind(this));

            // add the polygons to the map and state
            let layerGroup = L.layerGroup(polygons);
            layerGroup.addTo(this.state.map);
            this.setState({ polygonLayers: [...this.state.polygonLayers, layerGroup] });

        }.bind(this));

    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100wh' }}>
                <MapContainer
                    center={config.MAP_CENTER}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                    whenCreated={map => this.setState({ map: map })}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        );
    }
};
