# MongoDB connection (fix querySrv ECONNREFUSED)

If you see **`querySrv ECONNREFUSED _mongodb._tcp.cluster0.xxxxx.mongodb.net`** in Node but Compass connects fine, the app is failing on the **SRV** DNS lookup used by `mongodb+srv://` URIs. Fix it by using the **standard (non-SRV) connection string** for the **same** cluster — no new database and **no need to copy users**.

## Your cluster (cluster0.2t5iq.mongodb.net)

Atlas shows the SRV form:
`mongodb+srv://dealogroupincorporated:<db_password>@cluster0.2t5iq.mongodb.net/?appName=Cluster0`

**Add this to `.env.local`** — replace `YOUR_DB_PASSWORD` with your real DB password (the same one in `MONGODB_URL` or Compass):

```env
MONGODB_STANDARD_URI=mongodb://dealogroupincorporated:YOUR_DB_PASSWORD@cluster0-shard-00-00.2t5iq.mongodb.net:27017,cluster0-shard-00-01.2t5iq.mongodb.net:27017,cluster0-shard-00-02.2t5iq.mongodb.net:27017/dealo?ssl=true&replicaSet=atlas-2t5iq-shard-0&authSource=admin
```

- **Password with special characters?** URL-encode them: `@` → `%40`, `#` → `%23`, `%` → `%25`, `/` → `%2F`.
- **Error "replica set name does not match"?** In Atlas: **Connect** → **Drivers** and look for a **Standard** connection string — it shows the correct `replicaSet=` value. Replace `atlas-2t5iq-shard-0` in the URI with that.
- Restart the app. Same cluster = same data; no need to copy users.

## Use the same cluster (no data copy)

1. Open **MongoDB Atlas** → your project → **Database** → **Connect** for your cluster.
2. Choose **Drivers** (or “Connect your application”).
3. Select **Node.js** and your driver version.
4. In the connection string:
   - If you see only **SRV**: copy it, then switch to **Standard** / **Direct** if the UI offers it.
   - Or use **“Connect using MongoDB Compass”** and check if a standard URI is shown there.
5. The **standard** format looks like:
   ```text
   mongodb://USER:PASSWORD@cluster0-shard-00-00.2t5iq.mongodb.net:27017,cluster0-shard-00-01.2t5iq.mongodb.net:27017,cluster0-shard-00-02.2t5iq.mongodb.net:27017/DBNAME?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin
   ```
   Replace `USER`, `PASSWORD`, hostnames, `DBNAME`, and `replicaSet` with the values for **your** cluster (same one you use in Compass).

6. In `.env.local` add (or update):
   ```env
   # Standard URI = same cluster as MONGODB_URL, different format (avoids SRV DNS issues).
   # Your existing users stay in place — no copy needed.
   MONGODB_STANDARD_URI=mongodb://USER:PASSWORD@cluster0-shard-00-00.XXXXX.mongodb.net:27017,...
   ```
   The app uses `MONGODB_STANDARD_URI` first if set, then `MONGODB_URL` / `MONGODB_URI`. Keep your current `MONGODB_URL` as backup; same cluster = same data.

## If you can’t find the standard URI in the UI

- In Atlas, open your cluster → **Connect** → **Connect your application**.
- Copy the **SRV** string, then in Atlas go to **Network Access** and note the cluster hostname (e.g. `cluster0.xxxxx.mongodb.net`).
- For a replica set, the standard format is:
  `mongodb://USER:PASSWORD@host1:27017,host2:27017,host3:27017/DBNAME?ssl=true&replicaSet=REPLICASET&authSource=admin`
- You can get the exact host list from Compass (after connecting with the SRV string) or from Atlas cluster view / connection dialog if it shows “Standard” or “Direct” connection details.

## Summary

| Action                         | Copy users? |
|--------------------------------|------------|
| Switch to **standard URI** for the **same** cluster | **No** — same DB, same users. |
| Create a **new** cluster and point the app there     | **Yes** — you’d need to migrate/copy data. |

Recommendation: get the **standard** connection string for your **existing** cluster and set `MONGODB_STANDARD_URI` in `.env.local`. Restart the app; your existing users stay as they are.
