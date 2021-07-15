import { useContext } from "react";
import { GraphContext } from "../context/GraphContext";
import { MessageContext } from "../context/MessageContext";

function PackageForm() {

    const {setGraphSettings, setDependencies} = useContext(GraphContext);
    const {setMessage, setAlertColor} = useContext(MessageContext)

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

        document.activeElement.blur()

        setAlertColor("black")
        setMessage("Loading...")

        const form = e.target;
        const packageName = form[0].value;
        form[0].value = ""

        try {
            const res = await fetch("/api/dependencies", {
                method: 'POST',
                headers: {
                    "Content-type": 'application/json',
                },
                body: JSON.stringify({packageName: packageName})
            })
            const data = await res.json();
            if (data.errorMessage) {
                setMessage("Package Not Found")
                setAlertColor("red-500")
            } else {
                setMessage("")
    
                setDependencies(data)
                setGraphSettings(addNodesAndEdges(data))
            }
        } catch(err) {
            setMessage("Request Timed Out (try a smaller package next time)")
            setAlertColor("red-500")
        }
    }

    return (
        <form className="text-center my-4 w-72 flex flex-col items-center" onSubmit={(event) => getDependencies(event)}>
            <label className="text-2xl m-2" htmlFor="inputPackage">Package Name</label>
            <input className="focus:border-blue-400 border-4" required type="text" id="inputPackage"/>
            <input className="p-2 m-2 text-xl rounded-lg bg-blue-400 w-24 text-white font-extrabold" type="submit" value="Submit"/>
        </form>
    )   
}

export default PackageForm