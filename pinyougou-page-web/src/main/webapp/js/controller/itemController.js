//商品详细页控制层
app.controller('itemController',function($scope,$http){
	
	//商品增加方法
	$scope.addNum=function(x){
		$scope.num+=x;
		if($scope.num<1){
			$scope.num=1;
		}
	}
	
	//用户选中
	$scope.specificationItems={};
	
	//用户选中
	$scope.selectSpecification=function(key,value){
		$scope.specificationItems[key]=value;
		searchSku();//选择后读取sku
	}
	
	
	//判断用户是否选中
	$scope.isSelectSpecifition=function(key,value){
		if($scope.specificationItems[key]==value){
			return true;
		}else{
			return false;
		}
	}
	
	
	//显示默认
	$scope.loadSku=function(){
		$scope.sku=skuList[0];
		$scope.specificationItems=JSON.parse(JSON.stringify($scope.sku.spec));//将默认规格深克隆后赋值给---用户选中
	}
	
	
	//匹配俩个map集合是否相等
	matchObject=function(map1,map2){
		//循环map集合比较
		for(var key in map1){
			if(map1[key]!=map2[key]){
				return false;
			}
		}
		
		for(var key in map2){
			if(map2[key]!=map1[key]){
				return false;
			}
		}
		return true;
	}
	
	//在skuList中查询用户选择的sku
	searchSku=function(){
		//根据用户选择的spec，遍历skuList与sku匹配，成功将spuList[i]赋值给sku
		for(var i =0;i<skuList.length;i++){
			if(matchObject(skuList[i].spec,$scope.specificationItems)){
				$scope.sku=skuList[i];
				return;
			}
		}
		//选择的都不匹配，造一个
		$scope.sku={'id':1,'price':0,'title':'======='}	
	}
	
	//添加商品购物车
	$scope.addToCart=function(){
		$http.get('http://localhost:9107/cart/addGoodsToCartList.do?itemId='+$scope.sku.id+'&num='+$scope.num,{'withCredentials':true}).success(
			function (response) {
				if (response.success){
					location.href='http://localhost:9107/cart.html'
				} else {
					alert(response.message)
				}
			}
		)
	}
	
	
	
	
	
});