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

create table ccca.deposit (
    deposit_id uuid,
    account_id number,
    assetId text,
    quantity number,
    primary key (deposit_id)
);

create table ccca.withdraw (
    withdraw_id number,
    assetId text,
    quantity number,
    primary key (withdraw_id)
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