# test-sfxdx
Assessment test for "Backend Developer" vacancy

It is expected that you have a test task from SFXDX, npm, Node.js and PostgreSQL services installed and running on your machine.

To run this locally:

- clone the project
- run npm install
- create '.env' file in the root directory
- fill it with the following properties and run 'npm run start:dev':

PORT=8000

POSTGRES_HOST=localhost

POSTGRES_DB=*YOUR DATABASE NAME*

POSTGRES_USER=*YOUR DATABASE USERNAME*

POSTGRES_PASSWORD=*YOUR DATABASE PASSWORD*

POSTGRES_PORT=5432

INFURA_URL=https://goerli.infura.io/v3/*TEST_INFURA_API_KEY_HERE*

ACCOUNT=*ACCOUNT ADDRESS FROM TEST TASK*

CONTRACT_ADDRESS=*CONTRACT ADRESS FROM TEST TASK*

DEPLOYMENT_TX_HASH=*DEPLOYMENT BLOCK HASH OF THE TEST CONTRACT FROM goerli.etherscan.io*