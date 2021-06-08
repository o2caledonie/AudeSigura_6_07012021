# AudeSigura_6_07012021

### Presentation ###
So Pekocko is a food review app where users can add their favourite spicy sauces and rate by liking or disliking the sauces from other users.

The front end part was already built and the original repository is available here : https://github.com/OpenClassrooms-Student-Center/dwj-projet6.

This project contains the back end development of the So Pekocko app where the REST API was built.

In terms of security, several packages are used to comply with the OWASP and RGPD standards : 
bcrypt : to hash and salt a password
jsonwebtoken : to ensure secure authentification on all requests
mongoose-unique-validator : to ensure an email address' uniqueness and to return errors
dotenv : to store and secure database credentials
crypto-js : to protect users' email addresses, to comply with the RGPD rules

### Techs ###
Serveur: NodeJS	with framework Express
Database: MongoDB with plugin Mongoose
Javascript

### Prerequisites ###

You will need to have SASS, Node and `npm` installed locally on your machine.

### Installation ###

Clone this repo. 

From within the "front" directory:

1) run `npm install`
2) run `npm install -g sass` to install SASS.
3) run `ng serve`. The server should run on `localhost` with default port `4200`. 
4) go to your web browser and type the following address : http://localhost:4200 

From within the "back" directory:

1) run `npm install`
2) run `npm install -g nodemon` to install SASS.
3) run `nodemon server`. The server should listen on port 3000.