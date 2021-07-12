import { useContext } from "react";
import {GraphContext} from '../context/GraphContext'

function Packages() {

    const {dependencies, setDependencies, graphSettings, setGraphSettings} = useContext(GraphContext)
    
    return (
        <div>
            {Object.keys(dependencies).map(pkg => (
                <>
                    <div style={{display: "inline-block", margin: 10}}>{pkg} → </div>
                    {dependencies[pkg].map(dependency => (
                        <div style={{display: "inline-block"}}>&nbsp;{dependency},&nbsp;</div>
                    ))}
                    <hr/>
                </>
            ))}
        </div>
    )
}

export default Packages;