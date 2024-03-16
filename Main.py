from flask import Flask,render_template,jsonify,request,session,Response
from Classes.GetServerName import getservername as MainServerName
from Classes.TeamList import *
from Classes.APICall import *
from Classes.Insert_Data import * 

app = Flask(__name__)
app.secret_key = 'gfgewwkejdfhhkjwgfhkewgfyw6r487rouydh23e3y9owfyiefwc'

def Server_details():
    
    try:
        OTS_Result = MainServerName.GetConnectiondetails()
        data_list = []
        for rows in OTS_Result:
            server_name = rows['server_name']
            login_id = rows['login_id']
            password = rows['password']
            db_name = rows['db_name']
            data_list.append({'server_name':server_name,'login_id':login_id,'password':password,'db_name':db_name})
        return data_list
    except Exception as ex:
        return str(ex)

#default page
@app.route('/', methods=['GET', 'POST'])
def main_page():
    session.clear()
    return render_template('Index.html')


@app.route('/Home', methods=['GET', 'POST'])
def Home():
    if 'User_Code' in session:
        return render_template('Home.html')
    else:
        return render_template('Index.html')

@app.route('/GetTeams/TeamList', methods=['GET', 'POST'])
def TeamList():
    return render_template('/GetTeam/TeamList.html')

@app.route('/GetTeams/TeamList/PlayerList',methods=['GET','POST'])
def PlayerList():
    return render_template('/GetTeam/PlayersList.html')

@app.route('/GetTeams/TeamList/PlayerName',methods=['GET','POST'])
def PlayerName():
    return render_template('/GetTeam/PlayerInfo.html')

@app.route('/GetMatch/MatchList', methods=['GET', 'POST'])
def MatchList():
    return render_template('/GetMatch/GetMatchList.html')

@app.route('/GetMatch/MatchList/Scores', methods=['GET', 'POST'])
def Scores():
    return render_template('/GetMatch/GetScores.html')

@app.route('/GetMatch/MatchList/ScoresDetails', methods=['GET', 'POST'])
def ScoresDetails():
    return render_template('/GetMatch/GetScoreDetails.html')
    
@app.route('/GetMatch/UpcomminMatches', methods=['GET', 'POST'])
def UpcomminMatches():
    return render_template('/GetSchedule/GetScheduleMatch.html')

@app.route('/GetMatch/UpcomminMatches/CreateTeam', methods=['GET', 'POST'])
def CreateTeam():
    return render_template('/GetSchedule/CreateTeam.html')

@app.route('/PreviewTeam', methods=['GET', 'POST'])
def PreviewTeam():
    return render_template('/GetPreview/PreviewTeam.html')

@app.route('/Admin/Users', methods=['GET', 'POST'])
def Users():
    return render_template('/Admin/Users.html')

@app.route('/Admin/PasswordChange', methods=['GET', 'POST'])
def PasswordChange():
    return render_template('/Admin/PasswordChange.html')


@app.route('/Admin/User_Code', methods=['GET', 'POST'])
def User_Code_Show():
    user_Code = session.get('User_Code')
    return jsonify({'user_Code':user_Code})


@app.route('/Attachment', methods=['GET', 'POST'])
def GetAttactment():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        image_id = request.form.get("image_id")
        usage_data = Get_Attactment (server_name_1,db_name_1,UID,Pass,image_id)
        data_list=[]
        for rows in usage_data:
            text = rows['Image_Name']
            data_list.append({'text':text})
        return jsonify(data_list)
    except Exception as ex:
        return jsonify({'text':str(ex)})

@app.route('/OTS/Connections',methods=['GET', 'POST'])
def OTS_Connection():
    try:
        OTS_Result = Server_details()
        server_name = OTS_Result[0]['server_name']
        login_id = OTS_Result[0]['login_id']
        password = OTS_Result[0]['password']
        db_name = OTS_Result[0]['db_name']
        data_list = []
        data_list.append({'server_name':server_name,'login_id':login_id,'password':password,'db_name':db_name})
        return jsonify(data_list)
    except Exception as ex:
        return jsonify(str(ex))

