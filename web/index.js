    var mysfitsApiEndpoint = 'http://garybb2.mylabserver.com:8080'; // example: 'http://mythi-publi-abcd12345-01234567890123.elb.us-east-1.amazonaws.com'

    var app = angular.module('mysfitsApp', []);

    var gridScope;

    var filterScope;

    app.controller('clearFilterController', function($scope) {
    });

    app.controller('mysfitsFilterController', function($scope) {

      filterScope = $scope;

      // The possible options for Mysfits to populate the dropdown filters.
      $scope.filterOptionsList =
       {
         "categories": [
           {
             "title": "Good/Evil",
             "selections":  [
               "Good",
               "Neutral",
               "Evil"
             ]
           },
           {
             "title": "Lawful/Chaotic",
             "selections":  [
               "Lawful",
               "Neutral",
               "Chaotic"
             ]
           }
         ]
       };

       /*
          The View All button has been selected, retrieve all the mysfits.
      */
       $scope.removeFilter = function() {
         allMysfits = getAllMysfits(applyGridScope);
       }

       /*
         This API hasn't been implemented on the service backend yet.
       */
       $scope.queryMysfits = function(filterCategory, filterValue) {

           var filterCategoryQS = "";
           if (filterCategory==="Good/Evil") {
             filterCategoryQS = "GoodEvil";
           } else {
             filterCategoryQS = "LawChaos"
           }
           var mysfitsApi = mysfitsApiEndpoint + '/mysfits?' + 'filter=' + filterCategoryQS + "&value=" + filterValue;

           $.ajax({
             url : mysfitsApi,
             type : 'GET',
           })
           .done(function(response) {
               applyGridScope(response.json())
             })
           .done(function(data) {
               applyGridScope(data.mysfits)
             })
           .fail(function(response) {
               let error = "Could Not Process the Operation";
               swal("Oops!", `Something went wrong! ${error}`, "error");
               console.log("Could Not Retrieve Mysfit List");
               console.log(response.message);
             });
       }



    });

    /*
      Populate the main mysfit grid on page load.
    */
    app.controller('mysfitsListController', function($scope) {

      gridScope = $scope;

      getAllMysfits(applyGridScope);

    });

    /*
      Reload the grid of mysfits whenever a new list is retrieved based
      on the filters selected.
    */
    function applyGridScope(mysfitsList) {
      gridScope.mysfits = mysfitsList;
      gridScope.$apply();
    }

    /*
      Retrieve the full list of mysfits from the backend service API.
    */
    function getAllMysfits(callback) {

      var mysfitsApi = mysfitsApiEndpoint + '/mysfits';

      $.ajax({
        url : mysfitsApi,
        type : 'GET',
      })
      .done(function(response) {
          callback(response.mysfits);
        })
      .fail (function(response) {
          let error = "Could Not Retrieve Mysfits List";
          swal("Oops!", `Something went wrong! ${error}`, "error");
          console.log(error);
          console.log(response.message);
        })
    }

    function imageTriggerEffect(){
    $( ".image-trigger-effect" ).fadeToggle( "slow", "linear" );
    $( ".image-toggle" ).fadeToggle("fast");
    let audio = $("#audioID")[0];
    audio.play();
  }; 