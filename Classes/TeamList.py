import pyodbc,base64
from Classes.Connection import *
from datetime import datetime
import os,subprocess

def process_image(rows):
    ImageData = rows
    if ImageData is None:
        return None  # Return None to represent null in the encoded image data
    ImageData = b"".join([ImageData])
    return base64.b64encode(ImageData).decode('utf-8')

def GetTeamListData(server_name,database_name,sql_uid,sql_pass):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_GetColumn")
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)
    

def Player_List(server_name,database_name,sql_uid,sql_pass,team_id):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute('''SELECT A.Player_Id,A.Player_Name,A.Team_Id,B.Image_URL FROM Get_Players A
                                LEFT JOIN Get_Players_Info B ON B.Player_Id = A.Player_Id
                                WHERE A.Team_Id = ?''',(team_id))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)
    

def Get_Attactment(server_name,database,sql_user,sql_pass,id):
    connecton_string = Connection.GetConnectionString(server_name,database,sql_user,sql_pass)
    conn = pyodbc.connect(connecton_string)
    cursor = conn.cursor()
    cursor.execute("SELECT Image_Name FROM Rest_Images WHERE Id = ?", (id))
    data = cursor.fetchall()
    data_list = []
    for rows in data:
        Images = process_image(rows[0])
        data_dict = {
            'Image_Name' : Images
        }
        data_list.append(data_dict)
    return data_list

def GetMatchType(server_name,database_name,sql_uid,sql_pass):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("SELECT Match_Type FROM Get_Match_List GROUP BY Match_Type")
        data = cursor.fetchall()
        data_list = []
        for rows in data:
            data_dict = {
                'text':rows[0]
            }
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)
    
def GetmatchListData(server_name,database_name,sql_uid,sql_pass,match_type):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_GetMatchList ?", (match_type))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)

# def uploadTeamFlag(server_name, database_name, sql_uid, sql_pass, photo_paths, team_id, user_code,tp):
#     # try:
#     #     conn = pyodbc.connect(Connection.GetConnectionString(server_name, database_name, sql_uid, sql_pass))
#     #     cursor = conn.cursor()
#     #     cursor.execute("EXEC SP_Add_Team_Flag @Path = ?,@Team_Id = ?,@User_Code = ?", (str(photo_paths).replace("'","").replace("[",'').replace("]",''), team_id, user_code))
#     #     data = cursor.fetchall()
#     #     conn.commit()
#     #     data_list = []
#     #     for rows in data:
#     #         data_dict = {
#     #             'Error_Code': rows[0],
#     #             'Error_Name': rows[1]
#     #         }
#     #         data_list.append(data_dict)
#     #     return data_list
#     # except Exception as ex:
#     #     return str(ex)

#     try:
#         filepaths = []
#         data_list = []
#         for photo in photo_paths:
#             name = team_id + '_' + datetime.now().strftime("%Y%m%d_%H%M%S") + '.jpg'
#             filepath = os.path.join(os.environ["userprofile"], 'AppData', 'Cricket', 'Images', 'Flag')

#             if not os.path.exists(filepath):
#                 os.makedirs(filepath)
#                 subprocess.run(['cacls', filepath, '/E', '/G', 'Everyone:F'], check=True)

#             photo.save(os.path.join(filepath, name))
#             filepaths.append(os.path.join(filepath, name).replace('\\','/'))
#             #data_list.append({'Error_Code': 0, 'Error_Name': filepaths})
#         conn = pyodbc.connect(Connection.GetConnectionString(server_name, database_name, sql_uid, sql_pass))
#         cursor = conn.cursor()
#         cursor.execute("EXEC SP_Add_Team_Flag @Path = ?,@Team_Id = ?,@User_Code = ?,@TP = ?", (str(filepaths).replace("'","").replace("[",'').replace("]",'')
#                                 , team_id, user_code,tp))
#         data = cursor.fetchall()
#         conn.commit()
#         data_list = []
#         for rows in data:
#             data_dict = {
#                 'Error_Code': rows[0],
#                 'Error_Name': rows[1]
#             }
#             data_list.append(data_dict)
#         os.remove(str(filepaths).replace("'","").replace("[",'').replace("]",''))
#         return data_list
#     except Exception as ex:
#         return str(ex)

    
# def GetColumnsName(server_name,database_name,sql_uid,sql_pass,table_name,user_Code):
#     try:
#         conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
#         cursor = conn.cursor()
#         cursor.execute("SELECT Column_Name,Check_Marks FROM Col_H_S  WHERE Table_Name = ? AND User_Code = ?",(table_name,user_Code))
#         data = cursor.fetchall()
#         data_list = []
#         for rows in data:
#             data_dict = {
#                 'text':rows[0],
#                 'value':rows[1]
#             }
#             data_list.append(data_dict)
#         return data_list
#     except Exception as ex:
#         return str(ex)
    

