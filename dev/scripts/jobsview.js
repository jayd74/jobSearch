import React from 'react';
import ReactDOM from 'react-dom';

class JobsView extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.jobsAppliedFor);
    }

    render(){
        return (
            <div>
                <h2>Jobs Applied For:</h2>
                {Object.values(this.props.jobsAppliedFor).map((item)=>{
                    return <h3>{item.company}</h3>
                })}
            </div>
        );
    }
}

export default JobsView;