package com.rykan.auth.jwt.db;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

public interface UserRecordsDAO extends CrudRepository<UserRecord, UUID> {}