

SET NOCOUNT ON 

DECLARE @Match_Type Nvarchar(50) = 'International'
DECLARE @User_Code Nvarchar(100) = 'himanshu.tanwar@invia.co.in'
DECLARE @Match_Id BIGINT = '78635'

IF OBJECT_ID('tempdb..#Temp1') IS NOT NULL
DROP TABLE #Temp1

IF OBJECT_ID('tempdb..#Temp2') IS NOT NULL
DROP TABLE #Temp2

IF OBJECT_ID('tempdb..#Temp3') IS NOT NULL
DROP TABLE #Temp3

IF OBJECT_ID('tempdb..#Selected_Player') IS NOT NULL
DROP TABLE #Selected_Player

DECLARE @Total_Players INT = 11,@Credit_Points INT = 0,@Used_points INT = 0,@Balance_Points INT = 0,@Player_Id BIGINT,@Category Nvarchar(50),@Team_Id INT,@Points INT
,@Created_By INT,@Updated_By INT
DECLARE @I INT = 1,@J INT

SET @Credit_Points = (SELECT Credit_Points FROM Login_Details WHERE User_Code = @User_Code)
SET @Created_By = (SELECT Id FROM Login_Details WHERE User_Code = @User_Code)
SET @Updated_By = @Created_By
SELECT * INTO #Selected_Player FROM Selected_Player WHERE 1=2

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
WHERE Bat_Team_Id IN (2,9) AND CAST(DATEADD(SECOND, CAST(Match_Start_Time_Stamp AS bigint) / 1000, '19700101 00:00:00:000') AS date) >= DATEADD(DD,-30,CAST(GETDATE() AS DATE))
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
WHERE Bowl_Team_Id IN (2,9) AND CAST(DATEADD(SECOND, CAST(Match_Start_Time_Stamp AS bigint) / 1000, '19700101 00:00:00:000') AS date) >= DATEADD(DD,-30,CAST(GETDATE() AS DATE))
AND A.Match_Type = @Match_Type


SELECT 
	ROW_NUMBER() OVER(ORDER BY Player_Id) Id,Player_Id,MAX(Player_Name) Player_Name,Team_Id,Category,Points,SUM(Strike_Rate) Strike_Rate
INTO #Temp3
FROM 
(
	SELECT Player_Id,MAX(Player_Name) Player_Name,AVG(Strike_Rate) Strike_Rate,Bat_Team_Id Team_Id,Category,Points
	FROM #Temp1
	GROUP BY Player_Id,Bat_Team_Id,Category,Points
	UNION ALL
	SELECT Player_Id,MAX(Player_Name) Player_Name,AVG(Economy) Strike_Rate,Bowl_Team_Id,Category,Points
	FROM #Temp2
	GROUP BY Player_Id,Bowl_Team_Id,Category,Points
)A
GROUP BY Player_Id,Team_Id,Category,Points

SET @J = (SELECT MAX(Id) FROM #Temp3)

WHILE (@I<=@J)
BEGIN
	SET @Balance_Points = @Credit_Points
	SET @Player_Id = (SELECT Player_Id FROM #Temp3 WHERE Id = @I)
	SET @Category = (SELECT Category FROM #Temp3 WHERE Player_Id = @Player_Id)
	SET @Team_Id = (SELECT Team_Id FROM #Temp3 WHERE Player_Id = @Player_Id)
	SET @Points = (SELECT Points FROM #Temp3 WHERE Player_Id = @Player_Id)

	--IF (SELECT COUNT(*) FROM #Selected_Player WHERE Match_Id = @Match_Id) < @Total_Players
	--BEGIN
		SELECT @Category
		IF (@Used_points <= @Credit_Points)
		BEGIN
			SET @Used_points += @Points
			SET @Balance_Points -= @Used_points
			IF(@Balance_Points >= 0)
			BEGIN
				IF (@Category != 'BOWLER')
				BEGIN
					IF (SELECT COUNT(*) FROM #Selected_Player WHERE Match_Id = @Match_Id AND Category != 'BOWLER')<=5
					BEGIN
						INSERT INTO #Selected_Player 
						(
							[Match_Id]
							,[Player_Id]
							,[Player_Name]
							,[Credit_Points]
							,[Used_Points]
							,[Balance_Points]
							,[Category]
							,[Created_By]
							,[Updated_By]
						)
						SELECT  @Match_Id, Player_Id,Player_Name,@Credit_Points,@Used_points,@Balance_Points,Category,@Created_By,@Created_By 
						FROM #Temp3 
						WHERE Player_Id = @Player_Id AND Category != 'BOWLER' ORDER BY Strike_Rate DESC
					END
					ELSE
					BEGIN
						INSERT INTO #Selected_Player 
						(
							[Match_Id]
							,[Player_Id]
							,[Player_Name]
							,[Credit_Points]
							,[Used_Points]
							,[Balance_Points]
							,[Category]
							,[Created_By]
							,[Updated_By]
						)
						SELECT @Match_Id, Player_Id,Player_Name,@Credit_Points,@Used_points,@Balance_Points,Category,@Created_By,@Created_By 
						FROM #Temp3 
						WHERE Player_Id = @Player_Id AND Category = 'BOWLER' ORDER BY Strike_Rate DESC
					END
				END
				
			END
		END
	--END

	SET @I+=1
END

--SELECT * FROM #Selected_Player

--SELECT * FROm #Temp3 WHERE Category = 'BOWLER'

--SELECT * FROM #Temp1