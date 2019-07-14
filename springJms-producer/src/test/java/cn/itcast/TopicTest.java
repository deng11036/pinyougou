package cn.itcast;

import cn.itcast.demo.QueueProducer;
import cn.itcast.demo.TopicProducer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:appicationContext-jms-producer.xml")
public class TopicTest {

    @Autowired
    private TopicProducer topicProducer;

    @Test
    public void testSend(){
        for (int i = 0; i < 10; i++) {
            topicProducer.sendTextMessage("spring---哈哈哈--queue");
        }
    }


}
