# setup_db.ps1
# Automated PostgreSQL setup script for KrishiOne v2

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Green
Write-Host "  KrishiOne v2 - PostgreSQL Setup Script " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    $found = Get-Command psql.exe -ErrorAction SilentlyContinue
    if ($found) {
        $psqlPath = $found.Source
    } else {
        Write-Host "Searching for psql.exe..." -ForegroundColor Yellow
        $search = Get-ChildItem "C:\Program Files\PostgreSQL" -Filter "psql.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($search) {
            $psqlPath = $search.FullName
        } else {
            Write-Host "Error: psql.exe not found. Please install PostgreSQL or add psql to PATH." -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "Found psql at: $psqlPath" -ForegroundColor Cyan

$env:PGPASSWORD = "admin"
$user = "postgres"
$hostName = "localhost"
$port = "5432"

Write-Host "Checking if database 'krishionedb' exists..." -ForegroundColor Yellow
$checkDb = & $psqlPath -U $user -h $hostName -p $port -t -A -c "SELECT 1 FROM pg_database WHERE datname='krishionedb';" 2>$null

if ($checkDb -ne "1") {
    Write-Host "Creating database 'krishionedb'..." -ForegroundColor Yellow
    & $psqlPath -U $user -h $hostName -p $port -c "CREATE DATABASE krishionedb;"
    Write-Host "Database 'krishionedb' created successfully!" -ForegroundColor Green
} else {
    Write-Host "Database 'krishionedb' already exists." -ForegroundColor Green
}

Write-Host "Running Flyway migrations via Maven..." -ForegroundColor Yellow
& .\mvnw.cmd flyway:migrate

Write-Host "======================================================" -ForegroundColor Green
Write-Host "  KrishiOne PostgreSQL setup completed successfully!  " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
