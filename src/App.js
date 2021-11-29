import './App.css';
import * as React from 'react';
import * as turf from '@turf/turf';
import Grid from '@mui/material/Grid';

import ProposalList from './components/ProposalList';
import WorkSurface from './components/WorkSurface';
import Statistics from './components/Statistics';
import Proposals from './components/ImportProposals';
import Operations from './components/Operations';
import config from "./components/config.json";


export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            proposals: Proposals,
            selectedProposal: null,
            selectedPolygons: [],
        }
    }

    selectProposal = (proposal) => {
        this.setState({
            selectedProposal: proposal,
            selectedPolygons: [],
        });
    }

    selectPolygon = (layer, feature, position) => {
        let polygon = { layer: layer, feature: feature, position: position };

        if (this.state.selectedPolygons.findIndex(p => p.layer === layer) > -1) {
            // polygon already selected, deselect it

            layer.setStyle({
                color: config.DESELECTED_COLOR,
            });
            // remove from selectedPolygons
            this.setState({
                selectedPolygons: this.state.selectedPolygons.filter(p => p.layer !== layer),
            });
            return;
        }

        layer.setStyle({ color: config.SELECTED_COLOR });

        let n = this.state.selectedPolygons.length;
        if (n === 2) {
            // if there are already 2 polygons selected, remove the first one
            this.state.selectedPolygons[0].layer.setStyle({
                color: config.DESELECTED_COLOR,
            });
            this.setState({
                selectedPolygons: [this.state.selectedPolygons[1], polygon],
            })
        } else {
            this.setState({
                selectedPolygons: [...this.state.selectedPolygons, polygon],
            });
        }
    }

    onUnion = () => {
        if (this.state.selectedPolygons.length !== 2) {
            alert("Please select exactly 2 polygons");
            return;
        }
        let poly1 = this.state.selectedPolygons[0];
        let poly2 = this.state.selectedPolygons[1];
        let union = turf.union(poly1.feature, poly2.feature);

        if (union.geometry.type === 'MultiPolygon') {
            alert("The selected polygons do not intersect");
            return;
        }

        this.mergeSelected(union);

    }

    onIntersection = () => {
        if (this.state.selectedPolygons.length !== 2) {
            alert("Please select exactly 2 polygons");
            return;
        }
        let poly1 = this.state.selectedPolygons[0];
        let poly2 = this.state.selectedPolygons[1];
        let intersection = turf.intersect(poly1.feature, poly2.feature);

        if (!intersection) {
            alert("The selected polygons do not intersect");
            return;
        }
        if ( intersection.geometry.type === 'MultiPolygon') {
            alert("Intersection creates disjoint polygons");
            return;
        }
        this.mergeSelected(intersection);
    }

    // replace the selected polygons with newPolygon
    mergeSelected = (newPolygon) => {
        let poly1 = this.state.selectedPolygons[0];
        let poly2 = this.state.selectedPolygons[1];

        let proposalCopy = JSON.parse(JSON.stringify(this.state.proposals));
        let proposalIdx = this.state.proposals.indexOf(this.state.selectedProposal);

        let idx1 = poly1.position.featureidx;
        let idx2 = poly2.position.featureidx;
        // we need to remove biggest index first
        if (idx1 < idx2) {
            let tmp = idx1;
            idx1 = idx2;
            idx2 = tmp;
        }

        // remove old and add new polygon
        proposalCopy[proposalIdx].features.splice(idx1, 1);
        proposalCopy[proposalIdx].features.splice(idx2, 1);
        proposalCopy[proposalIdx].features.push(newPolygon);

        this.setState({
            proposals: proposalCopy,
            selectedProposal: proposalCopy[proposalIdx],
            selectedPolygons: [],
        })
    }

    render() {
        return (
            <div className="App">
                <Grid container spacing={2}>

                    <Grid item xs={3} container justifyContent="center">
                        <ProposalList proposals={this.state.proposals} selectProposal={this.selectProposal} />
                    </Grid>

                    <Grid item xs={6}>
                        <WorkSurface proposal={this.state.selectedProposal} selectPolygon={this.selectPolygon} />
                    </Grid>

                    <Grid item xs={3}>
                        <Statistics proposal={this.state.selectedProposal} selectedPolygons={this.state.selectedPolygons} />
                        <Operations onUnion={this.onUnion} onIntersection={this.onIntersection} />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

