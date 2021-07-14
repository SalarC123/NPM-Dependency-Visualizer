import { useContext, useState } from "react";
import { GraphContext } from './context/GraphContext'
import Packages from './components/Packages'
import GraphViz from './components/GraphViz'

function App() {

    const {dependencies, setDependencies, graphSettings, setGraphSettings} = useContext(GraphContext)
    const [message, setMessage] = useState("")

    function addNodesAndEdges(packages) {
        const nodes = [];
        const nodeSet = new Set()
        const edges = [];
        for (let dependency of Object.keys(packages)) {
            if (!nodeSet.has(dependency)) {
                nodes.push({id: dependency,  label: dependency, color: "blue"})
            }
            nodeSet.add(dependency)
            for (let innerDependency of packages[dependency]) {
                if (!nodeSet.has(innerDependency)) {
                    nodes.push({id: innerDependency, label: innerDependency, color: "red"})
                    nodeSet.add(innerDependency)
                }
                edges.push({ from: dependency, to: innerDependency})
            }
        }

        return {nodes, edges};
    }

    async function getDependencies(e) {
        e.preventDefault()

        const form = e.target;
        const packageName = form[0].value;
        form[0].value = ""

        const res = await fetch("/dependencies", {
            method: 'POST',
            headers: {
                "Content-type": 'application/json',
            },
            body: JSON.stringify({packageName: packageName})
        })
        const data = await res.json();
        setDependencies(data)
        setGraphSettings(addNodesAndEdges(data))
    }

    function changeNodeColor(node, color, location) {
        const nodes = graphSettings.nodes
        nodes.splice(location, 1, {...node, color: color})
        const newGraph = {...graphSettings}
        newGraph.nodes = nodes
        setGraphSettings("")
        setGraphSettings(newGraph)
    }

    function resetNodeColors() {
        const nodes = graphSettings.nodes
        for (let i = 0; i < graphSettings.nodes.length; i++) {
            const node = graphSettings.nodes[i]
            if (node.color != "red" || node.color != "blue") {
                nodes.splice(i,1,{...node, color: "red"})
                // setGraphSettings("")
                setGraphSettings({...graphSettings, nodes: nodes})
            }
        }
    }

    async function findDistanceBetween(e) {
        e.preventDefault()
        const form = e.target
        const package1 = form[0].value
        const package2 = form[1].value

        const res = await fetch("/distanceBetween", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({package1, package2})
        })
        const data = await res.json()
        setMessage(data.message)

        resetNodeColors()

        for (let pkg of data.path) {
            for (let i = 0; i < graphSettings.nodes.length; i++) {
                const node = graphSettings.nodes[i]
                if (node.id === pkg) {
                    changeNodeColor(node, "green", i)
                }
            }
        }
        
        // console.log(colormap)
        // console.log(data.path)

        // for (let i = 0; i < data.path.length - 1; i++) {
        //     setColormap({...colormap, [data.path[i+1]+'-'+data.path[i]]: "pink"})
        // }
    }

    return (
        <div className="flex flex-col items-center">

            <GraphViz/>

            <h1 className="m-4 font-extrabold lg:text-7xl sm:text-6xl text-4xl text-center">
                NPM Dependency Visualizer
			</h1>

            {message
                ? <div className="bg-black mb-4 p-3 text-xl text-white font-bold">{message}</div>
                : <div></div>
            }
            <div className="flex flex-col md:flex-row items-center justify-center">
                <form className="text-center my-4 w-72 flex flex-col items-center" onSubmit={(event) => getDependencies(event)}>
                    <label className="text-2xl m-2" htmlFor="inputPackage">Package Name</label>
                    <input className="focus:border-blue-400 border-4" required type="text" id="inputPackage"/>
                    <input className="p-2 m-2 text-xl rounded-lg bg-blue-400 w-24 text-white font-extrabold" type="submit" value="Submit"/>
                </form>

                <form className="flex flex-col items-center justify-center" onSubmit={(event) => findDistanceBetween(event)}>
                    <label className="text-2xl text-center" htmlFor="package">Find the distance between two packages</label>
                    <input className="m-2 focus:border-blue-400 border-4" type="text" id="package"/>
                    <input className="m-2 focus:border-blue-400 border-4" type="text"/>
                    <input className="p-2 m-2 text-xl rounded-lg bg-blue-400 text-white font-extrabold" type="submit" value="Submit"/>
                </form>
            </div>

            <Packages/>
        </div>
    );
}

export default App;
