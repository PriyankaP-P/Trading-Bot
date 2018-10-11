DROP DATABASE IF EXISTS bitomic;
CREATE DATABASE bitomic;

\c bitomic;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS marketEma;
CREATE TABLE marketEma (
  id SERIAL PRIMARY KEY,
  symbol_pair VARCHAR NOT NULL,
  entry_time BIGINT NOT NULL,
  exchange_time BIGINT NOT NULL,
  interval VARCHAR NOT NULL,
  ema55_last_100 NUMERIC(15,9) NOT NULL,
  ema21_last_100 NUMERIC(15,9) NOT NULL,
  ema13_last_100 NUMERIC(15,9) NOT NULL,
  ema8_last_100 NUMERIC(15,9) NOT NULL,
  percent_diff_21_55 NUMERIC(15,9) NOT NULL,
  percent_diff_13_55 NUMERIC(15,9) NOT NULL,
  percent_diff_8_55 NUMERIC(15,9) NOT NULL
);


DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  transaction_id uuid UNIQUE DEFAULT uuid_generate_v4 (),
  trade_date BIGINT NOT NULL,
  symbol_pair VARCHAR NOT NULL,
  price_base_currency NUMERIC(15, 8) NOT NULL,
  quantity NUMERIC(15, 8),
  transaction_type VARCHAR NOT NULL,
  fulfilled BOOLEAN NOT NULL,
  order_status VARCHAR NOT NULL,
  exchange_client_id VARCHAR,
  exchange_timestamp  BIGINT,
  position_status VARCHAR,
  selling_pair_id VARCHAR
);


DROP TABLE IF EXISTS revenue;
CREATE TABLE revenue (
  id SERIAL PRIMARY KEY,
  symbol_pair VARCHAR NOT NULL,
  selling_pair_id VARCHAR NOT NULL UNIQUE,
  buying_price  NUMERIC(15, 8) NOT NULL,
  quantity_bought NUMERIC(15, 8),
  selling_price NUMERIC(15, 8) NOT NULL,
  quantity_sold NUMERIC(15, 8),
  perunit_gain_loss NUMERIC(15, 4),
  base_currency_change NUMERIC(15, 4)
);

DROP TABLE IF EXISTS trail;
CREATE TABLE trail (
  transaction_id VARCHAR NOT NULL,
  symbol_pair VARCHAR NOT NULL,
  trailing_price NUMERIC(15, 8) NOT NULL,
  trailing_status BOOLEAN
);