@app.route('/Login',methods=['GET', 'POST'])
def LoginPage():
    try:
        if request.method == "POST":
            server_name = request.form.get('server_name')
            db_name = request.form.get('db_name')
            UserName = request.form.get('UserName')
            Password_Login = request.form.get('Password_Login')
            OTS_Result = Server_details()
            UserId = OTS_Result[0]['login_id']
            Pass = OTS_Result[0]['password']
            hashed_password = hashlib.sha256((Password_Login).encode()).hexdigest()
            LoginDetails = MainServerName.Login(server_name,db_name,UserId,Pass,UserName,hashed_password)
            
            User_Code = ""
            Password = ""

            for rows in LoginDetails:
                User_Code =rows[0]
                Password = rows[1]
            if (User_Code == UserName and Password == hashed_password):
                
                session['User_Code'] = User_Code
                session['server_name'] = server_name
                session['UserId'] = UserId
                session['Pass'] = Pass
                session['db_name'] = db_name
                
                resp = Response(render_template('Home.html'))
                resp.set_cookie('User_Code', User_Code)
                resp.set_cookie('server_name', server_name)
                resp.set_cookie('UserId', str(UserId))
                resp.set_cookie('Pass', Pass)
                resp.set_cookie('db_name', db_name)
                
                return resp
            else:
                return render_template('Index.html')
    except Exception as ex:
        return jsonify(str(ex))
    

@app.route('/GetTeams/GetTeamList', methods=['GET', 'POST'])
def GetTeamList():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        usage_data = GetTeamListData(server_name_1,db_name_1,UID,Pass)
        return jsonify({"data": usage_data})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    

@app.route('/GetTeams/GetTeamPlayer', methods=['GET', 'POST'])
def PlayersList():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        team_id = request.form.get('team_id')
        usage_data,column = Player_List(server_name_1,db_name_1,UID,Pass,team_id)
        return jsonify({"data": usage_data,'column':column})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    

@app.route('/GetTeams/NewTeam', methods=['GET', 'POST'])
def NewTeam():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        json_type = "Add_Teams"
        data = APICalling.GetTeamList_Insert(server_name_1,db_name_1,UID,Pass,user_code,json_type)
        for rows in data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})
    except Exception as ex:
        return jsonify({'ErrorCode':'-999','Error_Name':str(ex)})
    
# @app.route('/GetTeams/Team_Flag', methods=['GET', 'POST'])
# def Team_Flag():
#     try:
#         server_name_1 = session.get('server_name')
#         db_name_1 = session.get('db_name')
#         UID = session.get('UserId')
#         Pass = session.get('Pass')
#         user_code = session.get('User_Code')
#         team_id = request.form.get('team_id')
#         fileInput = request.files.getlist('fileInput') 
#         tp = request.form.get('tp')
#         # filepaths = []
#         data_list = []

#         # for photo in fileInput:
#         #     name = team_id + '_' + datetime.now().strftime("%Y%m%d_%H%M%S") + '.jpg'
#         #     filepath = os.path.join(os.environ["userprofile"], 'AppData', 'Cricket', 'Images', 'Flag')

#         #     if not os.path.exists(filepath):
#         #         os.makedirs(filepath)
#         #         subprocess.run(['cacls', filepath, '/E', '/G', 'Everyone:F'], check=True)

#         #     photo.save(os.path.join(filepath, name))
#         #     filepaths.append(os.path.join(filepath, name).replace('\\','/'))
#         #     #data_list.append({'Error_Code': 0, 'Error_Name': filepaths})

#         data = uploadTeamFlag(server_name_1, db_name_1, UID, Pass, fileInput, team_id, user_code,tp)

#         for rows in data:
#             error_code = rows['Error_Code']
#             error_name = rows['Error_Name']
#             data_list.append({'Error_Code': error_code, 'Error_Name': error_name})

