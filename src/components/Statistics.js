import React from "react";
import * as turf from "@turf/turf";

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalArea: 0,
            selectedArea: 0,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.proposal !== prevProps.proposal) {
            let union = this.props.proposal.features.reduce(turf.union);
            let totalArea = turf.area(union);
            this.setState({
                totalArea: totalArea,
            });
        }

        
        if (this.props.selectedPolygons === prevProps.selectedPolygons) {
            return;
        }
        
        let nPolys = this.props.selectedPolygons.length;
        let union;
        switch (nPolys) {
            case 0:
                // a little hack to make the area 0
                union = turf.polygon([[[0,0], [0,0], [0,0], [0,0]]]);
                break;
            case 1:
                union = this.props.selectedPolygons[0].feature;
                break;
            case 2:
                let poly1 = this.props.selectedPolygons[0].feature;
                let poly2 = this.props.selectedPolygons[1].feature;
                union = turf.union(poly1, poly2);
                break;
            default:
                console.log("Error: more than 2 polygons selected");
        }

        let selectedArea = turf.area(union);
        this.setState({
            selectedArea: selectedArea,
        });
    }

    render() {
        return (
            <div className="statistics">
                <p>Area of Proposal: {Number(this.state.totalArea).toFixed(2)} m<sup>2</sup></p>
                <p>Area of Selected Polygons: {Number(this.state.selectedArea).toFixed(2)} m<sup>2</sup></p>
            </div>
        );
    }
}