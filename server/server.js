if (process.env.NODE_ENV != 'production') require('dotenv').config()
const fetchPackage = require("package-json")
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')

const app = express();
app.use(cors())
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlencodedParser)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../build'))
}


let deps = {}

async function fetchDependencies(packageName, parent="") {
    const res = await fetchPackage(packageName, 'latest')
    const dependencies = await Object.keys(res.dependencies || {});
    deps[packageName] = dependencies
    // parent ? deps[packageName].push(parent): null;

    for (dependency of dependencies) {
        // if (!dependency || dependency === parent) continue
        await fetchDependencies(dependency, packageName);
    }
}

let depsCopy = {};

app.post("/dependencies", async (req, res) => {
    req.setTimeout(60000)
    try {
        await fetchDependencies(req.body.packageName);
    } catch (err) {
        return res.json({errorMessage: err})
    }

    // create copy to return so that deps can be reset befofe next call to this route
    depsCopy = {...deps};
    deps = {};
    return res.json(depsCopy);
})

class Queue {

    queue = []

    constructor(initialQueue=[]) {
        this.queue = initialQueue;
    }

    enqueue(value) {
        this.queue.push(value)
    }

    dequeue() {
        const removedElement = this.queue.shift()
        return removedElement;
    }

    empty() {
        return this.queue.length === 0;
    }
};

function findDistanceBetween(a, b, adjList) {

    // DIJKSTRA'S ALGORITHM

    const q = new Queue();
    const visited = {}
    const distances = {}
    const prev = {}
    
    q.enqueue(a)
    distances[a] = 0;
    while (!q.empty()) {
        let dependency = q.dequeue()
        if (visited[dependency]) continue
        visited[dependency] = 1;
        for (item of adjList[dependency]) {
            if (distances[item] === undefined) distances[item] = Number.MAX_VALUE
            if (distances[dependency]+1 < distances[item]) {
                distances[item] = distances[dependency]+1
                prev[item] = dependency;
            }
            q.enqueue(item)
        }
    }    

    // Find each node on path with shortest distance
    let parent = b;
    const path = [];

    for (let i = 0; i < distances[b]+1; i++) {
        if (!parent) break;
        path.push(parent);
        parent = prev[parent];
    }

    return {distance: distances[b], path: path};
}

app.post("/distanceBetween", (req, res) => {
    const {package1, package2} = req.body
    const currentNodes = Object.keys(depsCopy)
    if (currentNodes.includes(package1) && currentNodes.includes(package2)) {
        const {distance, path} = findDistanceBetween(package1, package2, depsCopy)
        distance === undefined
            ? res.json({errorMessage: `${package2} is not a child of ${package1}`})
            : res.json({
                message: `${package1} and ${package2} are a distance of ${distance} package${distance == 1 ? "": "s"} away from each other`,
                path: path,
            })
    } else {
        res.json({errorMessage: "Package Not Found"})
    }
})

app.listen(process.env.PORT || 5000, () => console.log('Server listening on port ' + process.env.SERVER_PORT))
