
class Connection:
    def GetConnectionString(server_name,database,sql_user,sql_pass):
        driver = "{SQL Server Native Client 11.0}"
        conn ="Driver="+driver + ";SERVER="+server_name+ ";DATABASE="+database+ ";UID="+sql_user+ ";PWD="+sql_pass
        return conn
    
    def Getserver_name():
        driver = "{SQL Server Native Client 11.0}"
        server_name = "localhost"
        database = "master"
        conn ="Driver="+driver + ";SERVER="+server_name+ ";DATABASE="+database+ ";Trusted_Connection=yes;"
        return conn