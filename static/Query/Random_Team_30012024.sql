
ALTER PROCEDURE Sp_Get_Random_Team_Generation
(@Match_Type Nvarchar(50),@User_Code Nvarchar(100),@Match_Id BIGINT,@Team_1 INT,@Team_2	INT  )
AS
BEGIN
SET NOCOUNT ON 

--DECLARE @Match_Type Nvarchar(50) = 'International'
--DECLARE @User_Code Nvarchar(100) = 'himanshu.tanwar@invia.co.in'
--DECLARE @Match_Id BIGINT = '78635'
--DECLARE @Team_1 INT = '2'
--DECLARE @Team_2	INT = '9'

IF OBJECT_ID('tempdb..#Temp1') IS NOT NULL
DROP TABLE #Temp1

IF OBJECT_ID('tempdb..#Temp2') IS NOT NULL
DROP TABLE #Temp2

IF OBJECT_ID('tempdb..#Temp3') IS NOT NULL
DROP TABLE #Temp3

IF OBJECT_ID('tempdb..#Temp4') IS NOT NULL
DROP TABLE #Temp4

DECLARE @Total_Players INT = 11,@Credit_Points INT = 0,@Used_points INT = 0,@Balance_Points INT = 0,@Player_Id BIGINT,@Category Nvarchar(50),@Team_Id INT,@Points INT
,@Created_By INT,@Updated_By INT
DECLARE @I INT = 1,@J INT

SET @Credit_Points = (SELECT Credit_Points FROM Login_Details WHERE User_Code = @User_Code)
SET @Created_By = (SELECT Id FROM Login_Details WHERE User_Code = @User_Code)
SET @Updated_By = @Created_By

SELECT 
	CAST(DATEADD(SECOND, CAST(Match_Start_Time_Stamp AS bigint) / 1000, '19700101 00:00:00:000') AS date) [Start_Date],
	C.Player_Id,
	C.Player_Name,
	B.Runs,
	D.Points,
	b.Strike_Rate,
	B.Bat_Team_Id,
	C.Category
	INTO #Temp1
FROM Match_Header A
LEFT JOIN Score_Card_Batsmen B ON B.Match_Id = A.Match_Id
INNER JOIN Get_Players C ON C.Player_Id = B.Bat_Id
LEFT JOIN Player_Points D ON D.Player_Id = C.Player_Id
WHERE (Bat_Team_Id = @Team_1 OR Bat_Team_Id = @Team_2) AND CAST(DATEADD(SECOND, CAST(Match_Start_Time_Stamp AS bigint) / 1000, '19700101 00:00:00:000') AS date) >= DATEADD(DD,-30,CAST(GETDATE() AS DATE))
AND C.Category != 'BOWLER'
AND A.Match_Type = @Match_Type


SELECT 
	CAST(DATEADD(SECOND, CAST(Match_Start_Time_Stamp AS bigint) / 1000, '19700101 00:00:00:000') AS date) [Start_Date],
	C.Player_Id,
	C.Player_Name,
	B.Wickets,
	D.Points,
	b.Economy,
	B.Bowl_Team_Id,
	C.Category
	INTO #Temp2
FROM Match_Header A
LEFT JOIN Score_Card_Bowler B ON B.Match_Id = A.Match_Id
INNER JOIN Get_Players C ON C.Player_Id = B.Bowl_Id
LEFT JOIN Player_Points D ON D.Player_Id = C.Player_Id
WHERE (Bowl_Team_Id = @Team_1 OR Bowl_Team_Id = @Team_2) AND CAST(DATEADD(SECOND, CAST(Match_Start_Time_Stamp AS bigint) / 1000, '19700101 00:00:00:000') AS date) >= DATEADD(DD,-30,CAST(GETDATE() AS DATE))
AND C.Category = 'BOWLER'
AND A.Match_Type = @Match_Type

--DELETE A FROM #Temp2 A
--INNER JOIN #Temp1 B ON B.Player_Id = A.Player_Id

SELECT ROW_NUMBER() OVER(ORDER BY Player_Id) Id,Player_Id,MAX(Player_Name) Player_Name,AVG(Strike_Rate) Strike_Rate,Bat_Team_Id Team_Id,Category,Points
INTO #Temp3
FROM #Temp1
GROUP BY Player_Id,Bat_Team_Id,Category,Points

SELECT ROW_NUMBER() OVER(ORDER BY Player_Id) Id, Player_Id,MAX(Player_Name) Player_Name,AVG(Economy) Strike_Rate,Bowl_Team_Id,Category,Points
INTO #Temp4
FROM #Temp2
GROUP BY Player_Id,Bowl_Team_Id,Category,Points


