

ALTER PROCEDURE Sp_GetScore_Details
AS
BEGIN
SET NOCOUNT ON

DECLARE @Json_Id BIGINT = (SELECT TOP 1 Id FROM Add_Json WHERE Json_Type = 'Get_Score' ORDER BY Created_Date,Created_Time DESC)
DECLARE @JSON varchar(MAX) = (SELECT Json_Name FROM Add_Json WHERE Id = @Json_Id)
DECLARE @Created_By INT = (SELECT Created_By FROM Add_Json WHERE Id = @Json_Id)
DECLARE @Updated_By INT = (SELECT Updated_By FROM Add_Json WHERE Id = @Json_Id)
DECLARE @Record_Count BIGINT
DECLARE @Error_Code INT,@Error_Name Nvarchar(200)

IF OBJECT_ID('tempdb..#Error_Table') IS NOT NULL
DROP TABLE #Error_Table

CREATE TABLE #Error_Table
(Error_Code INT, Error_Name Nvarchar(254))

IF OBJECT_ID('tempdb..#Temp1') IS NOT NULL
DROP TABLE #Temp1

IF OBJECT_ID('tempdb..#Temp2') IS NOT NULL
DROP TABLE #Temp2

IF OBJECT_ID('tempdb..#Temp3') IS NOT NULL
DROP TABLE #Temp3

IF OBJECT_ID('tempdb..#Temp4') IS NOT NULL
DROP TABLE #Temp4

IF OBJECT_ID('tempdb..#Temp5') IS NOT NULL
DROP TABLE #Temp5

IF OBJECT_ID('tempdb..#Temp6') IS NOT NULL
DROP TABLE #Temp6

SELECT Z.* INTO #Temp1 FROM (
SELECT  *
	FROM OPENJSON(@Json,'$.scoreCard')
	WITH
	(
		Match_Id INT '$.matchId',
		Innings_Id INT '$.inningsId',
		Time_Score Nvarchar(30) '$.timeScore',
		Bat_Team_Details Nvarchar(MAX) '$.batTeamDetails' AS JSON,
		Bowl_Team_Details Nvarchar(MAX) '$.bowlTeamDetails' AS JSON,
		Score_Details Nvarchar(MAX) '$.scoreDetails' AS JSON,
		Extras_Data Nvarchar(MAX) '$.extrasData' AS JSON,
		--PP_Data Nvarchar(MAX) '$.ppData' AS JSON,
		Wickets_Data Nvarchar(MAX) '$.wicketsData' AS JSON
		--Partnerships_Data Nvarchar(MAX) '$.partnershipsData' AS JSON
	) A OUTER APPLY OPENJSON(A.Bat_Team_Details,'$')
	WITH
	(
		Bat_Team_Id INT '$.batTeamId',
		Bat_Team_Name Nvarchar(100) '$.batTeamName',
		Bat_Team_Short_Name Nvarchar(10) '$.batTeamShortName',
		Batsmen_Data Nvarchar(MAX) '$.batsmenData' AS JSON
	)B OUTER APPLY OPENJSON(A.Bowl_Team_Details,'$')
	WITH
	(
		Bowl_Team_Id INT '$.bowlTeamId',
		Bowl_Team_Name Nvarchar(100) '$.bowlTeamName',
		Bowl_Team_Short_Name Nvarchar(10) '$.bowlTeamShortName',
		Bowlers_Data Nvarchar(MAX) '$.bowlersData' AS JSON
	)C
)Z  LEFT JOIN Score_Card B ON B.Match_Id = Z.Match_Id AND B.Innings_Id = Z.Innings_Id
WHERE (B.Match_Id IS NULL OR B.Match_Id = '')

SELECT 
	A.Match_Id,
    A.Innings_Id,
    A.Time_Score,
    A.Bat_Team_Id,
    A.Bat_Team_Name,
    A.Bat_Team_Short_Name,
    B.[key] AS BatsmanKey,
    C.batId,
    C.batName,
    C.batShortName,
    C.isCaptain,
    C.isKeeper,
    C.runs,
    C.balls,
    C.dots,
    C.fours,
    C.sixes,
    C.mins,
    C.strikeRate,
    C.outDesc,
    C.bowlerId,
    C.fielderId1,
    C.fielderId2,
    C.fielderId3,
    C.ones,
    C.twos,
    C.threes,
    C.fives,
    C.boundaries,
    C.sixers,
    C.wicketCode,
    C.isOverseas,
    C.inMatchChange,
    C.playingXIChange
	INTO #Temp2
