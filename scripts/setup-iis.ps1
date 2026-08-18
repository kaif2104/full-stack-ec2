Import-Module WebAdministration

$siteName = "FullStackEC2"
$physicalRoot = "C:\inetpub\wwwroot\fullstack-ec2"
$apiPath = "C:\services\FullStackApi"
$frontendPath = Join-Path $physicalRoot "frontend"

New-Item -ItemType Directory -Path $physicalRoot -Force | Out-Null
New-Item -ItemType Directory -Path $frontendPath -Force | Out-Null
New-Item -ItemType Directory -Path $apiPath -Force | Out-Null

if (-not (Get-Website -Name $siteName -ErrorAction SilentlyContinue)) {
    New-Website -Name $siteName -Port 80 -PhysicalPath $frontendPath -ApplicationPool "DefaultAppPool"
}

New-WebApplication -Site $siteName -Name "api" -PhysicalPath $apiPath -ApplicationPool "DefaultAppPool" | Out-Null

Write-Host "IIS site created: http://localhost"
Write-Host "API application path: http://localhost/api"
Write-Host "Frontend static files are in: $frontendPath"
Write-Host "Backend files are in: $apiPath"
