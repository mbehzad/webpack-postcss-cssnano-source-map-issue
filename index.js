// decode VLQ to numbers

const fs = require('fs');
const mapWp = fs.readFileSync('./dist/css/output-wp.css.map', 'utf-8');
const mapCli = fs.readFileSync('./dist/css/output-cli.css.map', 'utf-8');

const { decode } = require('sourcemap-codec');


console.log('decoded webpack source-map:', decode(JSON.parse(mapWp).mappings));
console.log('decoded postcss cli source-map:', decode(JSON.parse(mapCli).mappings));