FROM #Temp1 A
CROSS APPLY OPENJSON(A.Batsmen_Data) B
CROSS APPLY OPENJSON(B.[value]) WITH (
    batId INT '$.batId',
    batName NVARCHAR(100) '$.batName',
    batShortName NVARCHAR(10) '$.batShortName',
    isCaptain BIT '$.isCaptain',
    isKeeper BIT '$.isKeeper',
    runs INT '$.runs',
    balls INT '$.balls',
    dots INT '$.dots',
    fours INT '$.fours',
    sixes INT '$.sixes',
    mins INT '$.mins',
    strikeRate FLOAT '$.strikeRate',
    outDesc NVARCHAR(MAX) '$.outDesc',
    bowlerId INT '$.bowlerId',
    fielderId1 INT '$.fielderId1',
    fielderId2 INT '$.fielderId2',
    fielderId3 INT '$.fielderId3',
    ones INT '$.ones',
    twos INT '$.twos',
    threes INT '$.threes',
    fives INT '$.fives',
    boundaries INT '$.boundaries',
    sixers INT '$.sixers',
    wicketCode NVARCHAR(MAX) '$.wicketCode',
    isOverseas BIT '$.isOverseas',
    inMatchChange NVARCHAR(MAX) '$.inMatchChange',
    playingXIChange NVARCHAR(MAX) '$.playingXIChange'
) C;

SELECT 
	A.Match_Id,
    A.Innings_Id,
    A.Time_Score,
    A.Bowl_Team_Id,
    A.Bowl_Team_Name,
    A.Bowl_Team_Short_Name,
    B.[key] AS BatsmanKey,
    C.bowlerId AS BowlerId,
    C.bowlName,
    C.bowlShortName,
    C.isCaptain AS BowlIsCaptain,
    C.isKeeper AS BowlIsKeeper,
    C.overs,
    C.maidens,
    C.runs AS BowlRuns,
    C.wickets,
    C.economy,
    C.no_balls,
    C.wides,
    C.dots AS BowlDots,
    C.balls AS BowlBalls,
    C.runsPerBall,
    C.isOverseas AS BowlIsOverseas,
    C.inMatchChange AS BowlInMatchChange,
    C.playingXIChange AS BowlPlayingXIChange
	INTO #Temp3
FROM #Temp1 A
CROSS APPLY OPENJSON(A.Bowlers_Data) B
CROSS APPLY OPENJSON(B.[value]) WITH (
    bowlerId INT '$.bowlerId',
    bowlName NVARCHAR(100) '$.bowlName',
    bowlShortName NVARCHAR(10) '$.bowlShortName',
    isCaptain BIT '$.isCaptain',
    isKeeper BIT '$.isKeeper',
    overs FLOAT '$.overs',
    maidens INT '$.maidens',
    runs INT '$.runs',
    wickets INT '$.wickets',
    economy FLOAT '$.economy',
    no_balls INT '$.no_balls',
    wides INT '$.wides',
    dots INT '$.dots',
    balls INT '$.balls',
    runsPerBall FLOAT '$.runsPerBall',
    isOverseas BIT '$.isOverseas',
    inMatchChange NVARCHAR(MAX) '$.inMatchChange',
    playingXIChange NVARCHAR(MAX) '$.playingXIChange'
) C;

SELECT A.* INTO #Temp4 
FROM 
(
	SELECT  *  FROM OPENJSON(@Json,'$.matchHeader')
	WITH 
	(
		Match_Id INT '$.matchId',
		Match_Description Nvarchar(150) '$.matchDescription',
		Match_Format Nvarchar(10) '$.matchFormat',
		match_Type Nvarchar(20) '$.matchType',
		Complete BIT '$.complete',
		Domestic BIT '$.domestic',
		Match_Start_Time_Stamp Nvarchar(50) '$.matchStartTimestamp',
		Match_Complete_Time_Stamp Nvarchar(50) '$.matchCompleteTimestamp',
		Day_Night BIT '$.dayNight',
		Year INT '$.year',
		State Nvarchar(50) '$.state',
		Status Nvarchar(150) '$.status',
		Series_Id INT '$.seriesId',
		Series_Name Nvarchar(150) '$.seriesName'
	)
)A
LEFT JOIN Match_Header B ON B.Match_Id = A.Match_Id
WHERE (B.Match_Id IS NULL OR B.Match_Id = '')

