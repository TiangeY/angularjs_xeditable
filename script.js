var app = angular.module("myApp", ["xeditable", "ngMockE2E"]);

app.controller('myCtrl', function($scope, $filter, $http) {
	$scope.todolists = [
		{id: 1, importance: 4, what: "STUDY", time: 3, timeHour: '3 hr'},
		{id: 2, importance: 1, what: "BE AWESOME", time: null},
		{id: 3, importance: 3, what: "RELAX", time: 1, timeHour: '1 hrs'},
		{id: 4, importance: 2, what: "GYM", time: 2, timeHour: '2 hrs'}
	];

	// add todolist
	$scope.addTodolist = function() {
		$scope.inserted = {
		  id: $scope.todolists.length + 1,
		  importance: null,
		  what: "",
		  time: null
		};
		$scope.todolists.push($scope.inserted);
	};
	
	$scope.current = {};
	$scope.add = function(current) {
		$scope.current.id = $scope.todolists.length + 1;
		$scope.current.time = 1;
		var selected = $filter('filter')($scope.times, {id: current.time});
		$scope.current.timeHour = (selected.length ? selected[0].text : 'Not set');	
		$scope.todolists.push($scope.current);
		$scope.current = {};
	};

	$scope.sortField = 'importance';
	$scope.reverse = true;

	$scope.importances = [
		{value: 1, text: 'Very important'},
		{value: 2, text: 'Important'},
		{value: 3, text: 'Average'},
		{value: 4, text: 'Not very'}
	]; 

	$scope.times = [];
	$scope.loadTimes = function() {
	return $scope.times.length ? null : $http.get('/times').success(function(data) {
	  $scope.times = data;
	});
	};

	$scope.showImportance = function(todolist) {
	var selected = [];
	if(todolist.importance) {
	  selected = $filter('filter')($scope.importances, {value: todolist.importance});
	}
	return selected.length ? selected[0].text : 'Not set';
	};

	$scope.showTime = function(todolist) {
	if(todolist.time && $scope.times.length) {
	  var selected = $filter('filter')($scope.times, {id: todolist.time});
	  return selected.length ? selected[0].text : 'Not set';
	} else {
	  return todolist.timeHour || 'Not set';
	}
	};

	$scope.saveTodolist = function(data, id) {
	//$scope.todolist not updated yet
	angular.extend(data, {id: id});
	return $http.post('/saveTodolist', data);
	};

	// remove todolist
	$scope.removeTodolist = function(index) {
	$scope.todolists.splice(index, 1);
	};
});

// --------------- mock $http requests ----------------------
app.run(function($httpBackend) {
  $httpBackend.whenGET('/times').respond([
    {id: 1, text: '1 hr'},
    {id: 2, text: '2 hrs'},
    {id: 3, text: '3 hrs'},
    {id: 4, text: '4 hrs'},
    {id: 5, text: '5 hrs'},
    {id: 6, text: '6 hrs'},
    {id: 7, text: '7 hrs'},
    {id: 8, text: '8 hrs'},
    {id: 9, text: '9 hrs'}
  ]);
    
  $httpBackend.whenPOST(/\/saveTodolist/).respond(function(method, url, data) {
    data = angular.fromJson(data);
    return [200, {status: 'ok'}];
  });
});