const express = require("express");

const indexController = require("../controllers/user/indexController");


const multer = require('multer');
const upload = require('../helpers/multer');
const router = express.Router();

router.get("/", indexController.getTrangChu);

module.exports = router;