SELECT A.Match_Id,A.Innings_Id,Ball_Nbr,Is_Declared,Is_Follow_On,Overs,Revised_Overs,Run_Rate,Runs,Wickets,Runs_Per_Ball INTO #Temp5 
FROM #Temp1 A
OUTER APPLY OPENJSON(A.Score_Details,'$')
WITH
(
	Ball_Nbr INT '$.ballNbr',
	Is_Declared BIT '$.isDeclared',
	Is_Follow_On BIT '$.isFollowOn',
	Overs DECIMAL(19,2) '$.overs',
	Revised_Overs DECIMAL(19,2) '$.revisedOvers',
	Run_Rate DECIMAL(19,2) '$.runRate',
	Runs INT '$.runs',
	Wickets INT '$.wickets',
	Runs_Per_Ball DECIMAL(19,2) '$.runsPerBall'
)

SELECT A.Match_Id,A.Innings_Id,No_Balls,Total,Byes,Penalty,Wides,Leg_Byes
INTO #Temp6
FROM #Temp1 A
OUTER APPLY OPENJSON(A.Extras_Data,'$')
WITH
(
	No_Balls INT '$.noBalls',
	Total INT '$.total',
	Byes INT '$.byes',
	Penalty INT '$.penalty',
	Wides INT '$.wides',
	Leg_Byes INT '$.legByes'
)

--SELECT * FROM #Temp1
--SELECT * FROM #Temp2
--SELECT * FROM #Temp3
--SELECT * FROM #Temp4
--SELECT * FROM #Temp5
--SELECT * FROM #Temp6

--SELECT * FROM Match_Header
--SELECT * FROM Score_Card
--SELECT * FROM [Score_Card_Batsmen]
--SELECT * FROM [Score_Card_Bowler]

--TRUNCATE TABLE Match_Header
--TRUNCATE TABLE Score_Card
--TRUNCATE TABLE [Score_Card_Batsmen]
--TRUNCATE TABLE [Score_Card_Bowler]


