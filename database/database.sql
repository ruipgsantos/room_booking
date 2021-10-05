Create database booking;
use booking;

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

Create Table meeting_room (
	id int not null auto_increment,
	name varchar(20) not null,
	company varchar(1),
	primary key (id)
);

Create Table timeslot (
	id int not null,
	hour int,
	primary key (id)
);

Create Table booking (
	room_id int not null,
	timeslot_id int not null,
	reserved_by int not null,
	foreign key (room_id) references meeting_room(id),
	foreign key (timeslot_id) references timeslot(id),
	foreign key (reserved_by) references user(id),
	primary key (room_id, timeslot_id)
);

insert into user(email, name, company, password)
values ('user1@coca.com', 'user1', 'C', '$2b$10$rdEmJUdZXsz1SiSGs1bF2uOJpye6SG8JIEeTpc9IgmHZrvpcZZ60u'),
('user1@pepsi.com', 'user2', 'P', '$2b$10$/udtWXfxhDvH7LlCe/2pR.nENCIw.fzONl4cH1I0/ZWLV1aZVZ0Lq');

insert into timeslot (id, hour)
values (8, 8), (9, 9), (10, 10), (11, 11), (12, 12);

insert into meeting_room (name, company)
values ('C01','C'), ('C02','C'), ('C03','C'), ('C04','C'), ('C05','C'), ('C06','C'), ('C07','C'), ('C08','C'), ('C09','C'), ('C10','C'),
('P01','P'), ('P02','P'), ('P03','P'), ('P04','P'), ('P05','P'), ('P06','P'), ('P07','P'), ('P08','P'), ('P09','P'), ('P10','P');


insert into booking (room_id, timeslot_id, reserved_by)
values (1, 8, 1), (2, 9, 2);