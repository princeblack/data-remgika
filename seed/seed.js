const mongoose = require('mongoose');
const faker = require('faker');
const User = require('../models/User');
const Playground = require('../models/Playground');
const Order = require('../models/Order');

(async function() {
  /** CONNECT TO MONGO */
  mongoose.connect('mongodb://localhost:27017/data-remgika', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on(
    'error',
    console.error.bind(console, 'connection error:')
  );

  mongoose.connection.on('open', () => {
    console.log(`Connected to the database...`);
  });

  console.log(`First, i will delete all the old users`);

  /** DELETE ALL USERS */
  try {
    await User.deleteMany({});
    console.log('Old users moved to a better place. Spandau');
  } catch (e) {
    console.log(e);
  }

  /** DELETE ALL PlaygroundS */
  try {
    await Playground.deleteMany({});
    console.log('Old Playgrounds moved to a better place. Spandau');
  } catch (e) {
    console.log(e);
  }

  /** DELETE ALL ORDERS */
  try {
    await Order.deleteMany({});
    console.log('Old orders moved to a better place. Spandau');
  } catch (e) {
    console.log(e);
  }
  console.log(`I am creating 20 fake users`);

  /** CREATE 20 FAKE USERS */
  const userPromises = Array(20)
    .fill(null)
    .map(() => {
      const user = new User({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        birthday: faker.date.past(),
        userName: faker.internet.userName(),
        role: faker.random.arrayElement(['Admin', 'User']),
        address: {
          city: faker.address.city(),
          street: faker.address.streetName()
        }
      });

      const token = user.generateAuthToken();
      return user.save();
    });

  try {
    await Promise.all(userPromises);
    console.log('Users stored in the database!');
  } catch (e) {
    console.log(e);
  }

  console.log(`I am creating 20 fake Playgrounds`);

  /** CREATE 20 FAKE PlaygroundS */
  const playgroundPromises = Array(20)
    .fill(null)
    .map(() => {
      const playground = new Playground({
        imageUrl:faker.image.imageUrl(),
        title: faker.random.words(),
        address: {
          city: faker.address.city(),
          street: faker.address.streetName()
        },
        description: faker.lorem.paragraphs()
      });

      return playground.save();
    });

  try {
    await Promise.all(playgroundPromises);
    console.log('Playgrounds stored in the database!');
  } catch (e) {
    console.log(e);
  }

  mongoose.connection.close();
})();