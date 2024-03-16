


DECLARE @Start NVARCHAR(MAX) = 1413

CREATE TABLE Rest_Images
(Id BIGINT IDENTITY(1,1),Image_Name VARBINARY(MAX))

--UPDATE Get_Players SET Player_Image = (SELECT BulkColumn
--FROM OPENROWSET(BULK 'D:\Project\Python\Web Application\2023\Cricket\Cricket\static\Images\Attachment.png', SINGLE_BLOB) AS Image)
--WHERE Player_Id = @Start

INSERT INTO Rest_Images (Image_Name)
SELECT BulkColumn
FROM OPENROWSET(BULK 'D:\Project\Python\Web Application\2023\Cricket\Cricket\static\Images\Attachment.png', SINGLE_BLOB) AS Image)
WHERE Player_Id = @Start

--SELECT * FROM Get_Players WHERE Team_Id = 2