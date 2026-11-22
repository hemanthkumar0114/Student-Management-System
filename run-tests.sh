#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$ROOT_DIR/Backend/Hibernate"
./mvnw test

cd "$ROOT_DIR/Frontend/student-management-frontend"
npm test
