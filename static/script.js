$(document).ready(function() {
    // Function to fetch wallet transactions and update the list
    function fetchTransactions(walletAddress) {
        // Make an AJAX request to fetch transactions
        $.ajax({
            url: "/get_transactions",
            type: "POST",
            data: { walletAddress: walletAddress },
            success: function(data) {
                // Update the transaction list
                $("#transactionList").html(data);
            }
        });
    }

    // Handle form submission
    $("#walletForm").on("submit", function(e) {
        e.preventDefault();
        const walletAddress = $("#walletAddress").val();
        fetchTransactions(walletAddress);
        // Poll for new transactions every 10 seconds
        setInterval(() => fetchTransactions(walletAddress), 10000);
    });
});