# def UpdateHideCol(server_name,database_name,sql_uid,sql_pass,column_name,table_name,Check_Marks,user_Code):
#     try:
#         conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
#         cursor = conn.cursor()
#         cursor.execute("EXEC Sp_Update_Hide_Col ?,?,?,?",(column_name,table_name,Check_Marks,user_Code))
#         data = cursor.fetchall()
#         conn.commit()
#         data_list = []
#         for rows in data:
#             data_dict = {
#                 'Error_Code':rows[0],
#                 'Error_Name':rows[1]
#             }
#             data_list.append(data_dict)
#         return data_list
#     except Exception as ex:
#         return str(ex)
    

def GetMatchHeader(server_name,database_name,sql_uid,sql_pass,Match_Id):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_Get_MatchHeader ?", (Match_Id))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)   

def GetBatterDetails(server_name,database_name,sql_uid,sql_pass,Match_Id,team_id):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_GetBatter_Details ?,?", (Match_Id,team_id))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)
    
def GetBowlerDetails(server_name,database_name,sql_uid,sql_pass,Match_Id,team_id):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_GetBowler_Details ?,?", (Match_Id,team_id))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)
    
def GetBowlerDetails(server_name,database_name,sql_uid,sql_pass,Match_Id,team_id):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_GetBowler_Details ?,?", (Match_Id,team_id))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)

    
def GetMatchId(server_name,database_name,sql_uid,sql_pass,match_type):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("SELECT TOP 1 Match_Id FROM Get_Match_List WHERE Match_Type = ? GROUP BY Match_Id ", (match_type))
        data = cursor.fetchall()
        data_list = []
        for rows in data:
            data_dict = {
                'match_Id':rows[0]
            }
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)
    

def Player_Info(server_name,database_name,sql_uid,sql_pass,player_id):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute('EXEC SP_Get_Player_Info ?',(player_id))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)


def GetScheduleMatch(server_name,database_name,sql_uid,sql_pass,match_type):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC SP_Get_Schedule_Match ?", (match_type))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)
    

def DeleteScheduleMatch(server_name,database_name,sql_uid,sql_pass):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_Delete_Schedule_Match")
        data = cursor.fetchall()
        data_list = []
        for rows in data:
            data_dict = {
                'Match_Type':rows[0]
            }
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)
    

def Get_Player_Category(server_name,database_name,sql_uid,sql_pass):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("SELECT Category FROM Get_Players GROUP BY Category")
        data = cursor.fetchall()
        data_list = []
        for rows in data:
            data_dict = {
                'text':rows[0]
            }
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)
    
def Get_Playerinfowith_Category(server_name,database_name,sql_uid,sql_pass,match_Id,category,user_code):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("Sp_Get_Playerwith_Category ?,?,?",(match_Id,category,user_code))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = {
                'Player_Id': rows[0],
                'Player_Name': rows[1],
                'Points': rows[2],
                'Category': rows[3],
                'Player_Image': rows[4],
                'Show_Hide':rows[5],
                'Match_Id':rows[6],
                'User_Code':rows[7],
                'Credit_Points':rows[8],
                'Used_Points':rows[9],
                'Balance_Points':rows[10],
                
            }
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)
    

def Get_Show_Hide_Button_Add_Team(server_name,database_name,sql_uid,sql_pass,match_Id,user_Code):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("SELECT A.* FROM Selected_Player A LEFT JOIN Login_Details B ON B.Id = A.Created_By WHERE Match_Id = ? AND B.User_Code = ?",(match_Id,user_Code))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)
    
def Get_Preview_Team(server_name,database_name,sql_uid,sql_pass,user_code):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute('''EXEC Sp_Get_PreviewTeam ?''',(user_code))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)

def Get_Preview_Team_Player(server_name,database_name,sql_uid,sql_pass,match_Id,user_code):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute('EXEC Sp_Get_Preview_Team_Player ?,?',(match_Id,user_code))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)
    

def Get_Preview_Team_Player_Points(server_name,database_name,sql_uid,sql_pass,match_Id,user_code):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute('EXEC Sp_Get_Player_Points ?,?',(match_Id,user_code))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)


def Get_All_Teams_Point(server_name,database_name,sql_uid,sql_pass):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute('EXEC Sp_Get_All_Team_Points')
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    except Exception as ex:
        return str(ex)



def GetMatchType_Schedule(server_name,database_name,sql_uid,sql_pass,match_id):
    try:
        conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
        cursor = conn.cursor()
        cursor.execute("SELECT Series_Category FROM Get_Scheduled_Match WHERE Match_Id = ?",(match_id))
        data = cursor.fetchall()
        data_list = []
        for rows in data:
            data_dict = {
                'Series_Category':rows[0]
            }
            data_list.append(data_dict)
        return data_list
    except Exception as ex:
        return str(ex)