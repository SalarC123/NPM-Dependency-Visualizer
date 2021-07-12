import {useContext} from 'react'
import {GraphContext} from '../context/GraphContext'
import Graph from 'react-graph-vis';

function GraphViz() {

    const {dependencies, setDependencies, graphSettings, setGraphSettings} = useContext(GraphContext)

    const options = {
        height: "500px",
        // width: "1000px"
    }
    
    return (
        <div className="border-4 border-black">
            <Graph
                id="dependency-graph"
                graph={graphSettings}
                options={options}
                events={""}
            />
        </div>
    )
}

export default GraphViz;