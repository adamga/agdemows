const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const { CosmosClient } = require('@azure/cosmos');
const userRoutes = require('./routes/user');
const cosmosConfig = require('./config/cosmos');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Session-based authentication
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

// Cosmos DB connection
const cosmosClient = new CosmosClient({
  endpoint: cosmosConfig.endpoint,
  key: cosmosConfig.key,
});

async function createDatabaseAndContainer() {
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: cosmosConfig.databaseId,
  });

  await database.containers.createIfNotExists({
    id: cosmosConfig.containerId,
  });
}

createDatabaseAndContainer().catch((error) => {
  console.error('Error creating Cosmos DB database and container:', error);
});

// Routes
app.use('/user', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
