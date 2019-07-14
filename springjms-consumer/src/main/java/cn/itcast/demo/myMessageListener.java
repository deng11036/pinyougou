package cn.itcast.demo;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

public class myMessageListener implements MessageListener {

    public void onMessage(Message message) {
       TextMessage textMessage = (TextMessage)message;
        try {
            System.out.println("接收的消息是：  "+textMessage.getText());
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
