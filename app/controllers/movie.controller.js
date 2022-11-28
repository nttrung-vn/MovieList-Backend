const MovieService = require("../services/movie.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new Movie
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(404, "Name cannot be empty"));
  }

  try {
    const movieService = new MovieService(MongoDB.client);
    const document = await movieService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating the contact")
    );
  }
};

// Update a movie by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length == 0) {
    return next(new ApiError(404, "Data to update can not be empty"));
  }

  try {
    const movieService = new MovieService(MongoDB.client);
    const document = await movieService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Movie not found"));
    }
    return res.send({ message: "Movie was updated successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating movie with id=${req.params.id}`)
    );
  }
};

// Delete a movie with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const movieService = new MovieService(MongoDB.client);
    const document = await movieService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Movie not found"));
    }
    return res.send({ message: "Movie was deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Could not delete movie with id=${req.params.id}`)
    );
  }
};

// Find a single movie with an id
exports.findOne = async (req, res, next) => {
  try {
    const movieService = new MovieService(MongoDB.client);
    const document = await movieService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Movie not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving movie with id=${req.params.id}`)
    );
  }
};

// Retrieve all movies of a user from the database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const movieService = new MovieService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await movieService.findByName(name);
    } else {
      documents = await movieService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving movies.")
    );
  }

  return res.send(documents);
};
