🎵 Vinyl Vault API (Node/Express)A RESTful API built to support the Vinyl Vault Client application. This server handles data persistence (MongoDB) and manages user authentication (JWT).TechnologiesNode.js (v18+)Express.jsMongoDB (via Mongoose)JSON Web Tokens (JWT) for authenticationbcrypt for password hashingSetup and InstallationPrerequisitesMongoDB instance (local or Atlas)Node.js (v18+)npm or yarn1. InstallationClone the repository and install dependencies:git clone <your-server-repo-url> vinyl-vault-api
cd vinyl-vault-api
npm install
# or
yarn install
2. Environment ConfigurationCreate a file named .env in the root directory of the server folder. This file is crucial for connecting to the database and securing user data.# MongoDB Connection String (Replace with your own connection string)
MONGODB_URI="mongodb://localhost:27017/vinylvault"

# Secret key used to sign and verify JSON Web Tokens (JWT)
# MUST be a long, random, and secret string.
JWT_SECRET="YOUR_SUPER_SECRET_KEY_HERE"
3. Running the ServerStart the Node.js server:npm start
# or
yarn start
The server will start and listen on port 3000, and you should see a confirmation message in the console:Connected to MongoDB vinylvault.
The express part is ready!
API EndpointsAll endpoints are prefixed with the base path (e.g., http://localhost:3000).PathMethodDescriptionAuthentication/auth/sign-upPOSTRegisters a new user and returns a JWT.None/auth/sign-inPOSTAuthenticates a user and returns a JWT.None/albumsGETRetrieves all albums for the authenticated user.Required/albumsPOSTCreates a new album entry.Required/albums/:idGETRetrieves a specific album by ID.Required/albums/:idPUTUpdates a specific album by ID.Required/albums/:idDELETEDeletes a specific album by ID.Required