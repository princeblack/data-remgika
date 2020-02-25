const Order = require('../models/Group');
const createError = require('http-errors');

exports.getAllGroup = async (req, res, next) => {
  // An Admin should get everybody's orders , a user only theirs
  try {
    const orders = await Order.find().populate('records.record', ' -__v');
    res.status(200).send(orders);
  } catch (e) {
    next(e);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', ' firstName lastName');
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

exports.updateGroup = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!order) throw new createError.NotFound();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};

exports.addGroup = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    next(e);
  }
};
