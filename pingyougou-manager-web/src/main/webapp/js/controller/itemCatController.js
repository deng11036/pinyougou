 //控制层 
app.controller('itemCatController' ,function($scope,$controller   ,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=itemCatService.update( $scope.entity ); //修改  
		}else{
			$scope.entity.parentId=$scope.parentId;
			serviceObject=itemCatService.add( $scope.entity  );//增加
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.findByParentId($scope.parentId);//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		itemCatService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.findByParentId($scope.parentId);//重新加载
					$scope.selectIds=[];
				}						
			}		
		);				
	}

	//删除前判断是否有下级目录，给出提示
	$scope.isCheckParent=function($event,id){
		itemCatService.findByParentId(id).success(
			function (response) {
				if (response!=null&&response.length>0){//有子目录
					var index = $scope.selectIds.indexOf(id);
					$scope.selectIds.splice(index,1);
					$event.target.checked=false;
					alert("当前分类有子目录，不能删除")
				}
			}
		)

	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

	//定义上级id
	$scope.parentId=0;

	//显示一级目录
	$scope.findByParentId=function (parentId) {

		$scope.parentId=parentId;     //记住上级id

		itemCatService.findByParentId(parentId).success(
			function (response) {
				$scope.list=response;
			}
		)
	}


	//定义级别
	$scope.grand=1;//初始值为1级
	$scope.setGrand=function (value) {
		$scope.grand=value;
	}

	//读取列表
	$scope.selectList=function (p_entity) {

		if ($scope.grand==1){
			$scope.entity1=null;
			$scope.entity2=null;
		}
		if ($scope.grand==2){
			$scope.entity1=p_entity;
			$scope.entity2=null;
		}
		if ($scope.grand==3){
			$scope.entity2=p_entity;
		}
		//更新数据
		$scope.findByParentId(p_entity.id);//查询此级别下级列表
	}


	//模板下拉
	$scope.templateList=[];

	$scope.findTemplateList=function () {
		typeTemplateService.findTempList().success(
			function (response) {
				$scope.templateList=response;
			}
		)
	}


	$scope.findTempOne=function (typeId) {
		typeTemplateService.findTempListOne(typeId).success(
			function (response) {
				$scope.templateList=response;
			}
		)
	}

});	
