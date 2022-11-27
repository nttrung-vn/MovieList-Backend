const { ObjectId } = require("mongodb");

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractUserData(payload) {
    const user = {
      username: payload.username,
      password: payload.password,
      token: payload.token,
    };
    // Remove undefined fields
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async createUser(payload) {
    const newUser = this.extractUserData(payload);
    const result = await this.User.findOneAndUpdate(
      newUser,
      { $set: newUser },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.User.find(filter);
    return await cursor.toArray();
  }

  async getUser(username) {
    return await this.find({
      username: { $regex: new RegExp(username), $options: "i" },
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractUserData(payload);
    const result = await this.User.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }
}

module.exports = UserService;
