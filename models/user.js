const { CosmosClient } = require('@azure/cosmos');
const cosmosConfig = require('../config/cosmos');

const cosmosClient = new CosmosClient({
  endpoint: cosmosConfig.endpoint,
  key: cosmosConfig.key,
});

const database = cosmosClient.database(cosmosConfig.databaseId);
const container = database.container(cosmosConfig.containerId);

class User {
  constructor(username, email, firstName, lastName, dateOfBirth, address, phoneNumber, profilePictureUrl, bio, flightExperienceLevel, preferredAircraft, favoriteDestinations, membershipStatus, dateOfAccountCreation, lastLoginDate) {
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.profilePictureUrl = profilePictureUrl;
    this.bio = bio;
    this.flightExperienceLevel = flightExperienceLevel;
    this.preferredAircraft = preferredAircraft;
    this.favoriteDestinations = favoriteDestinations;
    this.membershipStatus = membershipStatus;
    this.dateOfAccountCreation = dateOfAccountCreation;
    this.lastLoginDate = lastLoginDate;
  }

  static async getUserByUsername(username) {
    const { resource: user } = await container.item(username, username).read();
    return user;
  }

  static async createUser(user) {
    const { resource: createdUser } = await container.items.create(user);
    return createdUser;
  }

  static async updateUser(user) {
    const { resource: updatedUser } = await container.item(user.username, user.username).replace(user);
    return updatedUser;
  }

  static async deleteUser(username) {
    const { resource: result } = await container.item(username, username).delete();
    return result;
  }
}

module.exports = User;
