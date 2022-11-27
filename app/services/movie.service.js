const { ObjectId } = require("mongodb");

class MovieService {
  constructor(client) {
    this.Movie = client.db().collection("movies");
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
}

module.exports = MovieService;
