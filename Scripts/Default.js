(function () {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    web3.eth.getAccounts(function (err, accounts) {
        if (err !== null) console.error("An error occurred: " + err);
        else if (accounts.length === 0) {
            console.log("User is not logged in to MetaMask");
            document.getElementById('not_login_metamask').style.display = "block";
            document.getElementById('login_metamask').style.display = "none";
    
        }
        else {
            console.log("User is logged in to MetaMask");
            document.getElementById('login_metamask').style.display = "block";
            document.getElementById('not_login_metamask').style.display = "none";
        }
    });

    var listcontractvoteContract = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "contractAccts", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "allContracts", "outputs": [{ "name": "idCont", "type": "uint256" }, { "name": "titleCont", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_address", "type": "address" }], "name": "getMyContract", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getContracts", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }, { "name": "_titleCont", "type": "bytes32" }], "name": "AddContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]);
    contractInstance = listcontractvoteContract.at('0xf849ccfea6772cfa2bbf510acee1f164e9b76743');
    init();
    
    //console.log(list_address);
    function init() {
        contractInstance.getContracts.call(function(e, ListContract) {
           
            if (ListContract.length > 0) {
                var i;
                for (i = 0; i < ListContract.length; i++) {
                    $(".row").append("<div class=\"col-lg-3 col-md-4 col-sm-6 portfolio-item\"><div class=\"card h-100\"><div class=\"card-body\"><h4 class=\"card-title\" id=\"ContractID_"+ (i+1) +"\"></h4></div></div></div >");
                    contractInstance.getMyContract.call(ListContract[i], function (error, result) {
                        console.log("#ContractID_" + result[0]);
                        $("#ContractID_" + result[0]).append("<a href=\"Detail?" + result[1] + "\">" + web3.toUtf8(result[2]) + "</a>");
                        
                    });
                    
                }
            }
        });
       
    }
   
})();