
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.resolve(__dirname, 'ingest.log');
function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

log('--- DEBUG START ---');

try {
    const dotenv = require('dotenv');
    log('dotenv loaded');
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
    log('env config loaded');

    const { GraphDatabase } = require('neo4j-driver');
    log('neo4j-driver loaded');

    const NEO4J_URI = process.env.NEO4J_URI;
    log(`URI: ${NEO4J_URI}`);

    if (!NEO4J_URI) throw new Error('Missing NEO4J_URI');

    const driver = GraphDatabase.driver(NEO4J_URI, GraphDatabase.auth.basic(
        process.env.NEO4J_USERNAME || '',
        process.env.NEO4J_PASSWORD || ''
    ));

    (async () => {
        try {
            log('Connecting to Neo4j...');
            const info = await driver.getServerInfo();
            log(`Connected: ${info.agent}`);
            await driver.close();
            log('Driver closed. Success.');
        } catch (e) {
            log(`Neo4j Error: ${e.message}`);
        }
    })();

} catch (e) {
    log(`Top Level Error: ${e.message}`);
}
