import { useContext } from "react";
import { GraphContext } from './context/GraphContext'
import Packages from './components/Packages'
import GraphViz from './components/GraphViz'

function App() {

    const {dependencies, setDependencies, graphSettings, setGraphSettings} = useContext(GraphContext)

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

        const nodes = [];
        const nodeSet = new Set()
        const edges = [];
        for (let dependency of Object.keys(data)) {
            if (!nodeSet.has(dependency)) {
                nodes.push({id: dependency,  label: "   ", title: dependency, color: "blue"})
            }
            nodeSet.add(dependency)
            for (let innerDependency of data[dependency]) {
                console.log(nodeSet, innerDependency, nodeSet.has(innerDependency))
                if (!nodeSet.has(innerDependency)) {
                    nodes.push({id: innerDependency, label: "   ", title: innerDependency, color: "red"})
                    nodeSet.add(innerDependency)
                }
                edges.push({ from: dependency, to: innerDependency })
            }
        }
        setGraphSettings({nodes: nodes, edges: edges})
    }

    return (
        <div className="App">

            <button onClick={() => console.log(graphSettings)}>CLICK</button>

            <GraphViz/>

            <h1 style={{fontSize:"5rem", fontWeight: "bold"}}>
                NPM Dependency Visualizer
			</h1>
            <form onSubmit={(event) => getDependencies(event)}>
                <label htmlFor="inputPackage">Package Name</label>
                <input required type="text" id="inputPackage"/>
                <input type="submit" value="Submit"/>
            </form>

            <Packages/>
        </div>
    );
}

export default App;
