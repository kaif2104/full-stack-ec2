param(
    [string]$ProjectPath = "C:\workspace\full-stack-ec2\backend\FullStack.Api",
    [string]$PublishPath = "C:\services\FullStackApi"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ProjectPath)) {
    throw "Project path not found: $ProjectPath"
}

New-Item -ItemType Directory -Path $PublishPath -Force | Out-Null

dotnet publish "$ProjectPath\FullStack.Api.csproj" -c Release -o $PublishPath

Write-Host "API published to: $PublishPath"
Write-Host "Use the IIS setup script to point the site at this folder."
