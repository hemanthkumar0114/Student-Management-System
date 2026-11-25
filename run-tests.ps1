$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Push-Location "$RootDir/Backend/Hibernate"
try {
    $mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvnCmd) {
        & mvn test
    } else {
        $cachedMvn = Get-ChildItem -Path "$env:USERPROFILE\.m2\wrapper\dists" -Filter "mvn.cmd" -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($cachedMvn) {
            & $cachedMvn.FullName test
        } else {
            & .\mvnw.cmd test
        }
    }
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}

Push-Location "$RootDir/Frontend/student-management-frontend"
try {
    npm test
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}
