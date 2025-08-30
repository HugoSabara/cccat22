drop schema if exists ccca;

create schema ccca;

create table ccca.depth (
	market_id text primary key,
	data jsonb
);