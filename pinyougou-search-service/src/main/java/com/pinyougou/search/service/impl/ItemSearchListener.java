package com.pinyougou.search.service.impl;

import com.alibaba.fastjson.JSON;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import java.util.List;
@Component("itemSearchListener")
public class ItemSearchListener implements MessageListener {

    @Autowired
    private ItemSearchService itemSearchService;
    @Override
    public void onMessage(Message message) {
        TextMessage textMessage = (TextMessage)message;
        try {
            System.out.println("监听到数据");
            String text = textMessage.getText();
            System.out.println(text);
            List<TbItem> itemList = JSON.parseArray(text, TbItem.class);
            itemSearchService.inportItemList(itemList);
            System.out.println("加入solr索引库");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
