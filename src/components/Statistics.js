import React from "react";
import * as turf from "@turf/turf";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableRow, TableCell } from "@mui/material";
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
                union = turf.polygon([[[0, 0], [0, 0], [0, 0], [0, 0]]]);
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
            <Card sx={{ marginTop: '50px', minWidth: 400, bgcolor: 'background.paper' }}>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Typography>Area of Proposal</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{Number(this.state.totalArea).toFixed(2)} m<sup>2</sup></Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography>Area of Selected Polygons</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>{Number(this.state.selectedArea).toFixed(2)} m<sup>2</sup></Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card >
        );
    }
}