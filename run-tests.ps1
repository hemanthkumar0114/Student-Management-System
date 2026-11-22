$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Push-Location "$RootDir/Backend/Hibernate"
try {
    & .\mvnw.cmd test
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
