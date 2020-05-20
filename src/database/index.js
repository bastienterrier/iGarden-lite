const mongoose = require("mongoose");

// const Cat = mongoose.model("Cat", { name: String });

// const kitty = new Cat({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));

const PassageSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  subject: String,
});

const PassageModel = mongoose.model("passage", PassageSchema);

class Database {
  static connection(connectionString) {
    return mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  static addPassage(subject) {
    return new PassageModel({ subject }).save();
  }

  static getAllPassage(subject) {
    return PassageModel.find({ subject }, "-_id -__v").sort({ date: -1 });
  }
}

module.exports = Database;
