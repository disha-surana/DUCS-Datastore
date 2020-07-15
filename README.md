# DUCS-Datastore
Node.js webApp using mongoDb

#### A webApp where all study material for the students of Department of Computer Science, Delhi University can be found. <br/>[Click here to visit 'DUCS-Datastore'](https://ducs-datastore.herokuapp.com/)


## Install following node modules
### dependencies :

    "body-parser": "^1.19.0",
    "connect-flash": "^0.1.1",
    "ejs": "^3.0.1",
    "express": "^4.17.1",
    "express-sanitizer": "^1.0.5",
    "express-session": "^1.17.0",
    "gridfs-stream": "^1.1.1",
    "method-override": "^3.0.0",
    "mongoose": "^5.9.6",
    "multer": "^1.4.2",
    "multer-gridfs-storage": "^4.0.2",
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^6.0.1"
  

# DUCS-DataStore
WebApp built in the COVID-19 situation for Department of Computer Science, Delhi University students to have access to study material. 

## Description
Datastore to access study material for the students of Department of Computer Science, Delhi University to gather and share course study material posted by teachers and other students subject-wise.

[Click here to visit 'DUCS-Datastore'](https://ducs-datastore.herokuapp.com/)

## Getting Started
### Built with
* Html
* CSS
* Javascript
* [Node.js](https://nodejs.org/en/) - Express Framework
* [MongoDB](https://account.mongodb.com/account/login?n=%2Fv2%2F5e8343fb691e4543801d0978&nextHash=%23metrics%2FreplicaSet%2F5e8351951b6cc014eb2fd163%2Fexplorer%2Ftest%2Fposts%2Ffind)

### Prerequisites
1. Node.js
2. [mongoDB live Account](https://account.mongodb.com/account/login?n=%2Fv2%2F5e8343fb691e4543801d0978&nextHash=%23metrics%2FreplicaSet%2F5e8351951b6cc014eb2fd163%2Fexplorer%2Ftest%2Fposts%2Ffind)
3. [VScode](https://code.visualstudio.com/)



## Database
USER TABLE:
 username       | password          | isAdmin
 ------------- |:-------------:| -----
 String | String | Boolean 
 
SEMESTER TABLE:
 sem       | SUBJECT  
 ------------- | -----
 String | Object ID(SUBJECT ENTITY)   
 
SUBJECT TABLE:
 name       | teacher  | code       | POST  
 ------------- | :-------------:| :-------------:| -----
 String | String | String | Object ID(POST ENTITY)  
  
POST TABLE:
 title       | content  | postdate       | AUTHOR    |  files  
 ------------- | :-------------:|:-------------:| :-------------:| -----
 String | String | Date | Object ID(USER ENTITY)  | Object ID (GridFs) 
 
