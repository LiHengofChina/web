var app = angular.module('myApp', []);
app.controller('personCtrl', function($scope) {
		$scope.firstName = "John";
		$scope.lastName = "Doe";
		 
		
		$scope.quantity = 1;
		$scope.price = 9.99;
		
		$scope.names = [
			{name:'Jani',country:'Norway'},
			{name:'Hege',country:'Sweden'},
			{name:'Kai',country:'Denmark'}
		];	
		
		 $scope.msg = "Runoob";
		
});


//===========自定义过滤器
app.filter('reverse', function() { //可以注入依赖
    return function(text) {
        return text.split("").reverse().join("");
    }
});


