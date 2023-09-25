from flask import Flask, render_template, request
import requests

app = Flask(__name__)

# Replace with your own API keys
etherscan_api_key = "FD9EINWQSNZJ6MT59SKZ6U3BHJNXD2TR48"
polygonscan_api_key = "SS6EQC3YBPDQHE2443B63BHXJJ1HY2AQGY"

# Etherscan and PolygonScan API endpoints
etherscan_base_url = "https://api.etherscan.io/api"
polygonscan_base_url = "https://api.polygonscan.com/api"

# Store the last known transaction hash
last_transaction_hash = ""

def get_wallet_transactions(address, network):
    if network == "ethereum":
        api_key = etherscan_api_key
        api_endpoint = etherscan_base_url
    elif network == "polygon":
        api_key = polygonscan_api_key
        api_endpoint = polygonscan_base_url
    else:
        return []

    params = {
        "module": "account",
        "action": "txlist",
        "address": address,
        "apikey": api_key,
    }

    response = requests.get(api_endpoint, params=params)
    if response.status_code == 200:
        data = response.json()
        transactions = data.get("result", [])
        for tx in transactions:
            tx['network'] = network
        return transactions
    else:
        return []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        wallet_address = request.form.get("walletAddress")
        network = request.form.get("network")
        transactions = get_wallet_transactions(wallet_address, network)
        return render_template("transactions.html", transactions=transactions)

    return render_template("index.html", transactions=None)

if __name__ == "__main__":
    app.run(debug=True)
