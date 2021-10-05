Create database auth;
use auth;

drop user 'api'@'%';
flush privileges;
create user 'api'@'%' identified by 'api';
grant all privileges on *.* to 'api'@'%' with grant option;
flush privileges;

Create Table user (
	id int not null auto_increment,
	email varchar(50) unique not null,
	name varchar(255) not null,
	company varchar(1) not null,
	password binary(60) not null,
	primary key (id)
);

insert into user(email, name, company, password)
values ('user1@coca.com', 'user1', 'C', '$2b$10$rdEmJUdZXsz1SiSGs1bF2uOJpye6SG8JIEeTpc9IgmHZrvpcZZ60u'),
('user1@pepsi.com', 'user2', 'P', '$2b$10$/udtWXfxhDvH7LlCe/2pR.nENCIw.fzONl4cH1I0/ZWLV1aZVZ0Lq');

