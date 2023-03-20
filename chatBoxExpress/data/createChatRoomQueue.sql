use dcoda_acme;

CREATE TABLE chat_room_queue (
CR_QUEUE_ID		MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
USER_ID			CHAR(20) NOT NULL,
ROOM_ID			CHAR(25) NOT NULL,
INSERT_TS		DATETIME NOT NULL,
CHAT_TEXT		VARCHAR(1000),
MSG_USER_ID		CHAR(15) NOT NULL
);
