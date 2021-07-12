if (process.env.NODE_ENV != 'production') require('dotenv').config()
const fetchPackage = require("package-json")
const express = require("express")
const fs = require("fs")
const cors = require("cors")
const bodyParser = require('body-parser')

const buf = fs.readFileSync('./test.wasm');
let wasm;
(async () => {
    // Explicitly compile and then instantiate the wasm module.
    const module = await WebAssembly.compile(buf);
    const instance = await WebAssembly.instantiate(module);
  
    wasm = instance.exports;
})();

const app = express();
app.use(cors())
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlencodedParser)

let deps = {}

async function fetchDependencies(packageName) {
    const res = await fetchPackage(packageName, 'latest')
    const dependencies = await Object.keys(res.dependencies || {});
    deps[packageName] = dependencies

    for (dependency of dependencies) {
        await fetchDependencies(dependency);
    }
}


app.post("/dependencies", async (req, res) => {
    try {
        await fetchDependencies(req.body.packageName);
    } catch (err) {
        return res.json({errorMessage: err})
    }
    console.log(wasm._Z4add1i(8))
    // create copy to return so that deps can be reset befofe next call to this route
    const depsCopy = {...deps};
    deps = {};
    return res.json(depsCopy);
})


app.listen(process.env.SERVER_PORT, () => console.log('Server listening on port ' + process.env.SERVER_PORT))
