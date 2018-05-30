(function () {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
   
    var votingContract = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "proposals", "outputs": [{ "name": "candidateName", "type": "bytes32" }, { "name": "voteCount", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "address_created", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "candidate", "type": "bytes32" }], "name": "totalVotesFor", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "CheckVoter", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "candidateID", "type": "uint256" }], "name": "CheckCandidate", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "candidate", "type": "bytes32" }], "name": "validCandidate", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "votesReceived", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "voters", "outputs": [{ "name": "voted", "type": "bool" }, { "name": "delegate", "type": "address" }, { "name": "vote", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "candidate", "type": "bytes32" }], "name": "voteForCandidate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "CountCandidate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "candidateNames", "type": "bytes32[]" }, { "name": "contractAt", "type": "address" }, { "name": "titleCont_byte32", "type": "bytes32" }], "payable": true, "stateMutability": "payable", "type": "constructor" }]);
    var urlParams = window.location.href;
    console.log(urlParams.toString());
    var addressContract = urlParams.substring(urlParams.length - 42, urlParams.length)
    console.log(addressContract);

    contractInstance = votingContract.at(addressContract);

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
            contractInstance.voters(accounts, function (e, candidate) {
                if (candidate[0] == true) {
                    $("#login_metamask").append("<ul style=\"color: #3798D4;\"><b> Address: </b><b style=\"color: red;\">" + accounts + "</b><br /><b>This address has been voted for </b><b style=\"color: red;\">" + web3.toUtf8(candidate[2]) + "</b></ul >")
                    $("#votedFlg").val(true);
                    //$(".mdl-button").attr("style", "display: none;");
                    $(".mdl-button").off('click');   
                    $(".mdl-button").attr("disabled", "disabled");
                    $(".mdl-button").attr("style", "background-color: rgba(0,0,0, 0.26);");
                } else {
                    $("#login_metamask").append("<ul style=\"color: #3798D4;\"><b> Address: </b><b style=\"color: red;\">" + accounts + "</b></ul >")
                    $("#votedFlg").val(false);
                }
            });
           
            document.getElementById('not_login_metamask').style.display = "none";
        }
    });
    contractInstance.CountCandidate(function (error, result) {
    
    var i = 0;
        while (i < result) {
            $(".mdl-grid").append("<div class=\"mdl-cell\"><div class=\"mdl-card mdl-shadow--2dp\"><div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text\" id=\"candidateTitle" + i + "\"></h2><input type=\"hidden\" id=\"candidate" + i + "-hidden\"></div><div class=\"mdl-card__supporting-text\"><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" style=\"color: yellow; background-color: dodgerblue;\" id=\"candidate" + i + "\">Vote!</a></div><div class=\"mdl-card__actions mdl-card--border\"><span>Total Votes:</span><a data-toggle=\"modal\" data-target=\"#myModal" + i + "\" id=\"candidate" + i + "-votes\">0</a></div></div></div></div>");
            
            contractInstance.CheckCandidate(i, function (error2, result2) {
                var candidate = web3.toUtf8(result2[1].toString());
                $("#candidateTitle" + result2[0]).append(candidate.trim());
                $("#candidate" + result2[0] + "-hidden").val(result2[1].toString());
                
                $("#candidate" + result2[0] + "-votes").text(result2[2].toString());
                var array = result2[3]; 
                $("#allModal").append("<div id=\"myModal" + result2[0] + "\" class=\"modal fade\" role=\"dialog\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h4 class=\"modal-title\">List Address Vote For <b style=\"color:blue\">" + candidate + "</b></h4><button type=\"button\" class=\"close\" style=\"margin-top: -12px;\" data-dismiss=\"modal\">&times;</button></div><div class=\"modal-body\"><div id=\"listaddress" + result2[0] + "\"></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div>");
                for (var i = 0; i < result2[3].length; i++) {
                    $("#listaddress" + result2[0]).append("<li>" + result2[3][i] + "</li>");
                }
                if ($("#votedFlg").val() === "true") {
                    $("#candidate" + i).attr("disabled", "disabled");
                    $("#candidate" + i).attr("style", "background-color: rgba(0,0,0, 0.26);");
                } else {
                    //var candidateBtn = document.getElementById('candidate' + result2[0]);
                    //candidateBtn.addEventListener('click', function () {
                    //    vote(this.id);
                    //});
                    $('#candidate' + result2[0]).on("click", function () { alert("clicked!"); });
                }
            });

            i++;
        };
    });
    
    function vote(candidateId) {
        var candidate = $("#" + candidateId + "-hidden").val();
        contractInstance.voteForCandidate(candidate, { from: web3.eth.accounts[0] }, function (err, hash) {
            if (err) {
                console.log(err);
            }

            waitForReceipt(hash, function (receipt) {
                if (typeof receipt === 'undefined') {
                    console.log('Undefined value!');
                    return false;
                }
                if (receipt.status === "0x0") {
                    contractInstance.CheckVoter.call(function (e, v) {
                        if (v === true) {
                            alert("The voter already voted.");
                        }
                    });
                } else {
                    location.reload();
                    //let divId = (candidate + '-votes').toLowerCase();
                    //let voteDiv = document.getElementById(divId);
                    //contractInstance.totalVotesFor.call(candidate, function (e, v) {
                    //    voteDiv.innerHTML = v.toString();
                    //});
                }

            });
        });
    }
    function waitForReceipt(hash, cb) {
        web3.eth.getTransactionReceipt(hash, function (err, receipt) {
            if (err) {
                console.log(err);
            }

            if (receipt !== null) {
                // Transaction went through
                if (cb) {
                    cb(receipt);
                }
            } else {
                // Try again in 1 second
                //$(".mdl-layout__content").css({ display: "none" });
                $(".mdl-button").attr("disable", "disable");
                $(".loader").css({ display: "block" });
                window.setTimeout(function () {
                    waitForReceipt(hash, cb);
                }, 1000);
            }
        });
    }

    //function init() {
    //    let candidateNames = Object.keys(candidates);
    //    for (var i = 0; i < candidateNames.length; i++) {
    //        let candidate = candidateNames[i];
    //        contractInstance.totalVotesFor.call(candidate, function (e, v) {
    //            let divId = (candidate + '-votes').toLowerCase();
    //            let voteDiv = document.getElementById(divId);
    //            voteDiv.innerHTML = v.toString();
    //        });
    //    }
    //}

    //function sleep(milliseconds) {
    //    var start = new Date().getTime();
    //    for (var i = 0; i < 1e7; i++) {
    //        if ((new Date().getTime() - start) > milliseconds) {
    //            break;
    //        }
    //    }
    //}
})();
