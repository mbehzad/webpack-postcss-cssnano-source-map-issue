// decode VLQ to numbers

const fs = require('fs');
const { decode } = require('sourcemap-codec');

const mapWp = fs.readFileSync('./dist/css/output.css.map', 'utf-8');

console.log('decoded webpack source-map:', decode(JSON.parse(mapWp).mappings));
