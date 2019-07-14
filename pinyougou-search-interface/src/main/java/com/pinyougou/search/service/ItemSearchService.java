package com.pinyougou.search.service;

import java.util.List;
import java.util.Map;

public interface ItemSearchService {

    /**
     * 搜索
     * @param searchMap
     * @return
     */
    public Map<String,Object> search(Map searchMap);

    /**
     * 集合存入缓存
     * @param list
     */
    public void inportItemList(List list);

    /**
     * 删除solr数据
     * @param goodIds
     */
    public void deleByGoodIds(List goodIds);
}
