param(
    [string]$FrontendPath = "C:\workspace\full-stack-ec2\frontend",
    [string]$DeployPath = "C:\inetpub\wwwroot\fullstack-ec2\frontend"
)

$ErrorActionPreference = "Stop"

Set-Location $FrontendPath
npm install
npm run build

New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
Copy-Item "$FrontendPath\dist\*" $DeployPath -Recurse -Force

Write-Host "Frontend deployed to: $DeployPath"
