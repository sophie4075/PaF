package com.example.Rentify.repo;

import com.example.Rentify.entity.MagicToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface MagicTokenRepo extends JpaRepository<MagicToken, Long> {
    Optional<MagicToken> findByToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM MagicToken t WHERE t.created < :threshold")
    void deleteExpired(@Param("threshold") Instant threshold);
}

