const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const uploadCloud = require('../config/cloudinary.js');


const login = (req, user) => {
  return new Promise((resolve, reject) => {
    req.login(user, err => {
      console.log('req.login ')
      console.log(user)


      if (err) {
        reject(new Error('Something went wrong'))
      } else {
        resolve(user);
      }
    })
  })
}

// SIGNUP
router.post('/signup', (req, res, next) => {

  const { username, password, email, isArtist } = req.body;

  // Check for non empty user or password
  if (!username || !password || !email) {
    next(new Error('You must provide valid credentials'));
  }

  // Check if user exists in DB
  User.findOne({ username })
    .then(foundUser => {
      if (foundUser) throw new Error('Username already exists');

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      return new User({
        username,
        email,
        password: hashPass,
        isArtist
      }).save();
    })
    .then(savedUser => login(req, savedUser)) // Login the user using passport
    .then(user => res.json({ status: 'signup & login successfully', user })) // Answer JSON
    .catch(e => next(e));
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {

    // Check for errors
    if (err) next(new Error('Something went wrong'));
    if (!theUser) next(failureDetails)

    // Return user and logged in
    login(req, theUser).then(user => res.status(200).json(req.user));

  })(req, res, next);
});


router.get('/currentuser', (req, res, next) => {
  console.log(req.user)
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    next(new Error('Not logged in'))
  }
})


router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'logged out' })
});



//AÑADIR VIDEOS A LISTA

router.post("/newVideo", (req, res, next) => {
 // const url = req.body.url;
 const url = "https://www.youtube.com/embed/" + req.body.url.split("=")[1]
  User.findByIdAndUpdate(req.user._id, { $push: { addVideo: url } }, { new: true })
    .then(user => res.status(200).json({ videos: user.addVideo }))
    .catch(err => {
      console.log(err)
    })
})


router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
})


//AÑADIR FOTOS A LISTA

router.post('/first-user/pictures/listPhoto', uploadCloud.single('addPhoto'), (req, res, next) => {
  let id = req.user._id 
  User.findByIdAndUpdate(id, { $push: { addPhoto: req.file.url } }, { new: true })
  .then(() => 
  {
    res.json({
      success: true,
      addPhoto: req.file.url
     })
 })

//  router.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
})


// router.post('/first-user/pictures/edit', uploadCloud.single('PicProfilePath'), (req, res, next) => {
//   console.log("entraaaaaa");
//   console.log(req.user._id);
//   console.log(req.file.url);
//   let id = req.user._id
//   User.findByIdAndUpdate(id, { PicProfilePath: req.file.url })
//   // console.log(user)
//     .then(() => 
//     {
//       res.json({
//         success: true,
//         addPhoto: req.file.url
//       })
//     })
// });



module.exports = router;