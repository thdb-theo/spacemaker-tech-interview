import Button from '@mui/material/Button';

const headerStyle = {
    fontSize: '1.5em',
    marginBottom: '1em',
}


export default function Operations(props) {
    return (
        <div className="operations">
            <p style={headerStyle}>Operations</p>
            <Button onClick={props.onUnion}>Union</Button>
            <Button onClick={props.onIntersection}>Intersection</Button>
        </div>
    );
}