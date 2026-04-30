#!/bin/bash
# chmod +x scripts/test_routes.sh

BASE_URL="http://localhost:3000"

echo "=== GET /api/cohort/snapshot ==="
echo "HTTP status: $(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/cohort/snapshot")"
echo "Response (first 500 chars): $(curl -s "$BASE_URL/api/cohort/snapshot" | head -c 500)"
echo

echo "=== GET /api/quests/list ==="
echo "HTTP status: $(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/quests/list")"
echo "Response (first 500 chars): $(curl -s "$BASE_URL/api/quests/list" | head -c 500)"
echo

echo "=== GET /api/transactions/seed ==="
echo "HTTP status: $(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/transactions/seed")"
echo "Response (first 500 chars): $(curl -s "$BASE_URL/api/transactions/seed" | head -c 500)"
echo

echo "=== POST /api/insights/generate ==="
echo "HTTP status: $(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/insights/generate" -H "Content-Type: application/json" -d '{"scope":"daily_nudge"}')"
echo "Response (first 500 chars): $(curl -s -X POST "$BASE_URL/api/insights/generate" -H "Content-Type: application/json" -d '{"scope":"daily_nudge"}' | head -c 500)"
echo

echo "=== POST /api/buddy/chat ==="
echo "HTTP status: $(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/buddy/chat" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hey, should i worry about my credit util?"}]}')"
echo "Response (first 500 chars): $(curl -s -X POST "$BASE_URL/api/buddy/chat" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hey, should i worry about my credit util?"}]}' | head -c 500)"
