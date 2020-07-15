# DUCS-DataStore
WebApp built in the COVID-19 situation for Department of Computer Science, Delhi University students to have access to study material. 

## Description
Datastore to access study material for the students of Department of Computer Science, Delhi University to gather and share course study material posted by teachers and other students subject-wise.

[Check 'DUCS-Datastore'](https://ducs-datastore.herokuapp.com/)

## Getting Started
### Built with
* Html
* CSS
* Javascript
* [Node.js](https://nodejs.org/en/) - Express Framework
* [MongoDB](https://account.mongodb.com/account/login?n=%2Fv2%2F5e8343fb691e4543801d0978&nextHash=%23metrics%2FreplicaSet%2F5e8351951b6cc014eb2fd163%2Fexplorer%2Ftest%2Fposts%2Ffind)


## Database (Tables)
USER :
 username       | password          | isAdmin
 ------------- |:-------------:| -----
 String | String | Boolean 
 
SEMESTER :
 sem       | SUBJECT  
 ------------- | -----
 String | Object ID(SUBJECT ENTITY)   
 
SUBJECT :
 name       | teacher  | code       | POST  
 ------------- | :-------------:| :-------------:| -----
 String | String | String | Object ID(POST ENTITY)  
  
POST :
 title       | content  | postdate       | AUTHOR    |  files  
 ------------- | :-------------:|:-------------:| :-------------:| -----
 String | String | Date | Object ID(USER ENTITY)  | Object ID (GridFs) 
 
