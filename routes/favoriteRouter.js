const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.sendStatus(200))
    //*Checked
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {

        Favorite.find({ user: req.user._id })
            .populate('favorite.user')
            .populate('favorite.campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })
    //*Checked
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        //Find one result 
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(fav => {
                        if (!favorite.campsites.includes(fav._id)) {
                            favorite.campsites.push(fav._id);
                        } else {
                            console.log("no entry")
                        }
                    });
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
                //Can't find it create it in the database
                else {
                    Favorite.create({ user: req.user._id })
                        .then(favorite => {
                            req.body.forEach(fav => {
                                if (!favorite.campsites.includes(fav._id)) {
                                    favorite.campsites.push(fav._id);
                                } else {
                                    console.log("no entry")
                                }

                            })
                            favorite.save()
                                .then(favorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch(err => next(err));
                        })
                        .catch(err => next(err));
                }
            }).catch(err => next(err));
    })
    //*Checked
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    //*Checked
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                res.statusCode = 200;
                if (favorite) {
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete.");
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.sendStatus(200))
    //*Checked
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation on Campsite ID favorites not supported!');
    })
    //*Checked
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                        //Save it
                        favorite.save()
                            //Send status code
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(error))
                    }
                    else {
                        res.statudCodde = 403;
                        res.end('That Campsie is already in the list of favorites!');
                    }
                }
                //Create it with the user ID
                else {
                    Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
                        .then(favorite => {

                            res.statudCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites);
                        })
                        .catch(err => next(err))
                }
            })
            .catch(err => next(err))
    })
    //*Checked
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites:campsiteID');
    })
    //CHECKED
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        //Check if one exists
        Favorite.findOne({ user: req.user._id })
            //If it does
            .then(favorite => {
                if (favorite) {
                    const index = favorite.campsites.indexOf(req.params.campsiteId);
                    if (index >= 0) {
                        favorite.campsites.splice(index, 1);
                    }
                    favorite.save()
                        .then(favorite => {
                            console.log(`Favorite Campsite was deleted. ${favorite}`);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err))
                }
                else {
                    res.statusCode = 403;

                }
            })
            .catch((err) => next(err));
    });


module.exports = favoriteRouter;