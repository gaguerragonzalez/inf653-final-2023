const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const numberFormatter = require('number-formatter');
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
            i.funfacts = [...state.funfacts];
        }
    }
    res.json(result);
}

const getState = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state);
    const dbState = await State.findOne({ stateCode: state.code });
    if (dbState.funfacts.length) {
        state.funfacts = [...dbState.funfacts];
    }
    res.json(state);
}

const getStateFunFact = async (req, res) => {
    const state = await State.findOne({ stateCode: req.params.state });
    const sState = staticStates.find(st => st.code == req.params.state);

    if (state.funfacts.length) {
        res.json({ funfact: state.funfacts[Math.floor(Math.random() * state.funfacts.length)] });
    }
    else {
        res.json({ "message": "No Fun Facts found for " + sState.state })
    }

}

const getStateCapital = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state);
    res.json({ "state": state.state, "capital": state.capital_city });
}

const getStateNickname = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state);
    res.json({ "state": state.state, "nickname": state.nickname });
}

const getStatePopulation = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state);
    res.json({ "state": state.state, "population": numberFormatter('#,###.', state.population) });
}

const getStateAdmission = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state);
    res.json({ "state": state.state, "admitted": state.admission_date });
}

const addStateFunFact = async (req, res) => {
    const result = await State.findOne({ stateCode: req.params.state });

    console.log(req.body.funfacts)
    if (!req.body.funfacts) {
        res.json({ 'message': 'State fun facts value required' });
    }
    else if (req.body.funfacts instanceof String || !(req.body.funfacts instanceof Array)) {
        res.json({ 'message': 'State fun facts value must be an array' });
    }
    else {
        result.funfacts.push(...req.body.funfacts);
        result.save();
        res.json(result);
    }
}

const editStateFunFact = async (req, res) => {
    const sState = staticStates.find(st => st.code == req.params.state);
    const state = await State.findOne({ stateCode: req.params.state });

    if (!req.body.index) {
        res.json({ 'message': 'State fun fact index value required' });
    }
    else if (!req.body.funfact) {
        res.json({ 'message': 'State fun fact value required' });
    }
    else if (!state.funfacts.length) {
        res.json({ 'message': 'No Fun Facts found for ' + sState.state })
    }
    else if (req.body.index <= 0 || req.body.index > state.funfacts.length) {
        res.json({ 'message': 'No Fun Fact found at that index for ' + sState.state })
    }
    else {
        state.funfacts[req.body.index - 1] = req.body.funfact;
        state.save();
        res.json(state);
    }
}

const deleteStateFunFact = async (req, res) => {
    const sState = staticStates.find(st => st.code == req.params.state);
    const state = await State.findOne({ stateCode: req.params.state });

    if (!req.body.index) {
        res.json({ 'message': 'State fun fact index value required' });
    }
    else if (!state.funfacts.length) {
        res.json({ 'message': 'No Fun Facts found for ' + sState.state })
    }
    else if (req.body.index <= 0 || req.body.index > state.funfacts.length) {
        res.json({ 'message': 'No Fun Fact found at that index for ' + sState.state })
    }
    else {
        const toEdit = state.funfacts;
        toEdit.splice(req.body.index - 1, 1);
        state.funfacts = toEdit;
        state.save();
        res.json(state);
    }
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