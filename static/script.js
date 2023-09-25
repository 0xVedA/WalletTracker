$(document).ready(function() {
    function fetchTransactions(walletAddress, network) {
        const apiEndpoint = network === "ethereum" ? "/get_ethereum_transactions" : "/get_polygon_transactions";

        $.ajax({
            url: apiEndpoint,
            type: "POST",
            data: { walletAddress: walletAddress },
            success: function(data) {
                $("#transactionList").html(data);
            }
        });
    }

    $("#walletForm").on("submit", function(e) {
        e.preventDefault();
        const walletAddress = $("#walletAddress").val();
        const network = $("#networkSelect").val();
        fetchTransactions(walletAddress, network);
        setInterval(() => fetchTransactions(walletAddress, network), 10000);
    });
});
