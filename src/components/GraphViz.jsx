import {useContext, useEffect, useState} from 'react'
import {GraphContext} from '../context/GraphContext'
import Graph from 'react-graph-vis';

function GraphViz() {

    const {graphSettings} = useContext(GraphContext)

    const [options, setOptions] = useState({
        height: "500px",
        width: "1000px",
        nodes: {
            shape: "box",
            font: {
                face: "Circular, Futura",
                color: "#fff",
                size: 15
            },
            color: {
                border: "red"
            },
            margin: {
                top: 7,
                bottom: 7,
                left: 10,
                right: 10
            },
            mass: 1
        },
        edges: {

        }
    })

    useEffect(() => {
        function handleResize() {
            setOptions({
                ...options,
                width: ""+window.innerWidth,
                height: ""+(window.innerHeight*0.6)
            })
        }

        window.addEventListener('resize', handleResize)
    }, [])
    
    return (
        <div className="border-4 border-black">
            <Graph
                id="dependency-graph"
                graph={graphSettings}
                options={options}
                events={""}
            />
            <p className="m-3 text-center">Scroll to zoom - Click to view connecting edges - Drag to move around</p>
        </div>
    )
}

export default GraphViz;