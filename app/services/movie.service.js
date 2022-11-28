const { ObjectId } = require("mongodb");

class MovieService {
  constructor(client) {
    this.Movie = client.db().collection("movies");
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractMovieData(payload) {
    const movie = {
      name: payload.name,
      genre: payload.genre,
      country: payload.country,
      year: payload.year,
      rating: payload.rating,
      description: payload.description,
      posterUrl: payload.posterUrl,
      trailerUrl: payload.trailerUrl,
    };
    // Remove undefined fields
    Object.keys(movie).forEach(
      (key) => movie[key] === undefined && delete movie[key]
    );
    return movie;
  }

  async create(payload) {
    const newMovie = this.extractMovieData(payload);
    const filter = {
      name: newMovie.name,
      country: newMovie.country,
      year: newMovie.year,
    };
    const result = await this.Movie.findOneAndUpdate(
      filter,
      { $set: newMovie },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractMovieData(payload);
    const result = await this.Movie.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Movie.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async findById(id) {
    return await this.Movie.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async find(filter) {
    const cursor = await this.Movie.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }
}

module.exports = MovieService;