#         return jsonify(data_list)

#     except Exception as ex:
#         return jsonify({'Error_Code': -999, 'Error_Name': str(ex)})
    

@app.route('/GetTeams/GetPlayer_Info', methods=['GET', 'POST'])
def GetPlayer_Info():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        player_id = request.form.get('player_id')
        usage_data,column = Player_Info(server_name_1,db_name_1,UID,Pass,player_id)
        return jsonify({"data": usage_data,'column':column})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    
@app.route('/GetTeams/AddPlayer_Info', methods=['GET', 'POST'])
def AddPlayer_Info():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        player_id = request.form.get('player_id')
        user_code = session.get('User_Code')
        data = APICalling.Call_API_Insert_Player_Info(server_name_1,db_name_1,UID,Pass,player_id,user_code)
        for rows in data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})
    except Exception as ex:
        return jsonify({'text':str(ex)})
    
@app.route('/GetTeams/AddPlayer', methods=['GET', 'POST'])
def AddPlayer():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        team_id = request.form.get('team_id')
        user_code = session.get('User_Code')
        data = APICalling.Call_API_Insert_Player(server_name_1,db_name_1,UID,Pass,team_id,user_code)
        for rows in data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})
    except Exception as ex:
        return jsonify({'text':str(ex)})

@app.route('/GetMatch/MatchType', methods=['GET', 'POST'])
def matchType():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        data_list = []
        usage_data = GetMatchType (server_name_1,db_name_1,UID,Pass)
        for rows in usage_data:
            text = rows['text']
            value = rows['text']
            data_list.append({'text':text,'value':value})
        return jsonify(data_list)
    except Exception as ex:
        return jsonify({'text':str(ex)})

@app.route('/GetMatch/NewMatch', methods=['GET', 'POST'])
def NewMatch():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        data = APICalling.Get_Match_List_Insert(server_name_1,db_name_1,UID,Pass,user_code)
        for rows in data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})
    except Exception as ex:
        return jsonify({'ErrorCode':'-999','Error_Name':str(ex)})


@app.route('/GetMatch/GetMatchList', methods=['GET', 'POST'])
def GetMatchList():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_type = request.form.get('match_type')
        usage_data, column_names = GetmatchListData(server_name_1,db_name_1,UID,Pass,match_type)
        return jsonify({"data": usage_data,"columns": column_names})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    
@app.route('/GetMatch/GetMatchList/GetMatchHeader', methods=['GET', 'POST'])
def Get_matchHeader():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_id = request.form.get('match_id')
        usage_data, column_names = GetMatchHeader(server_name_1,db_name_1,UID,Pass,match_id)
        return jsonify({"data": usage_data,"columns": column_names})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
       

@app.route('/GetMatch/GetMatchList/GetBatterDetails', methods=['GET', 'POST'])
def Get_Batter():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_id = request.form.get('match_id')
        team_id = request.form.get('team_id')
        usage_data, column_names = GetBatterDetails(server_name_1,db_name_1,UID,Pass,match_id,team_id)
        return jsonify({"data": usage_data,"columns": column_names})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    
@app.route('/GetMatch/GetMatchList/GetBowlerDetails', methods=['GET', 'POST'])
def Get_Bowler():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_id = request.form.get('match_id')
        team_id = request.form.get('team_id')
        usage_data, column_names = GetBowlerDetails(server_name_1,db_name_1,UID,Pass,match_id,team_id)
        return jsonify({"data": usage_data,"columns": column_names})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    
@app.route('/GetMatch/GetMatchList/Scoreupdate', methods=['GET', 'POST'])
def Scoreupdate():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_id = request.form.get('match_id')
        user_code = session.get('User_Code')
        data = APICalling.Add_Recent_Match_List(server_name_1,db_name_1,UID,Pass,user_code,match_id)
        for rows in data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})
    except Exception as ex:
        return jsonify({'text':str(ex)})
        
