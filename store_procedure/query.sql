CREATE PROCEDURE GetAllNews(@desc int)
BEGIN
IF @desc=1
SELECT * FROM news order by createdAt DESC
ELSE
SELECT * FROM news order by createdAt ASC
END;

CREATE PROCEDURE GetNewsById(@newsId int)
BEGIN
SELECT * FROM news WHERE id = @newsId
END;

CREATE PROCEDURE DeleteNews(@newsId int)
BEGIN
DELETE FROM news WHERE id = @newsId
END;

CREATE PROCEDURE CreateNews(@title VARCHAR(50), @description varchar(MAX), @author VARCHAR(50), @createdAt DATETIME, @cover VARCHAR(50) = NULL)
BEGIN
INSERT INTO news
VALUES (@title, @description, @author, @createdAt, @cover)
END;

CREATE PROCEDURE GetCommentsByNewsId(@newsId int)
BEGIN
SELECT * FROM comments WHERE newsId = @newsId
END;

CREATE PROCEDURE CreateComment(@newsId int, @text VARCHAR(50), @createdAt DATETIME, @cover VARCHAR(50) = NULL)
BEGIN
INSERT INTO comments
VALUES (@newsId, @text, @createdAt, @cover)
END;

CREATE PROCEDURE DeleteComment(@id int, @newsId int)
BEGIN
DELETE FROM comments WHERE newsId = @newsId AND id = @id
END;
