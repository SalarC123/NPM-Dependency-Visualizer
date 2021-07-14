import { useContext } from "react";
import {GraphContext} from '../context/GraphContext'

function Packages() {

    const {dependencies, setDependencies, graphSettings, setGraphSettings} = useContext(GraphContext)
    
    return (
        <div className="mb-4 lg:w-1/2 sm:w-4/5 w-72">
            <h1 className="text-3xl my-4 font-bold text-center">Dependencies Chart</h1>
            {Object.keys(dependencies)[0]
                ?   Object.keys(dependencies).map(pkg => (
                        <>
                            <div className="inline-block">
                                <h3 className="inline-block text-blue-400 font-bold">{pkg}&nbsp;</h3>
                                &#10230;
                            </div>
                            {dependencies[pkg].map(dependency => (
                                <div className="inline-block">&nbsp;{dependency},&nbsp;</div>
                            ))}
                            <hr className="m-3"/>
                        </>
                    ))
                :   <div>Enter a package name...</div>
            }
        </div>
    )
}

export default Packages;