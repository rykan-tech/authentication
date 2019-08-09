/**
 * Stores the Spring Data class for accessing database
 */
package com.rykan.auth.jwt.db;

import java.util.UUID;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@TypeDefs({
    @TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
})
public class UserRecord {

	@Id @Type(type = "pg-uuid")
	private UUID user_id;
	private String subscription;

	@Type(type = "jsonb")
  @Column(columnDefinition = "jsonb")
  @Basic(fetch = FetchType.LAZY)
	private Permissions permissions;
}