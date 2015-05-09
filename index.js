import dispatch from 'aum-dispatch';
import location from 'aum-location';
import search from 'aum-search';

export default function (routes) {
  window.onpopstate = function () {
    var routeKey;
    var routeKeys = Object.keys(routes);
    var routeKeysLength = routeKeys.length;
    var routeParams = {};
    var currentSearch = location.search.slice(1);

    if (currentSearch === search()) {
      return;
    }

    for (var i = 0; i < routeKeysLength; i += 1) {
      routeKey = routeKeys[i];

      var matcher = new RegExp('^' + routeKey.replace(/:[^\/]+/g, '([^\\/]+)') + "\/?$");
      var matches = currentSearch.match(matcher);
      var match = matches || routeKey === currentSearch;

      if (!match) {
        continue;
      }

      if (matches) {
        var routeParamsKeys = routeKey.match(/:[^\/]+/g) || [];
        var routeParamsValues = routeParams.values = matches.slice(1);
        var routeParamsKeysLength = routeParamsKeys.length;

        for (var j = 0; j < routeParamsKeysLength; j += 1) {
          var routeParamsKey = routeParamsKeys[j].replace(/:|\./g, '');
          var routeParamsValue = routeParamsValues[j].toString();

          routeParams[routeParamsKey] = decodeURIComponent(routeParamsValue);
        }
      }

      break;
    }

    dispatch('param', routeParams);
    dispatch('search', currentSearch);
    dispatch('state', routes[routeKey]);
  };

  window.onpopstate();
}

