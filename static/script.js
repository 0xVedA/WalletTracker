$(document).ready(function() {
    function fetchTransactions(walletAddress, network) {
        const apiEndpoint = network === "ethereum" ? "/get_ethereum_transactions" : "/get_polygon_transactions";

        $.ajax({
            url: apiEndpoint,
            type: "POST",
            data: { walletAddress: walletAddress },
            success: function(data) {
                const transactionList = $("#transactionList");
                const currentTransactions = transactionList.html();

                // Update the transaction list
                transactionList.html(data);

                // Check for new transactions
                if (data !== currentTransactions) {
                    // New transactions detected, show an alert
                    showAlert("New transactions detected!");
                }

                // Update transaction times
                updateTransactionTimes();
            }
        });
    }

    function showAlert(message) {
        // ... (previous code for showing alerts)
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
