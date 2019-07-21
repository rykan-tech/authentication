package com.rykan.auth.jwt.rabbitmq;

import java.util.concurrent.CountDownLatch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class UserCreatedRec {

	private CountDownLatch latch = new CountDownLatch(1);
	Logger logger = LoggerFactory.getLogger(UserCreatedRec.class);

	public void receiveMessage(byte[] message) {
		logger.info("Got message from RabbitMQ to add user to database");
		latch.countDown();
	}

	public CountDownLatch getLatch() {
		return latch;
	}

}