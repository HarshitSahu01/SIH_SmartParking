import psycopg2

def main():
    # Connect to the defaultdb database
    conn = psycopg2.connect('postgres://avnadmin:AVNS_3ZPSlczKfQaUIwKrJFX@sih-project-db-sih-project.b.aivencloud.com:22448/defaultdb?sslmode=require')

    # Query to list all tables in the public schema of defaultdb
    query_sql = """
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
    """

    # Create a cursor object and execute the query
    cur = conn.cursor()
    cur.execute(query_sql)

    # Fetch all results
    tables = cur.fetchall()

    # Print the list of tables
    for table in tables:
        print(table[0])

    # Close the cursor and connection
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
