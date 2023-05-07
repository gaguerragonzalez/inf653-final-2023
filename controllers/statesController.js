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
    if (Object.keys(req.query).length) {
        if (req.query.contig === 'true') {
            console.log("contig")
            res.json(staticStates.filter(st => st.code !== 'AK' && st.code !== 'HI'));
        }
        else {
            console.log("not contig")
            res.json(staticStates.filter(st => st.code === 'AK' || st.code === 'HI'));
        }
    }
    else {
        res.json(staticStates);
    }
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required' });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getState = async (req, res) => {
    const state = staticStates.find(st => st.code == req.params.state.toUpperCase());
    res.json(state);
}

module.exports = {
    getAllStates,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getState
}