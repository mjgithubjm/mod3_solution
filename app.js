(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.directive('foundItems', FoundItemsDirective)
.service('MenuSearchService', MenuSearchService);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'found.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };
  return ddo;
}

function FoundItemsDirectiveController() {
  var list = this;
}

NarrowItDownController.$inject = ['$scope','MenuSearchService'];

function NarrowItDownController ($scope, MenuSearchService){
  var narrowItDown = this;
  var found = [];

  narrowItDown.find =  function (searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function (response) {
      narrowItDown.errorMessage = null;
      narrowItDown.found = response;  
    })
    .catch(function (error) {
      narrowItDown.found = [];
      narrowItDown.errorMessage = "Nothing found!";
    })
  };

  narrowItDown.removeItem = function (itemIndex) {
     narrowItDown.found.splice(itemIndex, 1);    
  };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http){
  var service = this;

   service.getMatchedMenuItems = function (searchTerm) {
       return $http({method: "GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json"),
        
      }).then(function (result) {
          // process result and only keep items that match
          var allItems = result.data.menu_items;
          var foundItems = [];
          if (searchTerm == "")
            throw new Error("no search item");
          for(var i = 0; i < allItems.length; i++){
            if (allItems[i].description.includes(searchTerm)){
              foundItems.push(allItems[i]);
            }            
          }
          if (foundItems.length == 0)
            throw new Error("nothing found");
          else
          // return processed items
            return foundItems;
          });
    };    
}

})();