@app.route('/GetMatch/GetScheduleMatch', methods=['GET', 'POST'])
def Get_Schedule_Match():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        mt = request.form.get('mt')
        usage_data, column_names = GetScheduleMatch(server_name_1,db_name_1,UID,Pass,mt)
        return jsonify({"data": usage_data,"columns": column_names})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    

@app.route('/GetMatch/GetScheduleMatch/GetScheduleMatchList', methods=['GET', 'POST'])
def GetScheduleMatchList():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        Error_Code = ""
        Error_Name = ""
        data = APICalling.Get_Schedule_Match_List(server_name_1,db_name_1,UID,Pass,user_code)
        #return jsonify({'data':data})
        for rows in data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})

    except Exception as ex:
        return jsonify({'Error_Name':str(ex)})
    
@app.route('/GetMatch/GetScheduleMatch/GetPlayerCategory', methods=['GET', 'POST'])
def GetPlayerCategory():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        data_list = []
        usage_data = Get_Player_Category(server_name_1,db_name_1,UID,Pass)
        for rows in usage_data:
            text = rows['text']
            data_list.append({'text':text})
        return jsonify(data_list)
    except Exception as ex:
        return jsonify({'text':str(ex)})
    

@app.route('/GetMatch/GetScheduleMatch/GetPlayerwithCategory', methods=['GET', 'POST'])
def GetPlayerwithCategory():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_id = request.form.get('match_id')
        category = request.form.get('category')
        user_code = session.get('User_Code')
        usage_data = Get_Playerinfowith_Category(server_name_1,db_name_1,UID,Pass,match_id,category,user_code)
        return jsonify({"data": usage_data})
    except Exception as ex:
        return jsonify({'data':'1','column':str(ex)})


@app.route('/GetMatch/GetScheduleMatch/GetLoginInfowithCredits', methods=['GET', 'POST'])
def GetPlayerInfowithCredits():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        match_id = request.form.get('match_id')
        data,column_names = MainServerName.Login_Details(server_name_1,db_name_1,UID,Pass,match_id,user_code)    
        return jsonify({'data':data,'columns':column_names})
    except Exception as ex:
        return jsonify({'data':str(ex)})
    

@app.route('/GetMatch/GetScheduleMatch/SelectedPlayer', methods=['GET', 'POST'])
def SelectedPlayer():
    try:
        data = request.get_json()
        json_string = json.dumps(data)
        # match_id = data['match_id']
        # player_id = data['player_id']
        # player_name = data['player_name']
        # points = data['points']
        # credit_points = data['credit_points']
        # balance_points = data['balance_points']
        # player_type = data['player_type']
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        error = data_insert.Insert_Selected_Player(server_name_1, db_name_1, UID, Pass, json_string,user_code)
        
        for rows in error:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        
        return jsonify({'Error_Code': Error_Code, 'Error_Name': Error_Name})
    
    except Exception as ex:
        return jsonify({'Error_Name': str(ex)}) 


@app.route('/GetMatch/GetScheduleMatch/GetShowHideButtonAddTeam', methods=['GET', 'POST'])
def GetShowHideButtonAddTeam():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        match_id = request.form.get('match_id')
        data,column_names = Get_Show_Hide_Button_Add_Team(server_name_1,db_name_1,UID,Pass,match_id,user_code)    
        return jsonify({'data':data,'columns':column_names})
    except Exception as ex:
        return jsonify({'data':str(ex)})
    
@app.route('/PreviewTeam/ShowPreviewTeam', methods=['GET', 'POST'])
def ShowPreviewTeam():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        usage_data, column_names = Get_Preview_Team(server_name_1,db_name_1,UID,Pass,user_code)
        return jsonify({"data": usage_data,"columns": column_names})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','GetCol':str(ex)})
    

