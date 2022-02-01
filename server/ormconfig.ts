module.exports = {
	"name": "default",
	"type": "postgres",
	"host": "localhost",
	"port": 5432,
	"username": "hlsvideo",
	"password": "hlsvideo",
	"database": "hlsvideo",
	"uuidExtension": "pgcrypto",
	"entities": ["src/*/entity/*.ts"],
	"synchronize": true,
	"dropSchema": true
}