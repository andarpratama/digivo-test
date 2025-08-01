CREATE DATABASE webhook_system;

\c webhook_system;

CREATE TABLE webhook_endpoints (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_status_changes (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE webhook_notifications (
    id SERIAL PRIMARY KEY,
    webhook_endpoint_id INTEGER NOT NULL REFERENCES webhook_endpoints(id),
    booking_status_change_id INTEGER NOT NULL REFERENCES booking_status_changes(id),
    payload_hash VARCHAR(64) NOT NULL,
    signature VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP,
    last_attempt_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhook_delivery_logs (
    id SERIAL PRIMARY KEY,
    webhook_notification_id INTEGER NOT NULL REFERENCES webhook_notifications(id),
    attempt_number INTEGER NOT NULL,
    http_status_code INTEGER,
    response_body TEXT,
    error_message TEXT,
    delivery_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_endpoints_active ON webhook_endpoints(is_active);
CREATE INDEX idx_webhook_notifications_status ON webhook_notifications(status);
CREATE INDEX idx_webhook_notifications_next_retry ON webhook_notifications(next_retry_at);
CREATE INDEX idx_booking_status_changes_booking ON booking_status_changes(booking_id);
CREATE INDEX idx_webhook_delivery_logs_notification ON webhook_delivery_logs(webhook_notification_id);

INSERT INTO webhook_endpoints (name, url, secret_key) VALUES
('Test Webhook 1', 'https://webhook.site/abc123', 'sk_test_webhook_secret_key_1'),
('Test Webhook 2', 'https://api.example.com/webhooks', 'sk_test_webhook_secret_key_2');

INSERT INTO booking_status_changes (booking_id, old_status, new_status, metadata) VALUES
(1, 'confirmed', 'paid', '{"payment_method": "credit_card", "amount": 1000000}'),
(2, 'confirmed', 'cancelled', '{"reason": "user_request", "refund_amount": 300000}'),
(3, 'pending', 'confirmed', '{"seats_confirmed": 3}'); 