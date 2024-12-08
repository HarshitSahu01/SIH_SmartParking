import psycopg2

def main():
    # Connect to the defaultdb database
    conn = psycopg2.connect('postgres://avnadmin:AVNS_YsgNZifDAQO7P99Z-Ds@sih-project-db-sih-project.i.aivencloud.com:22448/defaultdb?sslmode=require')
    # Query to list all tables in the public schema of defaultdb
    # query_sql = """
    # SELECT * from pg
    # """
    # Query to list all tables in the public schema of defaultdb except 'django_migrations'
    query_sql = """
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
    --SELECT * from django_migrations;
    """

#     query_sql = '''
# DROP SCHEMA public CASCADE;
# CREATE SCHEMA public;
# '''

    # Create a cursor object and execute the query
    cur = conn.cursor()
    cur.execute(query_sql)

    # Fetch all results
    tables = cur.fetchall() if cur.rowcount > 0 else None
    # tables = []  

    # Check if there are any results
    if tables:
        # Print the list of tables
        for table in tables:
            print(table)
    else:
        print("No tables found.")

    # Close the cursor and connection
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
