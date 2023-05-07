const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const verifyStates = async (req, res, next) => {
    const stateCodes = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'stateCodes.json'))

    if (stateCodes.indexOf(req.params.state.toUpperCase()) >= 0) {
        console.log(stateCodes.length)
        next();
    }
    else {
        res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }
}

module.exports = verifyStates;