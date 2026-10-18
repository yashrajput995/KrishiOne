package com.krishione.slotbooking;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Supplier;

/**
 * 4-Tier Resilient Locking Architecture for Extreme High-Concurrency Token Reservation:
 * Tier 1: Redisson Distributed Lock (cluster-wide distributed coordination)
 * Tier 2: Redis SETNX (atomic lock key with auto-expiring lease)
 * Tier 3: JVM In-Memory ReentrantLock (thread safety guarantee if Redis is offline)
 * Tier 4: Database SELECT ... FOR UPDATE (row-level exclusive lock in PostgreSQL)
 */
@Component
public class LockManager {

    private static final Logger log = LoggerFactory.getLogger(LockManager.class);

    @Autowired(required = false)
    private RedissonClient redissonClient;

    @Autowired(required = false)
    private StringRedisTemplate stringRedisTemplate;

    private final ConcurrentHashMap<String, ReentrantLock> localLockMap = new ConcurrentHashMap<>();

    public <T> T executeWithLock(String lockKey, long waitSeconds, long leaseSeconds, Supplier<T> task) {
        // 1. Try Redisson Distributed Lock
        if (redissonClient != null) {
            try {
                RLock lock = redissonClient.getLock("krishione:lock:" + lockKey);
                boolean acquired = lock.tryLock(waitSeconds, leaseSeconds, TimeUnit.SECONDS);
                if (acquired) {
                    try {
                        return task.get();
                    } finally {
                        if (lock.isHeldByCurrentThread()) {
                            lock.unlock();
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Redisson distributed lock failed for key {}: {}. Falling back to Redis SETNX.", lockKey, e.getMessage());
            }
        }

        // 2. Try Redis SETNX Fallback
        if (stringRedisTemplate != null) {
            String redisKey = "krishione:lock:setnx:" + lockKey;
            try {
                Boolean acquired = stringRedisTemplate.opsForValue()
                        .setIfAbsent(redisKey, "LOCKED", Duration.ofSeconds(leaseSeconds));
                if (Boolean.TRUE.equals(acquired)) {
                    try {
                        return task.get();
                    } finally {
                        stringRedisTemplate.delete(redisKey);
                    }
                }
            } catch (Exception e) {
                log.warn("Redis SETNX lock failed for key {}: {}. Falling back to JVM ReentrantLock.", lockKey, e.getMessage());
            }
        }

        // 3. Fallback to JVM In-Memory ReentrantLock
        ReentrantLock localLock = localLockMap.computeIfAbsent(lockKey, k -> new ReentrantLock(true));
        boolean localAcquired = false;
        try {
            localAcquired = localLock.tryLock(waitSeconds, TimeUnit.SECONDS);
            if (localAcquired) {
                return task.get();
            } else {
                throw new RuntimeException("High concurrency contention: unable to acquire lock for key " + lockKey);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Lock acquisition interrupted for key " + lockKey, e);
        } finally {
            if (localAcquired) {
                localLock.unlock();
            }
        }
    }
}
