//广告内容服务层

app.service("contentService",function ($http) {

    //根据根类id查询  内容集合
    this.findByCategoryId=function (categoryId) {
       return $http.get("content/findByCategory.do?categoryId="+categoryId)
    }

})