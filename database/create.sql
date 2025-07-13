drop schema if exists ccca;

create schema ccca;

create table ccca.account (
	account_id uuid,
	name text,
	email text,
	document text,
	password text,
	primary key (account_id)
);

create table ccca.account_asset (
	account_id uuid,
	asset_id text,
	quantity numeric,
	primary key (account_id, asset_id)
);

/*
Deposit (Depósito)
Adicionar fundos em uma conta.

Input: accountId, assetId, quantity
Output: void

Regras:

A conta deve existir
O assetId permitido é BTC ou USD
A quantidade deve ser maior que zero
Withdraw (Saque)
Retirar fundos de uma conta.

Input: accountId, assetId, quantity
Output: void

Regras:

A conta deve existir
O assetId permitido é BTC ou USD
A quantidade deve ser maior ou igual ao saldo
*/