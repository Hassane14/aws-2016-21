var myApp = angular.module("ShoppingListApp",[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
	console.log("Controller initialized");

	var refresh = function (){
		$http.get('/products').success(function (products){
			console.log('Data received successfully');
			$scope.productlist = products;
		});
	}

	refresh();

	$scope.addProduct = function(){
		console.log("Inserting product ...");
		$http.post('/products',$scope.product);
		refresh();
	}

	$scope.deleteProduct = function(name){
		console.log("Deleting product with "+name);
		$http.delete('/products/'+name);
		refresh();
	}

}]);
