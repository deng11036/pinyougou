package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;

import java.util.*;

@Service(timeout = 10000)
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private SolrTemplate solrTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    public Map<String, Object> search(Map searchMap) {
        Map<String,Object> map = new HashMap<>();

        //商品列表查询
        map.putAll( searchList(searchMap));


        //商品分类列表查询
        List<String> categoryList = searchCategoryList(searchMap);
        map.put("categoryList",categoryList);

        //规格和品牌列表查询
        String categoryName = (String) searchMap.get("category");
        if (!"".equals(categoryName)){//有分类
            map.putAll(searchBrandAndSpeclist(categoryName));
        }else {
            if (categoryList.size() > 0) {
                map.putAll(searchBrandAndSpeclist(categoryList.get(0)));//没有分类，按第一个分类查
            }
        }

        return map;
    }

    /**
     * 缓存数据
     * @param list
     */
    @Override
    public void inportItemList(List list) {
        solrTemplate.saveBeans(list);
        solrTemplate.commit();
    }

    @Override
    public void deleByGoodIds(List goodIds) {
        Query query = new SimpleQuery();
        Criteria criteria = new Criteria("item_goodsid").in(goodIds);
        query.addCriteria(criteria);
        solrTemplate.delete(query);
        solrTemplate.commit();

    }

    // 商品列表查询+过滤
    private Map<String, Object> searchList(Map searchMap) {
        Map map = new HashMap();

        HighlightQuery query = new SimpleHighlightQuery();
        HighlightOptions highlightOptions = new HighlightOptions().addField("item_title");
        highlightOptions.setSimplePrefix("<em style='color: red'>");//前缀
        highlightOptions.setSimplePostfix("</em>");//后缀
        query.setHighlightOptions(highlightOptions);//设置高亮选项

        String keywords = (String) searchMap.get("keywords");
        searchMap.put("keywords",keywords.replace(" ",""));

        //条件查询
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        //商品分类过滤
        if (!"".equals(searchMap.get("category"))){
            Criteria filterCriteria = new Criteria("item_category").is(searchMap.get("category"));
            FilterQuery filterQuery = new SimpleFilterQuery(filterCriteria);
            query.addFilterQuery(filterQuery);
        }
        //品牌过滤
        if (!"".equals(searchMap.get("brand"))){

            Criteria filterCriteria = new Criteria("item_brand").is(searchMap.get("brand"));
            FilterQuery filterQuery = new SimpleFilterQuery(filterCriteria);
            query.addFilterQuery(filterQuery);
        }
        //规格过滤
        if (searchMap.get("spec")!=null){
            Map<String,String> map1 = (Map<String, String>) searchMap.get("spec");
            for (String key:map1.keySet()){
                Criteria filterCriteria = new Criteria("item_spec_"+key).is(map1.get(key));
                FilterQuery filterQuery = new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }

        //价格过滤
        if (!"".equals(searchMap.get("price"))){
            String[] price = ((String)searchMap.get("price")).split("-");
            if (!price[0].equals("0")){
                Criteria filterCriteria = new Criteria("item_price").greaterThanEqual(price[0]);
                FilterQuery filterQuery = new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
            if (!price[1].equals("*")){
                Criteria filterCriteria = new Criteria("item_price").lessThanEqual(price[1]);
                FilterQuery filterQuery = new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }

        //分页
        Integer pageOn = (Integer) searchMap.get("pageOn");//当前页
        if (pageOn==null){
            pageOn=1;
        }
        Integer pageSize = (Integer) searchMap.get("pageSize");//每页显示条数
        if (pageSize==null){
            pageSize=20;
        }
        query.setOffset((pageOn-1)*pageSize);//开始索引
        query.setRows(pageSize);//每页显示条数

        //排序查询
        String sortValue = (String) searchMap.get("sort");
        String sortField = (String) searchMap.get("sortField");
        if (sortValue!=null&&!sortValue.equals("")){
            if (sortValue.equals("ASC")){
                Sort sort = new Sort(Sort.Direction.ASC,"item_"+sortField);//item_price
                query.addSort(sort);
            }
            if (sortValue.equals("DESC")){
                Sort sort = new Sort(Sort.Direction.DESC,"item_"+sortField);//item_price
                query.addSort(sort);
            }
        }


        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);//高亮页

        //高亮入口
        List<HighlightEntry<TbItem>> h = page.getHighlighted();
        //遍历高亮入口，------得到---高亮集合
        for (HighlightEntry<TbItem> entry : h) {
            List<HighlightEntry.Highlight> highlights = entry.getHighlights();
            if (highlights.size() > 0 && highlights.get(0).getSnipplets().size() > 0) {
                TbItem item = entry.getEntity();//实体
                item.setTitle(highlights.get(0).getSnipplets().get(0));
            }
        }
        map.put("rows",page.getContent());
        map.put("total",page.getTotalElements());
        map.put("totalPages",page.getTotalPages());
        return map;
    }

    //商品分类查询
    private List<String> searchCategoryList(Map searchMap){
        List<String>  list = new ArrayList<String>();

        //按条件查
        Query quals = new SimpleQuery("*:*");
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        quals.addCriteria(criteria);

        //分组选项
        GroupOptions groupOptions = new GroupOptions().addGroupByField("item_category");
        quals.setGroupOptions(groupOptions);

        //分组页
        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(quals, TbItem.class);
        //根据列得到分组结果集
        GroupResult<TbItem> item_category = page.getGroupResult("item_category");
        //分组结果入口页
        Page<GroupEntry<TbItem>> entries = item_category.getGroupEntries();
        //分组结果入口页
        List<GroupEntry<TbItem>> content = entries.getContent();

        for (GroupEntry<TbItem> entry : content) {
            list.add(entry.getGroupValue());
        }
        return list;
    }

    //商品规格和品牌列表查询
    private Map searchBrandAndSpeclist(String category){
        Map map = new HashMap();
        //得到模板id
        Long typeId = (Long) redisTemplate.boundHashOps("itemCat").get(category);
        //根据 模板id得到品牌集合
        List brandList = (List) redisTemplate.boundHashOps("brandList").get(typeId);
        map.put("brandList",brandList);
        //根据 模板id得到规格集合
        List specList = (List) redisTemplate.boundHashOps("specList").get(typeId);
        map.put("specList",specList);
        return map;
    }


}
