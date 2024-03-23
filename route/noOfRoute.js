
const express = require('express')
const {  dataInfo} = require('../controller/noOfUnitController')
const noOfUnitRoute = express.Router()


noOfUnitRoute.get('/noOfUnit', dataInfo)
// hsnRoute.get('/findall_hsn', findAllHsn)
// hsnRoute.patch('/update_hsn/:id', updateHsn)
// hsnRoute.delete('/:id', deletedhsn)

module.exports = noOfUnitRoute