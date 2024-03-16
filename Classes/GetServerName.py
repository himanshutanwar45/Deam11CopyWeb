from Classes.Connection import Connection
import pyodbc,hashlib


class getservername:
    connection_string = Connection.Getserver_name()

    def GetConnectiondetails():
        conn = pyodbc.connect(getservername.connection_string)
        cursor = conn.cursor()
        cursor.execute("SELECT TOP 1 Server_Name,Login_Id,CAST(DECRYPTBYPASSPHRASE('RepoDB',Password) AS nvarchar(MAX)) AS Password,Db_Name FROM CricketDB.DBO.Connection_Table ORDER BY Updated_Date,Updated_Time DESC")
        data = cursor.fetchall()
        data_list = []
        for rows in data:
            data_dict = {
                'server_name': rows[0],
                'login_id': rows[1],
                'password': rows[2],
                'db_name':rows[3]
            }
            data_list.append(data_dict)
        return data_list
     
    def Login(server_name,database,sql_user,sql_pass,User_Code,Password):
        connecton_string = Connection.GetConnectionString(server_name,database,sql_user,sql_pass)
        conn = pyodbc.connect(connecton_string)
        cursor = conn.cursor()  
        cursor.execute("EXEC Sp_Get_Login ?,?",(User_Code,Password))
        data = cursor.fetchall()
        data_list = []
        for rows in data:
            User_Name = rows[0]
            password = rows[1]
            data_list.append([User_Name,password])
        return data_list
    

    def Login_Details(server_name,database,sql_user,sql_pass,match_id,User_Code):
        connecton_string = Connection.GetConnectionString(server_name,database,sql_user,sql_pass)
        conn = pyodbc.connect(connecton_string)
        cursor = conn.cursor()
        cursor.execute("EXEC Sp_Get_Credit_Points ?,?",(match_id,User_Code))
        data = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        data_list = []
        for rows in data:
            data_dict = dict(zip(column_names, rows))
            data_list.append(data_dict)
        return data_list,column_names
    

    
    