IF EXISTS (SELECT * FROM #Temp4)
BEGIN
	INSERT INTO Match_Header 
	(
		Match_Id,
		Match_Descripton,
		Match_Format,
		Match_Type,
		Complete,
		Domestic,
		Match_Start_Time_Stamp,
		Match_Complete_Time_Stamp,
		Day_Night,
		Year,
		State,
		Status,
		Series_Id,
		Series_Description,
		Created_By,
		Updated_By,
		JSON_Id
		)
	SELECT 
		A.Match_Id,
		A.Match_Description,
		A.Match_Format,
		A.Match_Type,
		A.Complete,
		A.Domestic,
		A.Match_Start_Time_Stamp,
		A.Match_Complete_Time_Stamp,
		A.Day_Night,
		A.Year,
		A.State,
		A.Status,
		A.Series_Id,
		A.Series_Name,	
		@Created_By,
		@Updated_By,
		@Json_Id 
	FROM 
		#Temp4 A
		LEFT JOIN Match_Header B ON B.Match_Id = A.Match_Id
	WHERE 1=1
		AND (B.Match_Id IS NULL OR B.Match_Id = '')

	SET @Record_Count = @@ROWCOUNT

	IF (@Record_Count>0)
	BEGIN
		SET @Error_Code = '0'
		SET @Error_Name = 'Operation Sucessfully ' + CAST(@Record_Count AS nvarchar(254))

		INSERT INTO #Error_Table 
		SELECT @Error_Code,@Error_Name
	END

	IF EXISTS (SELECT * FROM #Temp1)
	BEGIN
		INSERT INTO Score_Card 
		(
			Match_Id
			,innings_Id
			,Time_Score
			,Team_Id
			,Team_Name
			,Team_Short_Name
			,Created_By
			,Updated_By
			,JSON_Id
		)
		SELECT 
			A.Match_Id
			,A.Innings_Id
			,A.Time_Score
			,A.Bat_Team_Id
			,A.Bat_Team_Name
			,A.Bat_Team_Short_Name
			,@Created_By
			,@Updated_By
			,@JSON_Id
		FROM 
			#Temp1 A
			LEFT JOIN Score_Card B ON B.Match_Id = A.Match_Id AND A.Innings_Id = B.Innings_Id
			WHERE (B.Match_Id IS NULL OR B.Match_Id = '')

		SET @Record_Count = @@ROWCOUNT

		IF (@Record_Count>0)
		BEGIN
			SET @Error_Code = '0'
			SET @Error_Name = 'Operation Sucessfully ' + CAST(@Record_Count AS nvarchar(254))

			INSERT INTO #Error_Table 
			SELECT @Error_Code,@Error_Name
		END

	END

	IF EXISTS (SELECT * FROM #Temp2)
	BEGIN
		INSERT INTO [Score_Card_Batsmen]
		(
			 [Match_Id]
			 ,[Innings_Id]
			 ,[Time_Score]
			 ,[Bat_Team_Id]
			 ,[Bat_Team_Name]
			 ,[Bat_Team_Short_Name]
			 ,[Batmens_key]
			 ,[Bat_Id]
			 ,[Bat_Name]
			 ,[Bat_Short_Name]
			 ,[Is_Captain]
			 ,[Is_Keeper]
			 ,[Runs]
			 ,[Balls]
			 ,[Dots]
			 ,[Fours]
			 ,[Sixes]
			 ,[Mins]
			 ,[Strike_Rate]
			 ,[Out_Desc]
			 ,[Bowler_Id]
			 ,[Fielder_Id_1]
			 ,[Fielder_Id_2]
			 ,[Fielder_Id_3]
			 ,[Ones]
			 ,[Twos]
			 ,[Threes]
			 ,[Fives]
			 ,[Boundaries]
			 ,[Sixers]
			 ,[Wicket_Code]
			 ,[Is_Overseas]
			 ,[In_Match_Change]
			 ,[Playing_XI_Change]
			 ,[Created_By]
			 ,Updated_By
			 ,JSON_Id
		)
			
		SELECT 
			A.*
			,@Created_By
			,@Updated_By
			,@Json_Id 
		FROM 
			#Temp2 A
		LEFT JOIN Score_Card_Batsmen B ON B.Match_Id = A.Match_Id AND A.Innings_Id = B.Innings_Id
		WHERE (B.Match_Id iS NULL OR B.Match_Id = '')

		SET @Record_Count = @@ROWCOUNT

		IF (@Record_Count>0)
		BEGIN
			SET @Error_Code = '0'
			SET @Error_Name = 'Operation Sucessfully ' + CAST(@Record_Count AS nvarchar(254))

			INSERT INTO #Error_Table 
			SELECT @Error_Code,@Error_Name
		END
	END

	IF EXISTS (SELECT * FROM #Temp3)
	BEGIN
		INSERT INTO [Score_Card_Bowler]
        (
			[Match_Id]
			,[Innings_Id]
			,[Time_Score]
			,[Bowl_Team_Id]
			,[Bowl_Team_Name]
			,[Bowl_Team_Short_Name]
			,[Bowler_key]
			,[Bowl_Id]
			,[Bowl_Name]
			,[Bowl_Short_Name]
			,[Is_Captain]
			,[Is_Keeper]
			,[Overs]
			,[maiden]
			,[Runs]
			,[Wickets]
			,[Economy]
			,[No_Balls]
			,[Wides]
			,[Dots]
			,[Balls]
			,[Runs_Per_Balls]
			,[Is_Overseas]
			,[In_Match_Change]
			,[Playing_XI_Change]
			,[Created_By]
			,[Updated_By]
			,JSON_Id
		)
		SELECT 
			A.*
			,@Created_By
			,@Updated_By
			,@Json_Id 
		FROM 
			#Temp3 A
		LEFT JOIN Score_Card_Bowler B ON B.Match_Id = A.Match_Id AND A.Innings_Id = B.Innings_Id
		WHERE (B.Match_Id iS NULL OR B.Match_Id = '')

		SET @Record_Count = @@ROWCOUNT

		IF (@Record_Count>0)
		BEGIN
			SET @Error_Code = '0'
			SET @Error_Name = 'Operation Sucessfully ' + CAST(@Record_Count AS nvarchar(254))

			INSERT INTO #Error_Table 
			SELECT @Error_Code,@Error_Name
		END
	END

END

ELSE
BEGIN
	SET @Error_Code = '1'
	SET @Error_Name = 'Match Header has no data'
	INSERT INTO #Error_Table 
	SELECT @Error_Code,@Error_Name
END

IF EXISTS (SELECT * FROM #Error_Table WHERE Error_Code != 0)
BEGIN
	SELECT TOP 1 * FROM #Error_Table
	WHERE Error_Code!=0
END

ELSE
BEGIN
	SELECT TOP 1 * FROM #Error_Table
	WHERE Error_Code=0
END


END