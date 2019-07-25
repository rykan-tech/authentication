package com.rykan.auth.jwt.rabbitmq;

import java.util.concurrent.CountDownLatch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.protobuf.InvalidProtocolBufferException;
import com.rykan.protobuf.mq.general.User;

@Component
public class UserCreatedRec {

	private CountDownLatch latch = new CountDownLatch(1);
	Logger logger = LoggerFactory.getLogger(UserCreatedRec.class);

	public void receiveMessage(byte[] message) {
		logger.info("Got message from RabbitMQ for a user event.");
		logger.debug("Decoding a RabbitMQ message for user event");
		try {
			User.UserEvent event = User.UserEvent.parseFrom(message);
			logger.debug("Storing in database...");
		} catch (InvalidProtocolBufferException err) {
			logger.error("Error parsing user event: " + err.getMessage());
		}
		latch.countDown();
	}

	public CountDownLatch getLatch() {
		return latch;
	}

}