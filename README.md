# FastAPI Backend Project

This repository contains a FastAPI-based backend application with user authentication, WebSocket support, and Elasticsearch integration.

## Project Structure

```
└── 📁backend
    └── 📁app
        └── __init__.py
        └── config.py           # Application configuration settings
        └── database.py         # SQLAlchemy setup and database connection
        └── main.py             # Application entry point
        └── 📁auth
            └── jwt.py          # JWT token handling
            └── utils.py        # Authentication utilities
        └── 📁elastic
            └── es_client.py    # Elasticsearch client configuration
        └── 📁models
            └── user.py         # SQLAlchemy User model
        └── 📁repositories
            └── user_repository.py  # Data access layer for users
        └── 📁routes
            └── auth.py         # Authentication endpoints
            └── chat_logs.py    # Chat logging endpoints  
            └── users.py        # User-related endpoints
            └── websocket.py    # WebSocket connection handling
        └── 📁schemas
            └── token.py        # Pydantic token models
            └── user.py         # Pydantic user models
        └── 📁services
            └── chat_logger.py  # Chat logging service
            └── user_service.py # User business logic
            └── websocket_manager.py  # WebSocket connection management
    └── 📁test
        └── test.html          # Simple test file for WebSocket
    └── 📁venv                 # Python virtual environment
```

## Components Overview

### Core Files
- **config.py**: Contains application settings like database URLs, API keys, etc.
- **database.py**: Sets up SQLAlchemy connection, sessions, and initialization.
- **main.py**: Application entry point that initializes FastAPI and registers routes.

### Data Layer
- **models/**: SQLAlchemy ORM models defining database structure
- **schemas/**: Pydantic models for data validation and serialization
- **repositories/**: Data access layer for database operations

### Business Logic
- **services/**: Contains business logic separated from routing concerns
- **auth/**: Authentication and authorization mechanisms

### API Layer
- **routes/**: API endpoints organized by resource or feature

### Integrations
- **elastic/**: Elasticsearch integration for advanced search capabilities

## Setup

### 1. Prerequisites

Before starting the application, ensure you have the following prerequisites installed:

- Python 3.10+ 
- MySQL Server
- Docker (for Elasticsearch)

### 2. Start Elasticsearch

**Important:** Elasticsearch must be running before starting the application, as the WebSocket functionality depends on it.

```bash
# Start Elasticsearch using Docker with security disabled
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -e "xpack.security.http.ssl.enabled=false" -e "xpack.security.transport.ssl.enabled=false" elasticsearch:8.11.1

# Wait for approximately 1 minute for Elasticsearch to fully initialize

# Verify Elasticsearch is running
curl -X GET "http://localhost:9200"
```

This command explicitly disables security features that could prevent connections. Wait at least one minute after starting the container before trying to connect to allow Elasticsearch to fully initialize.

### 3. Set Up Python Environment

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment

Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=mysql+mysqlconnector://root:password@localhost/mydb
JWT_SECRET=your_jwt_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SECRET_KEY=your_app_secret_key
ELASTIC_URL=http://127.0.0.1:9200
```

Replace the values with your actual configuration.

### 5. Database Setup

The application will automatically create the necessary tables on startup. If you need to manually create the users table in MySQL, you can use the following SQL:

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active TINYINT(1) DEFAULT 1,
    is_admin TINYINT(1) DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (username),
    INDEX (email)
);
```

### 6. Run the Application

```bash
python run.py
```

## API Documentation

Once running, access the auto-generated API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing WebSocket Functionality

To test the WebSocket functionality:

1. Ensure Elasticsearch is running (see step 2 above)
2. Start the FastAPI application
3. Open `test/test.html` in a web browser using a live server
   - In VS Code, you can use the "Live Server" extension
   - Right-click on test.html and select "Open with Live Server"
4. In the test page:
   - Enter a username and room name
   - Click "Connect" to establish the WebSocket connection
   - Send some test messages using the form
   - Messages should appear in the chat log area

Note: You need to send messages through the WebSocket interface first to generate data that can be queried in Elasticsearch.

## Elasticsearch Integration

This project uses Elasticsearch for chat message logging and searching.

### Working with Elasticsearch Data

1. List all indices:
   ```bash
   curl -X GET "http://localhost:9200/_cat/indices?v"
   ```

2. Query the chat logs:
   ```bash
   curl -X GET "http://localhost:9200/chat_logs/_search?pretty" -H "Content-Type: application/json" -d'
   {
     "query": {
       "match_all": {}
     },
     "size": 10,
     "sort": [{"timestamp": {"order": "desc"}}]
   }'
   ```

3. Delete all chat logs (if needed):
   ```bash
   curl -X DELETE "http://localhost:9200/chat_logs"
   ```

4. Use the search API endpoint:
   The application provides a search endpoint to query chat messages:
   ```
   GET /search?room={roomname}&query={keyword}
   ```
   
   Parameters:
   - `room`: The name of the chat room to search in
   - `query`: The keyword or text to search for in messages
   
   Example:
   ```
   http://localhost:8000/search?room=general&query=hello
   ```
   
   This endpoint will return messages containing "hello" in the "general" room as a JSON array.

### Testing the Elasticsearch Integration

You can test if Elasticsearch is working properly with the API:

1. First, use the WebSocket interface to send some test messages in a room
2. Then use the `/search` endpoint to search for those messages:
   - Open in browser: `http://localhost:8000/search?room=yourroom&query=yoursearchterm`
   - Or use curl: `curl "http://localhost:8000/search?room=yourroom&query=yoursearchterm"`
3. You can also test the API through the Swagger documentation at `http://localhost:8000/docs`

## Troubleshooting

### Elasticsearch Connection Issues

If you see errors like `ConnectionError` or `Empty reply from server` when trying to connect to Elasticsearch, try these steps:

1. **Verify Elasticsearch is running**:
   ```bash
   docker ps | grep elasticsearch
   ```
   If it's not listed, it might have failed to start.

2. **Check Elasticsearch logs**:
   ```bash
   docker logs elasticsearch
   ```
   Look for error messages that might indicate what's wrong.

3. **Common solutions**:
   - **Memory issues**: Try running with explicit memory limits
     ```bash
     # Remove existing container first
     docker rm elasticsearch
     
     # Run with lower memory settings
     docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" elasticsearch:8.11.1
     ```
   
   - **Try an older version**: Version 7.x is sometimes more stable
     ```bash
     docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" elasticsearch:7.17.9
     ```

   - **Update your .env file** if you changed the Elasticsearch port or host

4. **Verify the connection** after fixing:
   ```bash
   curl -X GET "http://localhost:9200"
   ```
   You should see JSON output with Elasticsearch version information.

### WebSocket Issues

If the WebSocket connection fails:

1. Make sure you're using a live server to serve test.html
2. Check that Elasticsearch is running properly
3. Ensure your browser supports WebSockets
4. Check the browser console for any JavaScript errors