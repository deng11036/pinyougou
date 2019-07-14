package com.pinyougou.search.service.impl;


import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.jms.*;
import java.util.Arrays;


@Component("itemDeleteListener")
public class ItemDeleteListener implements MessageListener {

    @Autowired
    private ItemSearchService itemSearchService;
    @Override
    public void onMessage(Message message) {
        try {
            ObjectMessage objectMessage = (ObjectMessage)message;
            Long[] ids = (Long[]) objectMessage.getObject();
            System.out.println("监听到消息：  "+Arrays.asList(ids));
            itemSearchService.deleByGoodIds(Arrays.asList(ids));
            System.out.println("删除索引库");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
