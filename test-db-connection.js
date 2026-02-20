const mongoose = require('mongoose');
const dns = require('dns');

// Get the URI from your .env.local manually for this test
const uri = "YOUR_MONGODB_URI_HERE";

console.log("🔍 Starting MongoDB Connection Diagnostic...");

// 1. Test DNS Resolution
const clusterHost = uri.match(/@([^/]+)/)?.[1];
if (clusterHost) {
    console.log(`Checking DNS for: ${clusterHost}`);
    dns.resolveSrv(`_mongodb._tcp.${clusterHost}`, (err, addresses) => {
        if (err) {
            console.error("❌ DNS SRV Resolution Failed:", err.code);
            console.log("💡 Suggestion: Your internet provider or local DNS may be blocking SRV records. Try changing your DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare).");
        } else {
            console.log("✅ DNS SRV Resolution Success:", addresses);
        }
    });
}

// 2. Test Connection
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
    .then(() => {
        console.log("✅ SUCCESS: Connected to MongoDB successfully!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ CONNECTION FAILED:", err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.log("💡 Context: ECONNREFUSED means the connection was rejected. This usually happens if the IP is NOT whitelisted OR your firewall is blocking port 27017.");
        }
        process.exit(1);
    });
