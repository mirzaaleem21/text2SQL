from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import psycopg2
import os
from dotenv import load_dotenv
from db import get_table_schema
from db import get_db_connection, get_table_schema


# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
print("Loaded OpenAI Key:", openai.api_key)

# Define the FastAPI app
app = FastAPI()

# Allow frontend access (adjust origins if deploying)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request schema
class QueryRequest(BaseModel):
    question: str

# Connect to PostgreSQL
try:
    conn = psycopg2.connect(
        dbname="text2sql",
        user="mirza",
        password="6702",  # Replace with actual password
        host="localhost",
        port="5433"        # Use 5432 if not custom
    )
    cursor = conn.cursor()
except Exception as e:
    print("❌ Error connecting to PostgreSQL:", e)
    raise

@app.post("/query")
async def query_sql(query: QueryRequest):
    schema = get_table_schema()
    formatted_schema = "\n".join([f"{table}: {', '.join(cols)}" for table, cols in schema.items()])

    prompt = f"""
    Given the following PostgreSQL schema:
    {formatted_schema}

    Convert this question into an SQL query:
    {query.question}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        sql = response['choices'][0]['message']['content'].strip()

        # Execute SQL
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]

        cur.close()
        conn.close()

        results = [dict(zip(colnames, row)) for row in rows]

        return {"sql": sql, "results": results}

    except Exception as e:
        return {"error": str(e)}
