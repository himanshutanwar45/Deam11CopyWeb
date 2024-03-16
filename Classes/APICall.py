import requests,pyodbc
import json
from Classes.Connection import *
from Classes.TeamList import *
from Classes.Insert_Data import *

class APICalling:
    
    def GetTeamList_Insert(server_name,database_name,sql_uid,sql_pass,user_code,json_type):
        
        url = "https://cricbuzz-cricket.p.rapidapi.com/teams/v1/international"
        
        headers = {
            "X-RapidAPI-Key": "29512396b7mshe929e99a9e90e35p19d451jsnc45aae40a05d",
            "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            with open('scorecard.json','w') as file:
                json_data = json.dump(response.json(),file, indent=4)  
                
            json_string = json.dumps(response.json())

            conn = pyodbc.connect(Connection.GetConnectionString(server_name,database_name,sql_uid,sql_pass))
            cursor = conn.cursor()
            cursor.execute("EXEC Sp_Add_Json ?,?,?",(json_string,user_code,json_type))

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
        else:
            return response.status_code
        

    def Get_Match_List_Insert(server_name,database_name,sql_uid,sql_pass,user_code):
        
        url = "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent"
        
        headers = {
            "X-RapidAPI-Key": "29512396b7mshe929e99a9e90e35p19d451jsnc45aae40a05d",
            "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            with open('scorecard.json','w') as file:
                json_data = json.dump(response.json(),file, indent=4)  
                
            json_string = json.dumps(response.json())

            data = data_insert.Insert_Add_Match_List(server_name,database_name,sql_uid,sql_pass,json_string,user_code)

            data_list = []
            for rows in data:
                data_dict = {
                    'Error_Code': rows['Error_Code'],
                    'Error_Name':  rows['Error_Name']
                }
                data_list.append(data_dict)
           
            return data_list
        else:
            return response.status_code    

    def Call_API_Insert_Player_Info(server_name,database_name,sql_uid,sql_pass,player_id,user_code):
        try:
            url = f"https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/{player_id}"
        
            headers = {
                "X-RapidAPI-Key": "29512396b7mshe929e99a9e90e35p19d451jsnc45aae40a05d",
                "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                with open('scorecard.json','w') as file:
                    json_data = json.dump(response.json(),file, indent=4)  
                
            json_string = json.dumps(response.json())
            data_list = []
            data = data_insert.Insert_Player_Info(server_name,database_name,sql_uid,sql_pass,json_string,player_id,user_code)
            for rows in data:
                data_dict = {
                    'Error_Code' : rows['Error_Code'],
                    'Error_Name' : rows['Error_Name']
                }
                data_list.append(data_dict)
            return data_list
        except Exception as ex:
            return str(ex)
        
    def Call_API_Insert_Player(server_name,database_name,sql_uid,sql_pass,team_id,user_code):
        try:
            url = f"https://cricbuzz-cricket.p.rapidapi.com/teams/v1/{team_id}/players"
        
            headers = {
                "X-RapidAPI-Key": "29512396b7mshe929e99a9e90e35p19d451jsnc45aae40a05d",
                "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers)

            if response.status_code == 200:

                cricket_team = response.json()
                current_category = None
                for player in cricket_team['player']:
                    if player['name'] == 'BATSMEN':
                        current_category = 'BATSMEN'
                    elif player['name'] == 'ALL ROUNDER':
                        current_category = 'ALL ROUNDER'
                    elif player['name'] == 'WICKET KEEPER':
                        current_category = 'WICKET KEEPER'
                    elif player['name'] == 'BOWLER':
                        current_category = 'BOWLER'
                    else:
                        player['category'] = current_category
                    
                    player['teamId'] = team_id
                        
                with open('scorecard.json', 'w') as file:
                    json.dump(cricket_team, file, indent=2)
                    
                # with open('scorecard.json','w') as file:
                #     json_data = json.dump(response.json(),file, indent=4)  
                
                json_string = json.dumps(cricket_team)
                data_list = []
                data = data_insert.Insert_Player(server_name,database_name,sql_uid,sql_pass,json_string,team_id,user_code)
                for rows in data:
                    data_dict = {
                        'Error_Code' : rows['Error_Code'],
                        'Error_Name' : rows['Error_Name']
                    }
                    data_list.append(data_dict)
                return data_list
            else:
                data_list = []
                data_dict = {
                    'Error_Code':response.status_code,
                    'Error_Name':'Error in json from API'
                }
                data_list.append(data_dict)
                return data_list
        except Exception as ex:
            return str(ex)
    
    
    
    def Get_Schedule_Match_List(server_name, database_name, sql_uid, sql_pass, user_code):
        data_list_1 = []
        deleteScheduleData = DeleteScheduleMatch(server_name, database_name, sql_uid, sql_pass)

        for rows in deleteScheduleData:
            Match_Type = rows['Match_Type']

            url = f"https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/{Match_Type}"
            headers = {
                "X-RapidAPI-Key": "29512396b7mshe929e99a9e90e35p19d451jsnc45aae40a05d",
                "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                with open('scorecard.json', 'w') as file:
                    json.dump(response.json(), file, indent=4)
                json_string = json.dumps(response.json())

                data = data_insert.Insert_Schedule_Match(server_name,database_name,sql_uid,sql_pass,json_string,user_code)
                for rows in data:
                    data_dict = {
                        'Error_Code' : rows['Error_Code'],
                        'Error_Name' : rows['Error_Name']
                    }
                    data_list_1.append(data_dict)
            else:
                data_list_1.append({'Error_Code': response.status_code,'Error_Name':'Json error from the API side'})

        return data_list_1
    
    def Add_Recent_Match_List(server_name, database_name, sql_uid, sql_pass, user_code,match_id):
        try:
            url = f"https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/{match_id}/hscard"
        
            headers = {
                "X-RapidAPI-Key": "29512396b7mshe929e99a9e90e35p19d451jsnc45aae40a05d",
                "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                with open('scorecard.json','w') as file:
                    json_data = json.dump(response.json(),file, indent=4)  
                
            json_string = json.dumps(response.json())
            data_list = []
            data = data_insert.Insert_Score_Match(server_name,database_name,sql_uid,sql_pass,json_string,user_code)
            for rows in data:
                data_dict = {
                    'Error_Code' : rows['Error_Code'],
                    'Error_Name' : rows['Error_Name']
                }
                data_list.append(data_dict)
            return data_list
        except Exception as ex:
            return str(ex)


        