SET @J = (SELECT MAX(Id) FROM #Temp3)

IF NOT EXISTS (SELECT * FROM Selected_Player WHERE Match_Id = @Match_Id AND Created_By = @Created_By)
BEGIN
	WHILE (@I<=@J)
	BEGIN
		SET @Balance_Points = @Credit_Points
		SET @Player_Id = (SELECT Player_Id FROM #Temp3 WHERE Id = @I)
		SET @Category = (SELECT Category FROM #Temp3 WHERE Player_Id = @Player_Id)
		SET @Team_Id = (SELECT Team_Id FROM #Temp3 WHERE Player_Id = @Player_Id)
		SET @Points = (SELECT Points FROM #Temp3 WHERE Player_Id = @Player_Id)

		IF (SELECT COUNT(*) FROM Selected_Player WHERE Match_Id = @Match_Id AND Created_By = @Created_By)< @Total_Players
		BEGIN
			IF(@Used_points<=@Credit_Points)
			BEGIN
				IF (SELECT COUNT(*) FROM Selected_Player WHERE Match_Id = @Match_Id AND Category != 'BOWLER' AND Created_By = @Created_By)<=5
				BEGIN
					SET @Used_points +=@Points
					SET @Balance_Points -=@Used_points
					IF (@Balance_Points>=0)
					BEGIN
						INSERT INTO Selected_Player 
						(
							[Match_Id]
							,[Player_Id]
							,[Player_Name]
							,Player_Points
							,[Credit_Points]
							,[Used_Points]
							,[Balance_Points]
							,[Category]
							,[Created_By]
							,[Updated_By]
						)
						SELECT  @Match_Id, Player_Id,Player_Name,@Points,@Credit_Points,@Used_points,@Balance_Points,Category,@Created_By,@Created_By
						FROM #Temp3 
						WHERE Player_Id = @Player_Id  AND Category != 'BOWLER' ORDER BY Strike_Rate DESC
					END
				END
			END
		END
		SET @I+=1
	END

	SET @I = 1
	SET @J = (SELECT MAX(Id) FROM #Temp4)


	WHILE (@I<=@J)
	BEGIN
		SET @Player_Id = (SELECT Player_Id FROM #Temp4 WHERE Id = @I)
		SET @Category = (SELECT Category FROM #Temp4 WHERE Player_Id = @Player_Id)
		SET @Team_Id = (SELECT Bowl_Team_Id FROM #Temp4 WHERE Player_Id = @Player_Id)
		SET @Points = (SELECT Points FROM #Temp4 WHERE Player_Id = @Player_Id)

		--SELECT @Player_Id

		IF (SELECT COUNT(*) FROM Selected_Player WHERE Match_Id = @Match_Id AND Created_By = @Created_By)< @Total_Players
		BEGIN

			IF(@Used_points<=@Credit_Points)
			BEGIN
				SET @Used_points += @Points
				SET @Balance_Points = (@Credit_Points - @Used_points)
				IF (@Balance_Points>=0)
				BEGIN
					INSERT INTO Selected_Player 
					(
						[Match_Id]
						,[Player_Id]
						,[Player_Name]
						,Player_Points
						,[Credit_Points]
						,[Used_Points]
						,[Balance_Points]
						,[Category]
						,[Created_By]
						,[Updated_By]
					)
					SELECT  @Match_Id, Player_Id,Player_Name,@Points,@Credit_Points,@Used_points,@Balance_Points,Category,@Created_By,@Created_By
					FROM #Temp4 
					WHERE Player_Id = @Player_Id  AND Category = 'BOWLER' ORDER BY Strike_Rate DESC
				END
			END
		END
		SET @I+=1
	END

	UPDATE A SET A.Match_Desc = B.Match_Desc,A.Series_Name = B.Series_Name,A.Start_Date = CAST(DATEADD(SECOND, CAST(B.[Start_Date] AS bigint) / 1000, '19700101 00:00:00:000') AS date) 
	FROM Selected_Player A
	LEFT JOIN Get_Scheduled_Match B ON B.Match_Id = A.Match_Id
	WHERE A.Match_Id = @Match_Id AND A.Created_By = @Created_By

END

SELECT Match_Id,Player_Id,Player_Name,@User_Code,Credit_Points,Used_points,Balance_Points,Category 
FROM Selected_Player WHERE Match_Id = @Match_Id AND Created_By = @Created_By

END