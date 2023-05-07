const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const State = require('../model/State');
var staticStates;

fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'))
.then((data) => {
    staticStates = JSON.parse(data);
})
.catch((error) => {
    console.log(error);
});

const getAllStates = async (req, res) => {
    var result = [...staticStates];

    if (Object.keys(req.query).length) {
        if (req.query.contig === 'true') {
            result = staticStates.filter(st => st.code !== 'AK' && st.code !== 'HI');
        }
        else {
            result = staticStates.filter(st => st.code === 'AK' || st.code === 'HI');
        }
    }
    for (const i of result) {
        const state = await State.findOne({ stateCode: i.code });

        if (state.funfacts.length) {
            result.funfacts = [...state.funfacts];
        }
    }
    res.json(result);
}

const getState = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

const getStateFunFact = async (req, res) => {
    const state = await State.findOne({});

    res.json(state);
}

const getStateCapital = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

const getStateNickname = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

const getStatePopulation = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

const getStateAdmission = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

const addStateFunFact = async (req, res) => {
    const result = await State.findOne({ stateCode: req.params.state.toUpperCase() });

    result.funfacts = [...req.body.funfacts];

    res.json(result);
}

const editStateFunFact = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

const deleteStateFunFact = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

module.exports = {
    getAllStates,
    getState,
    getStateFunFact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
    addStateFunFact,
    editStateFunFact,
    deleteStateFunFact
}