
app.service('inndexService',function($http){

	this.loginName=function () {
		return $http.get('../login/name.do');
	}


});