@app.route('/PreviewTeam/ShowPreviewTeamPlayer', methods=['GET', 'POST'])
def ShowPreviewTeamPlayer():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        match_id = request.form.get('match_id')
        usage_data = Get_Preview_Team_Player(server_name_1,db_name_1,UID,Pass,match_id,user_code)
        # for rows in usage_data:
        #     Player_Id = rows['Player_Id']
        #     Player_Name = rows['Player_Name']
        #     Player_Images = rows['Player_Images']
        #     VCaptain = rows['VCaptain']
        #     Captain = rows['Captain']
        #     Category = rows['Category']
        #     data_list.append({'Player_Id':Player_Id,'Player_Name':Player_Name,'Player_Image':Player_Images,'VCaptain':VCaptain,
        #                         'Captain':Captain,'Category':Category})

        return jsonify({'usage_data':usage_data})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','usage_data':str(ex)})
    

@app.route('/PreviewTeam/ShowPreviewTeamPlayer_Points', methods=['GET', 'POST'])
def ShowPreviewTeamPlayer_Points():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        user_code = session.get('User_Code')
        match_id = request.form.get('match_id')
        usage_data, column_names = Get_Preview_Team_Player_Points(server_name_1,db_name_1,UID,Pass,match_id,user_code)
        return jsonify({"data": usage_data,"columns": column_names})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','data':str(ex)})
    

@app.route('/Admin/AddUsers', methods=['GET', 'POST'])
def AddUsers():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        fname = request.form.get('fname')
        lname = request.form.get('lname')
        email = request.form.get('email')
        password= request.form.get('Pass')
        usage_data = data_insert.Insert_Users(server_name_1,db_name_1,UID,Pass,fname,lname,email,password)
        for rows in usage_data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','data':str(ex)})
    

@app.route('/Admin/UpdatePassword', methods=['GET', 'POST'])
def UpdatePassword():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        email = request.form.get('email')
        password= request.form.get('Pass')
        usage_data = data_insert.Update_Users_Password(server_name_1,db_name_1,UID,Pass,email,password)
        for rows in usage_data:
            Error_Code = rows['Error_Code']
            Error_Name = rows['Error_Name']
        return jsonify({'Error_Code':Error_Code,'Error_Name':Error_Name})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','data':str(ex)})
    

@app.route('/GetMatch/GetScheduleMatch/GetRandomTeamInsert', methods=['GET', 'POST'])
def GetRandomTeamInsert():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_type = request.form.get('match_type')
        user_code = session.get('User_Code')
        match_id = request.form.get('match_id')
        team_1 = request.form.get('team_1')
        team_2 = request.form.get('team_2')
        usage_data,column = data_insert.Insert_Random_Team_Generation(server_name_1,db_name_1,UID,Pass,match_type,user_code,match_id,team_1,team_2)
        return jsonify({'data':usage_data,'column':column})
    except Exception as ex:
        return jsonify({'ErrorCode':'1','data':str(ex)})
    

@app.route('/Home/AllTeamPoints', methods=['GET', 'POST'])
def AllTeamPoints():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        usage_data,column = Get_All_Teams_Point(server_name_1,db_name_1,UID,Pass)
        return jsonify({'data':usage_data,'column':column})
    except Exception as ex:
        return jsonify({'data':'1','column':str(ex)})
    

@app.route('/GetMatch/GetScheduleMatch/GetMatchType_Schedule', methods=['GET', 'POST'])
def GetMatchType_Scheduled():
    try:
        server_name_1 = session.get('server_name')
        db_name_1 = session.get('db_name')
        UID = session.get('UserId')
        Pass = session.get('Pass')
        match_id = request.form.get('match_id')
        usage_data = GetMatchType_Schedule(server_name_1,db_name_1,UID,Pass,match_id)
        return jsonify({'data':usage_data})
    except Exception as ex:
        return jsonify({'data':'1','column':str(ex)})
    

if __name__ == "__main__":
    #app.run(host="192.168.1.40" ,port="8080",debug=True)
    app.run(debug=False,host="0.0.0.0")