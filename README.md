# agdemows

## MySimFlights User Profile Update Application

This is a Node.js web application that allows users of MySimFlights to update their user profiles. The user profiles are stored in a Cosmos DB database.

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Azure Cosmos DB account
- Redis server (for session storage)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/adamga/agdemows.git
cd agdemows
```

2. Install the dependencies:

```bash
npm install
```

3. Configure the Cosmos DB connection:

Update the `config/cosmos.js` file with the following content:

```javascript
module.exports = {
  endpoint: "YOUR_COSMOS_DB_ENDPOINT",
  key: "YOUR_COSMOS_DB_PRIMARY_KEY",
  databaseId: "MySimFlightsDB",
  containerId: "UserProfiles",
};
```

4. Configure the Redis connection:

Create a `.env` file with the following content:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
SESSION_SECRET=your_session_secret
```

### Running the Application

1. Start the Redis server:

```bash
redis-server
```

2. Start the application:

```bash
npm start
```

The application will be running at `http://localhost:3000`.

### Updating User Profiles

1. Open your web browser and navigate to `http://localhost:3000/profile`.

2. Log in with your credentials.

3. Update your profile information using the provided form. The form includes the following fields:

- Username
- Email
- First name
- Last name
- Date of birth
- Address
- Phone number
- Profile picture URL
- Bio
- Flight experience level
- Preferred aircraft
- Favorite destinations
- Membership status (e.g., free, premium)
- Date of account creation
- Last login date

4. Click the "Save" button to update your profile.

5. If the update is successful, a success message will be displayed. If there are any validation errors, appropriate error messages will be shown.

### Session-Based Authentication

The application uses session-based authentication to handle user authentication. When a user logs in, a session is created and the session ID is stored in a cookie. The client includes the session ID cookie in subsequent requests, and the server verifies the session ID to authenticate the user.

### Secure Session Storage

User session data is stored securely using Redis. The session ID is stored in a secure, HttpOnly cookie to prevent client-side access. HTTPS is used to encrypt the data transmitted between the client and the server. Session expiration and idle timeouts are implemented to limit the duration of a session and reduce the risk of session hijacking.

### Cosmos DB Configuration

The application uses the `@azure/cosmos` package to interact with Cosmos DB. The connection details are stored in the `config/cosmos.js` file. The application performs CRUD operations on the user profiles collection in the Cosmos DB database.
