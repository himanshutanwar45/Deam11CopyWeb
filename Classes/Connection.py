
class Connection:
    def GetConnectionString(server_name,database,sql_user,sql_pass):
        #driver = "{SQL Server Native Client 11.0}"
        driver = "{SQL Server}"
        conn ="Driver="+driver + ";SERVER="+server_name+ ";DATABASE="+database+ ";UID="+sql_user+ ";PWD="+sql_pass
        return conn
    
    def Getserver_name():
        driver = "{SQL Server}"
        server_name = "34.131.20.56"
        database = "master"
        sql_user = "sqlserver"
        sql_pass = "sa@2019"
        conn ="Driver="+driver + ";SERVER="+server_name+ ";DATABASE="+database+ ";UID="+sql_user+ ";PWD="+sql_pass
        return conn