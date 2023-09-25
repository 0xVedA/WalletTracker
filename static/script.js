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
            }
        });
    }

    function showAlert(message) {
        // Create an alert element
        const alertElement = $('<div class="alert alert-success" role="alert"></div>');
        alertElement.text(message);

        // Append the alert to the page and automatically dismiss it after a few seconds
        $("#alerts").append(alertElement);
        setTimeout(function() {
            alertElement.fadeOut("slow", function() {
                $(this).remove();
            });
        }, 5000);
    }

    $("#walletForm").on("submit", function(e) {
        e.preventDefault();
        const walletAddress = $("#walletAddress").val();
        const network = $("#networkSelect").val();
        fetchTransactions(walletAddress, network);
        setInterval(() => fetchTransactions(walletAddress, network), 10000);
    });
});
