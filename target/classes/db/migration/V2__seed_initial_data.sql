-- V2__seed_initial_data.sql
-- Seed Initial Data for Mandis, Commodities, Prices, Slots, and Pre-seeded Users

-- 1. Pre-seeded Users (password: password123)
-- BCrypt for 'password123': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (id, phone, password_hash, name, role, preferred_language)
VALUES 
(1, '9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'रमेश पटेल (Ramesh Patel)', 'FARMER', 'hi'),
(2, '9876543211', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'सुरेश वर्मा (Suresh Verma - Mandi Officer)', 'MANDI_ADMIN', 'hi'),
(3, '9876543212', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dr. Arvind Sharma (Super Admin)', 'SUPER_ADMIN', 'en')
ON CONFLICT (phone) DO NOTHING;

-- 2. Mandis across Madhya Pradesh (e-Anugya network)
INSERT INTO mandis (id, name, district, state)
VALUES
(1, 'इंदौर छावनी कृषि उपज मंडी (Indore Chhawani Mandi)', 'Indore', 'Madhya Pradesh'),
(2, 'उज्जैन चिमनगंज मंडी (Ujjain Chimanganj Mandi)', 'Ujjain', 'Madhya Pradesh'),
(3, 'भोपाल करोंद मंडी (Bhopal Karond Mandi)', 'Bhopal', 'Madhya Pradesh'),
(4, 'विदिशा कृषि मंडी (Vidisha Krishi Mandi)', 'Vidisha', 'Madhya Pradesh'),
(5, 'सीहोर कृषि मंडी (Sehore Krishi Mandi)', 'Sehore', 'Madhya Pradesh'),
(6, 'देवास कृषि मंडी (Dewas Krishi Mandi)', 'Dewas', 'Madhya Pradesh'),
(7, 'मंदसौर कृषि मंडी (Mandsaur Krishi Mandi)', 'Mandsaur', 'Madhya Pradesh'),
(8, 'नीमच कृषि मंडी (Neemuch Krishi Mandi)', 'Neemuch', 'Madhya Pradesh'),
(9, 'जबलपुर कृषि उपज मंडी (Jabalpur Mandi)', 'Jabalpur', 'Madhya Pradesh'),
(10, 'ग्वालियर लश्कर मंडी (Gwalior Lashkar Mandi)', 'Gwalior', 'Madhya Pradesh')
ON CONFLICT (id) DO NOTHING;

-- 3. Commodities (Master Catalog)
INSERT INTO commodities (id, name, category)
VALUES
(1, 'गेहूं (Wheat - शरबती/लोकवान)', 'Grains / अनाज'),
(2, 'सोयाबीन (Soybean - पीला)', 'Oilseeds / तिलहन'),
(3, 'चना (Gram / Chana - काबुली/देशी)', 'Pulses / दलहन'),
(4, 'सरसों (Mustard / Sarson)', 'Oilseeds / तिलहन'),
(5, 'लहसुन (Garlic / Lahsun)', 'Spices / मसाले'),
(6, 'प्याज (Onion / Pyaz)', 'Vegetables / सब्जियां'),
(7, 'मक्का (Maize / Makka)', 'Grains / अनाज'),
(8, 'कपास (Cotton / Kapas)', 'Commercial / नकदी फसल'),
(9, 'मूंग (Green Gram / Moong)', 'Pulses / दलहन'),
(10, 'धान (Paddy / Dhan - बासमती)', 'Grains / अनाज')
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Market Prices (synced with e-Anugya baseline)
INSERT INTO mandi_prices (mandi_id, commodity_id, min_price, max_price, modal_price, arrival_date, source)
VALUES
-- Indore Mandi
(1, 1, 2400.00, 2750.00, 2580.00, CURRENT_DATE, 'MP_EANUGYA'),
(1, 2, 4350.00, 4880.00, 4650.00, CURRENT_DATE, 'MP_EANUGYA'),
(1, 3, 5600.00, 6250.00, 5950.00, CURRENT_DATE, 'MP_EANUGYA'),
(1, 5, 9500.00, 16800.00, 13400.00, CURRENT_DATE, 'MP_EANUGYA'),
(1, 6, 1200.00, 2100.00, 1650.00, CURRENT_DATE, 'MP_EANUGYA'),

-- Ujjain Mandi
(2, 1, 2380.00, 2680.00, 2520.00, CURRENT_DATE, 'MP_EANUGYA'),
(2, 2, 4400.00, 4920.00, 4700.00, CURRENT_DATE, 'MP_EANUGYA'),
(2, 3, 5550.00, 6150.00, 5880.00, CURRENT_DATE, 'MP_EANUGYA'),
(2, 4, 5100.00, 5750.00, 5450.00, CURRENT_DATE, 'MP_EANUGYA'),

-- Bhopal Karond Mandi
(3, 1, 2350.00, 2650.00, 2490.00, CURRENT_DATE, 'MP_EANUGYA'),
(3, 2, 4300.00, 4820.00, 4580.00, CURRENT_DATE, 'MP_EANUGYA'),
(3, 7, 1950.00, 2320.00, 2180.00, CURRENT_DATE, 'MP_EANUGYA'),

-- Vidisha Mandi
(4, 1, 2420.00, 2800.00, 2620.00, CURRENT_DATE, 'MP_EANUGYA'),
(4, 3, 5700.00, 6350.00, 6050.00, CURRENT_DATE, 'MP_EANUGYA'),

-- Mandsaur & Neemuch (Famous for Garlic & Mustard)
(7, 5, 10200.00, 18500.00, 14800.00, CURRENT_DATE, 'MP_EANUGYA'),
(8, 4, 5250.00, 5890.00, 5600.00, CURRENT_DATE, 'MP_EANUGYA'),
(8, 5, 9800.00, 17200.00, 14100.00, CURRENT_DATE, 'MP_EANUGYA')
ON CONFLICT (mandi_id, commodity_id, arrival_date) DO NOTHING;

-- 5. High-Demand Booking Slots
INSERT INTO slots (id, mandi_id, slot_type, item_name, slot_date, start_time, end_time, total_capacity, booked_count, version)
VALUES
-- Indore Fertilizer Slots
(1, 1, 'FERTILIZER', 'डीएपी खाद (DAP Fertilizer - 50kg Bags)', CURRENT_DATE, '08:00 AM', '11:00 AM', 20, 14, 0),
(2, 1, 'FERTILIZER', 'यूरिया खाद (Urea Fertilizer - 45kg Bags)', CURRENT_DATE, '11:30 AM', '02:30 PM', 15, 8, 0),
(3, 1, 'CROP_SELLING', 'गेहूं उपार्जन एवं तुलाई (Wheat Selling Slot)', CURRENT_DATE, '09:00 AM', '01:00 PM', 30, 12, 0),

-- Ujjain High-Concurrency Critical Slot (Only 1 token left for live race-condition demo!)
(4, 2, 'FERTILIZER', 'डीएपी खाद टोकन (DAP High Demand)', CURRENT_DATE, '08:30 AM', '11:30 AM', 5, 4, 0),
(5, 2, 'CROP_SELLING', 'सोयाबीन नीलामी (Soybean Auction Gate Pass)', CURRENT_DATE, '10:00 AM', '02:00 PM', 25, 10, 0),

-- Bhopal Slots
(6, 3, 'FERTILIZER', 'डीएपी खाद वितरण (DAP Token Karond)', CURRENT_DATE, '09:00 AM', '12:00 PM', 25, 20, 0),
(7, 3, 'WAREHOUSE', 'कृषि गोदाम भण्डारण (Warehouse Storage Slot)', CURRENT_DATE + INTERVAL '1 day', '08:00 AM', '05:00 PM', 10, 2, 0),

-- Vidisha Slot
(8, 4, 'CROP_SELLING', 'चना एवं गेहूं विक्रय (Chana & Wheat Sale)', CURRENT_DATE, '09:00 AM', '01:00 PM', 20, 5, 0)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence values to allow auto-incrementing beyond seed IDs
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('mandis_id_seq', (SELECT COALESCE(MAX(id), 1) FROM mandis));
SELECT setval('commodities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM commodities));
SELECT setval('mandi_prices_id_seq', (SELECT COALESCE(MAX(id), 1) FROM mandi_prices));
SELECT setval('slots_id_seq', (SELECT COALESCE(MAX(id), 1) FROM slots));
