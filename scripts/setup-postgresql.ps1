$databaseName = "fullstack_ec2"
$databaseUser = "postgres"
$databasePassword = "postgres"

Write-Host "Create the PostgreSQL database if it does not already exist."
Write-Host "Use the official PostgreSQL installer for Windows Server, then run:"
Write-Host "psql -U postgres -c \"CREATE DATABASE $databaseName;\""
Write-Host "psql -U postgres -d $databaseName -c \"CREATE TABLE IF NOT EXISTS public.\"\"Todos\"\" (\"\"Id\"\" SERIAL PRIMARY KEY, \"\"Title\"\" VARCHAR(200) NOT NULL, \"\"Description\"\" VARCHAR(1000), \"\"IsComplete\"\" BOOLEAN NOT NULL DEFAULT FALSE, \"\"CreatedAt\"\" TIMESTAMPTZ NOT NULL DEFAULT NOW(), \"\"UpdatedAt\"\" TIMESTAMPTZ NOT NULL DEFAULT NOW());\""
Write-Host "Connection string: Host=localhost;Database=$databaseName;Username=$databaseUser;Password=$databasePassword;Port=5432"
