import { useContext } from "react";
import { GraphContext } from "../context/GraphContext";
import { MessageContext } from "../context/MessageContext";

function DistanceForm() {


    const {graphSettings, setGraphSettings} = useContext(GraphContext);
    const {setMessage, setAlertColor} = useContext(MessageContext)

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
            if (node.color !== "red" || node.color !== "blue") {
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

        // clear input fields
        form[0].value = ""
        form[1].value = ""

        const res = await fetch("/api/distanceBetween", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({package1, package2})
        })
        const data = await res.json()
        if (data.errorMessage) {
            setAlertColor("red-500")
            setMessage(data.errorMessage)
        } else {
            setAlertColor("blue-400")
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
        }
    }

    return (
        <form className="flex flex-col items-center justify-center" onSubmit={(event) => findDistanceBetween(event)}>
            <label className="text-2xl text-center" htmlFor="package">Find the distance between two packages</label>
            <input required className="m-2 focus:border-blue-400 border-4" type="text" id="package"/>
            <input required className="m-2 focus:border-blue-400 border-4" type="text"/>
            <input className="p-2 m-2 text-xl rounded-lg bg-blue-400 text-white font-extrabold" type="submit" value="Submit"/>
        </form>
    )   
}

export default DistanceForm