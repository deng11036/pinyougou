 //控制层 
app.controller('inndexController' ,function($scope,inndexService){

	$scope.loginShowName=function(){
		inndexService.loginName().success(
			function(response){
				$scope.lgName=response.loginName;
			}			
		);
	}    

});	
