### Prerequisites

- Nodejs12.x+
- PostgreSQL 11
- Sequelize
- Postman

### File Structure
![](https://user-images.githubusercontent.com/19702085/119555243-43dca600-bdbb-11eb-99c5-0dd2d431d214.png)

### DB Snapshot

![](https://user-images.githubusercontent.com/19702085/119555230-3f17f200-bdbb-11eb-86d6-71cbd595e149.png)


##Application Setup

####Run the following commands.

###### Clone from repo
`$ git clone https://github.com/smartnav/crypto-todo`

###### Goto the folder
`$ cd crypto-todo`

###### Install npm dependencies
`$ npm install`

##Database Setup
- postgreSQL 11 should be installed to setup the this application.
- sequelize-cli should be installed for migrations 
`<link>` : <https://sequelize.org/master/manual/migrations.html>

###### Create table with Migrations
`$ npx sequelize-cli db:migrate` It will create table in the database.

###### Db connection

Go to `server/config/config.json` file, and change db connections.

```javascript
{
  "development": {
    "username": "postgres",  
    "password": "pg@123#",
    "database": "tododb",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  .................
```

### App Configuration
Open `.env` file from the applicatoin and configure your settings.  Currently I have added some of the fields for default sync. You can add as many as you want.



```javascript
CRYPTO_URL=https://min-api.cryptocompare.com/data/pricemultifull
FSYMS=BTC,LINK,MKR 
TSYMS=USD,EUR,ETH,LTC
CRONTIME=2
PORT=8000
```

## Start Application

Run the following command for start the application, I will run on default port 8000, but you can change it from `.env` file.

`$ npm start`

## Test with postman

Import this link to your postman and Run.

`<link>` : https://www.getpostman.com/collections/c3e99d541e625c481202

![](https://user-images.githubusercontent.com/19702085/119558870-98822000-bdbf-11eb-8760-4d291c35a401.png)

#### Direct Link
http://localhost:8000/service/price?fsyms=BTC,LINK&tsyms=USD,ETH

###Note
######I tried myself best within this timeframe but we can make it better if I get  more time.

###End