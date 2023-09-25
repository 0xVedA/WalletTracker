$(document).ready(function() {
    // Keep track of the last known transaction hash
    let lastTransactionHash = "";

    function fetchTransactions(walletAddress, network) {
        const apiEndpoint = network === "ethereum" ? "/get_ethereum_transactions" : "/get_polygon_transactions";

        $.ajax({
            url: apiEndpoint,
            type: "POST",
            data: { walletAddress: walletAddress },
            success: function(data) {
                const transactionList = $("#transactionList");

                // Extract the transaction hashes from the new data
                const newTransactionHashes = $(data).find(".transaction-hash").map(function() {
                    return $(this).text();
                }).get();

                if (newTransactionHashes.length > 0) {
                    // Get the latest transaction hash
                    const newTransactionHash = newTransactionHashes[0];

                    if (newTransactionHash !== lastTransactionHash) {
                        // New transaction detected, show an alert
                        const senderAddress = $(data).find(".sender-address").first().text();
                        const receiverAddress = $(data).find(".receiver-address").first().text();
                        showAlert("New transaction detected!", senderAddress, receiverAddress);

                        // Update the last known transaction hash
                        lastTransactionHash = newTransactionHash;
                    }
                }

                // Update the transaction list
                transactionList.html(data);

                // Reverse the order of transactions and update transaction times
                const reversedTransactions = transactionList.children().get().reverse();
                transactionList.empty().append(reversedTransactions);
                updateTransactionTimes();
            }
        });
    }

    function showAlert(message, sender, receiver) {
        // Create an alert message that includes sender and receiver addresses
        const alertMessage = `New transaction detected!\nSender: ${sender}\nReceiver: ${receiver}`;

        // Display a simple alert popup with the message
        alert(alertMessage);
    }

    function updateTransactionTimes() {
        // Format and display transaction times
        $(".transaction").each(function() {
            const timestamp = parseInt($(this).find(".transaction-time").data("timestamp"));
            const formattedTime = new Date(timestamp * 1000).toLocaleString();
            $(this).find(".transaction-time").text(formattedTime);
        });
    }

    $("#walletForm").on("submit", function(e) {
        e.preventDefault();
        const walletAddress = $("#walletAddress").val();
        const network = $("#networkSelect").val();
        fetchTransactions(walletAddress, network);
        setInterval(() => fetchTransactions(walletAddress, network), 10000);
    });

    // Initial call to update transaction times on page load
    updateTransactionTimes();
});
