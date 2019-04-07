module.exports = function Counts (Model) {
  'use strict';

  Model.afterRemote('findById', injectCounts);
  Model.afterRemote('findOne', injectCounts);
  Model.afterRemote('find', injectCounts);

  function injectCounts (ctx, unused, next) {
    var relations = extractRelationCounts(ctx);
    var resources = ctx.result;
    var countsWhere = extractRelationCountsWhere(ctx);
    var countsAs = extractRelationCountsAs(ctx);

    if (!Array.isArray(resources)) resources = [resources];
    if (!relations.length || !resources.length) {
      return next();
    }

    fillCounts(relations, resources, countsWhere, countsAs).then(function () {
      return next();
    }, function () {
      return next();
    });
  }

  function extractRelationCounts (ctx) {
    var filter;
    if (!ctx.args || !ctx.args.filter) return [];
    if (typeof ctx.args.filter === 'string') {
      filter = JSON.parse(ctx.args.filter);
    } else {
      filter = ctx.args.filter;
    }
    var relations = filter && filter.counts;
    if (!Array.isArray(relations)) relations = [relations];
    return relations.filter(function (relation) {
      return Model.relations[relation] && Model.relations[relation].type.startsWith('has');
    });
  }

  function extractRelationCountsWhere (ctx) {
    var filter;
    if (!ctx.args || !ctx.args.filter) return [];
    if (typeof ctx.args.filter === 'string') {
      filter = JSON.parse(ctx.args.filter);
    } else {
      filter = ctx.args.filter;
    }
    var countsWhere = filter && filter.countsWhere;
    if (!Array.isArray(countsWhere)) countsWhere = [countsWhere];
    return countsWhere;
  }

  function extractRelationCountsAs (ctx) {
    var filter;
    if (!ctx.args || !ctx.args.filter) return [];
    if (typeof ctx.args.filter === 'string') {
      filter = JSON.parse(ctx.args.filter);
    } else {
      filter = ctx.args.filter;
    }
    var countsAs = filter && filter.countsAs;
    if (!Array.isArray(countsAs)) countsAs = [countsAs];
    return countsAs;
  }

  function fillCounts (relations, resources, countsWhere, countsAs) {
    return Promise.all(resources.map(function (resource) {
      return Promise.all(relations.map(function (relation, i) {
        return resource[relation].count(countsWhere && countsWhere[i] || {}).then(function (count) {
          resource[countsAs && countsAs[i] ? countsAs[i] : relation + 'Count'] = count;
        });
      }));
    }));
  }
};
