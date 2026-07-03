$BaseUrl = if ($env:BACKEND_URL) { $env:BACKEND_URL } else { "http://localhost:8080" }
$Email = "integration+$([guid]::NewGuid().ToString('N').Substring(0,8))@heroes-online.test"
$Username = "user_$([guid]::NewGuid().ToString('N').Substring(0,8))"
$Password = "IntegrationTest1!"

function Test-AuthContract {
  param(
    [string]$Label,
    [object]$Body
  )

  $requiredTop = @("success", "data", "meta")
  $requiredData = @("account", "tokens")
  $requiredAccount = @("id", "username", "email")
  $requiredTokens = @("accessToken", "refreshToken")
  $requiredMeta = @("timestamp", "requestId")

  foreach ($key in $requiredTop) {
    if (-not $Body.PSObject.Properties.Name.Contains($key)) {
      throw "$Label missing top-level field: $key"
    }
  }

  if ($Body.success -ne $true) {
    throw "$Label success is not true"
  }

  foreach ($key in $requiredData) {
    if (-not $Body.data.PSObject.Properties.Name.Contains($key)) {
      throw "$Label missing data field: $key"
    }
  }

  foreach ($key in $requiredAccount) {
    if (-not $Body.data.account.PSObject.Properties.Name.Contains($key)) {
      throw "$Label missing account field: $key"
    }
  }

  foreach ($key in $requiredTokens) {
    if (-not $Body.data.tokens.PSObject.Properties.Name.Contains($key)) {
      throw "$Label missing tokens field: $key"
    }
  }

  foreach ($key in $requiredMeta) {
    if (-not $Body.meta.PSObject.Properties.Name.Contains($key)) {
      throw "$Label missing meta field: $key"
    }
  }
}

Write-Host "Integration check: $BaseUrl"
Write-Host "Register: $Email"

$registerBody = @{
  email    = $Email
  username = $Username
  password = $Password
} | ConvertTo-Json

$register = Invoke-RestMethod `
  -Uri "$BaseUrl/api/v1/account/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $registerBody

Test-AuthContract -Label "register" -Body $register
Write-Host "OK register contract"

$loginBody = @{
  email    = $Email
  password = $Password
} | ConvertTo-Json

try {
  $login = Invoke-RestMethod `
    -Uri "$BaseUrl/api/v1/account/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

  Test-AuthContract -Label "login" -Body $login
  Write-Host "OK login contract"
}
catch {
  $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
  if ($errorBody.error.code -eq "ACCOUNT_NOT_ACTIVE") {
    Write-Warning "login returned ACCOUNT_NOT_ACTIVE (expected for PendingVerification accounts per domain spec)"
    Write-Warning "register still issues tokens; login requires Active status"
  }
  else {
    throw
  }
}

Write-Host "Integration check passed"
