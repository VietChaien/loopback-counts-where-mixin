module.exports = function mixin (app) {
  app.loopback.modelBuilder.mixins.define('CountsWhere', require('./counts'));
};
