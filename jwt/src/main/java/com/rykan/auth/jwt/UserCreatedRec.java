package com.rykan.auth.jwt;

import java.util.concurrent.CountDownLatch;
import org.springframework.stereotype.Component;

@Component
public class UserCreatedRec {

	private CountDownLatch latch = new CountDownLatch(1);

	public void receiveMessage(byte[] message) {
		System.out.println("Received <" + message.toString() + ">");
		latch.countDown();
	}

	public CountDownLatch getLatch() {
		return latch;
	}

}