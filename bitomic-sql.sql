DROP DATABASE IF EXISTS bitomic;
CREATE DATABASE bitomic;

\c bitomic;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  transaction_id uuid UNIQUE DEFAULT uuid_generate_v4 (),
  trade_date TIMESTAMP NOT NULL,
  symbol_pair VARCHAR NOT NULL,
  price_base_currency NUMERIC(15, 8) NOT NULL,
  equivalent_amt_base_currency NUMERIC (1000, 9) NOT NULL,
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
  selling_price NUMERIC(15, 8) NOT NULL,
  percent_gain_loss NUMERIC(15, 4)
);