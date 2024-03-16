
--Sp_Get_Player_Points '86882','Admin'
ALTER PROCEDURE Sp_Get_Player_Points 
(
@Match_Id BIGINT 
, @User_Code Nvarchar(50)
)
AS
BEGIN
--DECLARE @Match_Id BIGINT = 86882
--DECLARE @User_Code Nvarchar(50) = 'Admin'
SET NOCOUNT ON
DECLARE @Player_Run AS TABLE
(
	Player_Id BIGINT,Player_Name Nvarchar(254),Player_Image VARBINARY(MAX),VCaptain NVARCHAR(5),Captain Nvarchar(2),Category Nvarchar(20),Match_Id BIGINT
)

INSERT INTO @Player_Run
EXEC Sp_Get_Preview_Team_Player @Match_Id, @User_Code

SELECT A.Player_Id,ISNULL(D.Points,0) Points,ISNULL(B.Runs,0) Runs,(ISNULL(D.Points,0)*ISNULL(B.Runs,0)) Total_Runs FROM @Player_Run A
LEFT JOIN Score_Card_Batsmen B ON B.Bat_Id = A.Player_Id AND B.Match_Id = A.Match_Id
INNER JOIN Get_Players C ON C.Player_Id = B.Bat_Id
LEFT JOIN Points D ON D.Type = C.Category
WHERE A.Match_Id = @Match_Id 

END