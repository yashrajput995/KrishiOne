package com.krishione.common;

import org.springframework.http.HttpStatus;

public class KrishiException extends RuntimeException {
    private final HttpStatus status;

    public KrishiException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public KrishiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
