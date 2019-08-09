package com.rykan.auth.jwt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class Entry {

	public static void main(String[] args) {
		SpringApplication.run(Entry.class, args);
	}

}
