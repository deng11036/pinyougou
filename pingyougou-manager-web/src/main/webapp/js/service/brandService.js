//品牌服务层
app.service("brandService",function ($http) {

    //读取列表数据绑定表单
    this.findAll=function () {
        return $http.get("../brand/findAll.do");
    }

    //分页查询
    this.findPage=function (page,rows) {
        return $http.get("../brand/findPage.do?page="+page+"&rows="+rows);
    }
    //根据id查询
    this.findOne=function (id) {
        return $http.get("../brand/findOne.do?id="+id);
    }

    //增加
    this.add=function (entity) {
        return $http.post("../brand/add.do",entity)
    }
    //修改
    this.update=function (entity) {
        return $http.post("../brand/update.do",entity)
    }
    //删除
    this.dele=function (ids) {
        return $http.get("../brand/delete.do?ids="+ids);
    }

    //搜索
    this.search=function (page,rows,searchEntiry) {
        return $http.post("../brand/serch.do?page="+page+"&rows="+rows,searchEntiry);
    }

    //下拉列表
    this.selectOptionList=function () {
        return $http.get("../brand/selectOptionList.do");
    }
});