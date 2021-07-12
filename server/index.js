require('dotenv').config()
const fetchPackage = require("package-json")
const express = require('express')
const fs = require("fs")

const buf = fs.readFileSync('./test.wasm');

let wasm;
(async () => {
    // Explicitly compile and then instantiate the wasm module.
    const module = await WebAssembly.compile(buf);
    const instance = await WebAssembly.instantiate(module);
  
    wasm = instance.exports;
})();

const app = express();

const inputPackage = 'history'

async function fetchDependencies(packageName) {
    const res = await fetchPackage(packageName, 'latest')
    const dependencies = await Object.keys(res.dependencies || {});
    console.log(packageName + " depends on ", dependencies)
    for (dependency of dependencies) {
        await fetchDependencies(dependency);
    }
}


app.get("/", (req, res) => {
    fetchDependencies(inputPackage);
    console.log(wasm._Z4add1i(8))
})


app.listen(process.env.SERVER_PORT, () => console.log('Server listening on port ' + process.env.SERVER_PORT))
