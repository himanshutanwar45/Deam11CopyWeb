import pyodbc,hashlib
from Classes.Connection import *

class data_insert:

    def Insert_Add_Match_List(server_name,database_name,sql_uid,sql_pass,json_string,user_code):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Add_Match_List ?,?",(json_string,user_code))
            data = cursor.fetchall()
            conn.commit()
            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name': rows[1]
                }
                data_list.append(data_dict)
        
            return data_list
        except Exception as ex:
            return str(ex)


    def Insert_Player_Info(server_name,database_name,sql_uid,sql_pass,json_string,player_id,user_code):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Add_Player_Info ?,?,?",(json_string,player_id,user_code))
            data = cursor.fetchall()
            conn.commit()
            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name': rows[1]
                }
                data_list.append(data_dict)
        
            return data_list
        except Exception as ex:
            return str(ex)
        

    def Insert_Player(server_name,database_name,sql_uid,sql_pass,json_string,team_id,user_code):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Add_Player_Data ?,?,?",(json_string,team_id,user_code))
            data = cursor.fetchall()
            conn.commit()
            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name': rows[1]
                }
                data_list.append(data_dict)
        
            return data_list
        except Exception as ex:
            return str(ex)
        
    def Insert_Schedule_Match(server_name,database_name,sql_uid,sql_pass,json_string,user_code):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Add_Schedule_Matches ?,?",(json_string,user_code))
            data = cursor.fetchall()
            conn.commit()
            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name': rows[1]
                }
                data_list.append(data_dict)
        
            return data_list
        except Exception as ex:
            return str(ex)
        

    def Insert_Score_Match(server_name,database_name,sql_uid,sql_pass,json_string,user_code):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Add_Score_Details ?,?",(json_string,user_code))
            data = cursor.fetchall()
            conn.commit()
            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name': rows[1]
                }
                data_list.append(data_dict)
        
            return data_list
        except Exception as ex:
            return str(ex)
        

    # def Insert_Selected_Player(server_name,database_name,sql_uid,sql_pass,match_id,player_id,player_name,user_code,credit_points,user_points,balance_points,player_type):
    #     try:
    #         conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
    #         cursor = conn.cursor()
    #         cursor.execute("EXEC Sp_Add_Team_Selected ?,?,?,?,?,?,?,?",(match_id,player_id,player_name,user_code,credit_points,user_points,balance_points,player_type))
    #         data = cursor.fetchall()
    #         conn.commit()
    #         data_list =[]
    #         for rows in data:
    #             data_dict = {
    #                 'Error_Code':rows[0],
    #                 'Error_Name':rows[1]
    #             }
    #             data_list.append(data_dict)
    #         return data_list
    #     except Exception as ex:
    #         return str(ex)
        
    def Insert_Selected_Player(server_name,database_name,sql_uid,sql_pass,data,user_code):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Add_Team_Selected ?,?",(data,user_code))
            data = cursor.fetchall()
            conn.commit()
            data_list =[]
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name':rows[1]
                }
                data_list.append(data_dict)
            return data_list
        except Exception as ex:
            return str(ex)
    

    def Insert_Users(server_name,database_name,sql_uid,sql_pass,fname,lname,email,password):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            hashed_password = hashlib.sha256((password).encode()).hexdigest()
            cursor.execute("EXEC Sp_Add_Users ?,?,?,?",(fname,lname,email,hashed_password))
            data = cursor.fetchall()
            conn.commit()
            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name': rows[1]
                }
                data_list.append(data_dict)
        
            return data_list
        except Exception as ex:
            return str(ex)


    def Update_Users_Password(server_name,database_name,sql_uid,sql_pass,email,password):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            hashed_password = hashlib.sha256((password).encode()).hexdigest()
            cursor.execute("EXEC Sp_Update_Users_Password ?,?",(email,hashed_password))
            data = cursor.fetchall()
            conn.commit()
            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code':rows[0],
                    'Error_Name': rows[1]
                }
                data_list.append(data_dict)
        
            return data_list
        except Exception as ex:
            return str(ex)        
        
    def Insert_Random_Team_Generation(server_name,database_name,sql_uid,sql_pass,match_type,user_Code,match_id,team_1,team_2):
        try:
            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Get_Random_Team_Generation ?,?,?,?,?",(match_type,user_Code,match_id,team_1,team_2))
            data = cursor.fetchall()
            conn.commit()
            column_names = [desc[0] for desc in cursor.description]
            data_list = []
            for rows in data:
                data_dict = dict(zip(column_names, rows))
                data_list.append(data_dict)
            return data_list,column_names
        except Exception as ex:
            return str(ex)