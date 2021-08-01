// this file needs to be in commonJS for some reason 
// but some utility functions I made are in ES6 and have to be in ES6 for compatibility with other files
// so I'm forcing this to be in ES6 too

const requireEsm = require('esm')(module)
module.exports = requireEsm('./src/utils/gatsby-node.esm.js')
