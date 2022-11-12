const express = require("express");
const router = express.Router();
const { Txes } = require("../models");
var ethUtil = require('ethereumjs-util');
var sigUtil = require('eth-sig-util');



router.get("/", async (req, res) => {
  const listOfTxes = await Txes.findAll();



  res.json(listOfTxes);


});

router.post("/", async (req, res) => {

  const tx  = req.body;
  const msgParams = await tx.msgParams;
  const sig = await tx.sig;
  const recovered_pre = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: sig });
  const recovered = ethUtil.toChecksumAddress(recovered_pre);

  if (recovered === ethUtil.toChecksumAddress(tx.SignerAddress)){
    await Txes.create(tx);
  }


});



module.exports = router;
