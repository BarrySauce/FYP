import React, { Component } from "react";
import Receiver from "./contracts/receiver.sol/Receiver.json";
import getWeb3 from "./getWeb3";
import "./App.css";
var ethUtil = require('ethereumjs-util');
var sigUtil = require('eth-sig-util');

class App extends Component {
  state = { web3: null, accounts: null, account: '', contract: null, apiResponse: ''};

  /*callAPI(){
    fetch("http://localhost:9000/testAPI")
    .then(res => res.text())
    .then(res => this.setState({apiResponse: res}));
  };

  componentWillMount(){
    this.callAPI();
    console.log(this.state.apiResponse);
  };*/

  componentDidMount = async () => {

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      this.setState({ account: accounts[0] })

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        Receiver.abi,
        "0x89F1152967Be70BCCDc43b68AC481ad327f3CfB9",
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3: web3, accounts: accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  signData = async (token, amount, recipient, relayer) => {
    const { web3, accounts, contract } = this.state;
    var signer = accounts[0];
    console.log(Date.now());
    var milsec_deadline = Date.now() / 1000 + 86400;
    console.log(milsec_deadline, "milisec");
    var deadline = parseInt(String(milsec_deadline).slice(0, 10));
    console.log(deadline, "sec");

    web3.currentProvider.sendAsync({
      method: 'net_version',
      params: [],
      jsonrpc: "2.0"
    }, async function (err, result) {
      const netId = result.result;
      //const netId = 1;
      console.log("netId", netId);

      var nonce_owner = await contract.methods.getNonce(
          token,
          signer
      )
      .call({from: signer});
      console.log('nonce_owner', nonce_owner);

      const msgParams = JSON.stringify({
        types:
        {
        EIP712Domain:[
          {name:"name",type:"string"},
          {name:"version",type:"string"},
          {name:"chainId",type:"uint256"},
          {name:"verifyingContract",type:"address"}
        ],
        Permit:[
        {name:"owner", type:"address"},
        {name:"spender",type:"address"},
        {name:"value", type: "uint256"},
        {name:"nonce", type: "uint256"},
        {name:"deadline",type:"uint256"}
        ]
      },

      primaryType:"Permit",
      domain:{name:"FYP-A1068",version:"v1",chainId:netId,verifyingContract: token},
      message:{
        owner: signer,
        spender: relayer,
        value: amount,
        nonce: nonce_owner,
        deadline: deadline
      }
      })

      var from = signer;

      console.log('CLICKED, SENDING PERSONAL SIGN REQ', 'from', from, msgParams)
      var params = [from, msgParams]
      console.dir(params)
      var method = 'eth_signTypedData_v4'

      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, async function (err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          alert(result.error.message)
        }
        if (result.error) return console.error('ERROR', result)
        console.log('TYPED SIGNED:' + JSON.stringify(result.result))

        const recovered = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: result.result })

        console.log(from);
        console.log(recovered)

        const sig = result.result;

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                TokenAddress: token,
                SignerAddress: signer,
                spender: relayer,
                amount: amount,
                deadline: deadline,
                RecipientAddress: recipient,
                sig: sig,
                msgParams: msgParams
            })
        };

        if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {

          fetch("http://localhost:4001/txes", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log(result);
              /*if(result.code == 1) {
                  alert('Relayer service ERROR: ', result.msg)
              }
              else {
                  console.log(result);
                  openMessage(result.transaction_id);
              }*/

          })

          alert('Successfully ecRecovered signer as ' + from)
        } else {
          alert('Failed to verify signer when comparing ' + result + ' to ' + from)
        }

        //getting r s v from a signature
        const signature = result.result.substring(2);
        const r = "0x" + signature.substring(0, 64);
        const s = "0x" + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);
        console.log("r:", r);
        console.log("s:", s);
        console.log("v:", v);

      })
    })
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h2>MetaTx</h2>
        <div>current user account is: {this.state.account}</div>
        <br></br>
        <br></br>
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
            <form onSubmit={(event) => {
              event.preventDefault()
              const token = this.token.value
              const amount = this.amount.value
              const recipient = this.recipient.value
              const relayer = this.relayer.value
              this.signData(token, amount, recipient, relayer)
            }}>
              <label>
                Address of the token you want to transfer
                <input
                  type='text'
                  className = 'form-control mb-1'
                  placeholder=''
                  ref = {(input) => {this.token = input }}
                />
              </label>
              <br></br>
              <br></br>
              <label>
                Amount of the token to be transferred
                <input
                  type='text'
                  className = 'form-control mb-1'
                  placeholder=''
                  ref = {(input) => {this.amount = input }}
                />
              </label>
              <br></br>
              <br></br>
              <label>
                Recipient address
                <input
                  type='text'
                  className = 'form-control mb-1'
                  placeholder=''
                  ref = {(input) => {this.recipient = input }}
                />
              </label>
              <br></br>
              <br></br>
              <label>
                Relayer address
                <input
                  type='text'
                  className = 'form-control mb-1'
                  placeholder=''
                  ref = {(input) => {this.relayer = input }}
                />
              </label>
              <br></br>
              <br></br>
              <input
                type='submit'
                className='btn btn-block'
                value='press to activate transfer'
              />
            </form>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
