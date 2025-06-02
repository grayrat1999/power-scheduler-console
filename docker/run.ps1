#!/usr/bin/env pwsh

param (
  [string]$repo = "",
  [string]$tag = "latest",
  [string]$server_host="127.0.0.1",
  [string]$server_port="8080"
)

if (-not [string]::IsNullOrEmpty($repo))
{
  $repo = "$repo/"
}

echo $repo

docker run `
  -d `
  -p 80:80 `
  -e API_SERVER_HOST=$server_host `
  -e API_SERVER_PORT=$server_port `
  ${repo}power-scheduler-console:$tag