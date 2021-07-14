import { useContext } from "react";
import { MessageContext } from './context/MessageContext'
import Packages from './components/Packages'
import GraphViz from './components/GraphViz'
import Alert from './components/Alert'
import Forms from "./components/Forms";

function App() {

    const {message, alertColor} = useContext(MessageContext)

    return (
        <div className="flex flex-col items-center">

            {message === "Loading..."
                ? <div className="w-full h-full opacity-30 bg-black fixed"></div>
                : null 
            }

            <GraphViz/>

            <h1 className="m-4 font-extrabold lg:text-7xl sm:text-6xl text-4xl text-center">
                NPM Dependency Visualizer
			</h1>

            <Alert message={message} color={alertColor}/>
            <Forms/>
            <Packages/>
        </div>
    );
}

export default App;
