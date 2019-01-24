//
require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');

function spotifyThis(trackQuery) {
    // Bring In Spotify node tools
    var spotify = new Spotify(keys.spotify);

    // use spotify npm tools to search api for track
    spotify.search({ type: 'track', query: trackQuery }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songData = data.tracks.items[0];

        // Format Track Data to send to command terminal
        var showData = [
            "Song: " + songData.name,
            "Album: " + songData.album.name,
            "Artist: " + songData.artists[0].name,
            "Release Date: " + songData.album.release_date,
            "Preview: " + songData.preview_url
        ].join("\n");

        // Log Track Data in Terminal
        console.log(showData);
    });
};

function concertThis(artistQuery) {
    //URL for bandsintown
    var queryURL = "https://rest.bandsintown.com/artists/" + artistQuery + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        //parse XML to JSON
        var concertInfo = JSON.parse(body);
        //console log results
        concertInfo.forEach(function (event) {
            console.log(`\nVenue: ${event.venue.name} \nLocation: ${event.venue.city + ", " + event.venue.country} \nShow Date: ${moment(event.datetime).format("MM-DD-YYYY")}`)
        })
    });
}

function movieThis(movieQuery) {
    var movieURL = "http://www.omdbapi.com/?t=" + movieQuery + "&plot=short&apikey=2068d24d";

    request(movieURL, function (error, response, body) {

        var movieData = JSON.parse(body);

        var rottenRating = "";

        if (movieData.Ratings[1]) {
            rottenRating = movieData.Ratings[1].Value;
        } else {
            rottenRating = "N/A";
        }

        var showMovieData = [
            "Title: " + movieData.Title,
            "Release Year: " + movieData.Year,
            "IMDB Rating: " + movieData.imdbRating,
            "Rotten Tomatoes Rating: " + rottenRating,
            "Produced in: " + movieData.Country,
            "Language: " + movieData.Language,
            "Plot: " + movieData.Plot,
            "Actors: " + movieData.Actors
        ].join("\n");
        console.log(showMovieData);
    });
};

function liriSearch() {
    if (process.argv[2] === 'spotifyThis') {
        queryParam = process.argv.slice(3).join("+");
        spotifyThis(queryParam);
    } else if (process.argv[2] === 'concertThis') {
        queryParam = process.argv.slice(3).join("+");
        concertThis(queryParam);
    } else if (process.argv[2] === 'movieThis') {
        queryParam = process.argv.slice(3).join("+");
        movieThis(queryParam);
    };
};

liriSearch();