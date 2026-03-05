# Test script to compare sentiment analysis for good vs bad movies

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Sentiment Analysis Accuracy" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: The Matrix (Good Movie - 8.7/10)
Write-Host "1. THE MATRIX (1999) - IMDb: 8.7/10" -ForegroundColor Green
Write-Host "Expected: POSITIVE sentiment`n" -ForegroundColor Gray

$matrixReviews = (Invoke-WebRequest -Uri "http://localhost:3000/api/reviews?id=tt0133093" -UseBasicParsing).Content | ConvertFrom-Json
$matrixRatings = $matrixReviews.reviews | Where-Object { $_.rating -ne $null } | Select-Object -ExpandProperty rating
$avgMatrix = ($matrixRatings | Measure-Object -Average).Average

Write-Host "  Reviews scraped: $($matrixReviews.reviews.Count)" -ForegroundColor White
Write-Host "  Average rating: $([math]::Round($avgMatrix, 1))/10" -ForegroundColor White
Write-Host "  Sample ratings: $($matrixRatings[0..4] -join ', ')...`n" -ForegroundColor White

$matrixSentiment = Invoke-RestMethod -Uri "http://localhost:3000/api/sentiment" -Method POST -Body (@{reviews=$matrixReviews.reviews} | ConvertTo-Json -Depth 10) -ContentType "application/json"
Write-Host "  Sentiment: $($matrixSentiment.sentiment.classification.ToUpper())" -ForegroundColor $(if($matrixSentiment.sentiment.classification -eq 'positive'){'Green'}else{'Red'})
Write-Host "  Confidence: $($matrixSentiment.sentiment.confidence)%" -ForegroundColor White
Write-Host "  Summary: $($matrixSentiment.sentiment.summary.Substring(0, [Math]::Min(150, $matrixSentiment.sentiment.summary.Length)))...`n" -ForegroundColor Gray

# Test 2: The Room (Bad Movie - 3.6/10)
Write-Host "`n2. THE ROOM (2003) - IMDb: 3.6/10" -ForegroundColor Red
Write-Host "Expected: NEGATIVE or MIXED sentiment`n" -ForegroundColor Gray

$roomReviews = (Invoke-WebRequest -Uri "http://localhost:3000/api/reviews?id=tt0368226" -UseBasicParsing).Content | ConvertFrom-Json
$roomRatings = $roomReviews.reviews | Where-Object { $_.rating -ne $null } | Select-Object -ExpandProperty rating
$avgRoom = ($roomRatings | Measure-Object -Average).Average

Write-Host "  Reviews scraped: $($roomReviews.reviews.Count)" -ForegroundColor White
Write-Host "  Average rating: $([math]::Round($avgRoom, 1))/10" -ForegroundColor White
Write-Host "  Sample ratings: $($roomRatings[0..4] -join ', ')...`n" -ForegroundColor White

$roomSentiment = Invoke-RestMethod -Uri "http://localhost:3000/api/sentiment" -Method POST -Body (@{reviews=$roomReviews.reviews} | ConvertTo-Json -Depth 10) -ContentType "application/json"
Write-Host "  Sentiment: $($roomSentiment.sentiment.classification.ToUpper())" -ForegroundColor $(if($roomSentiment.sentiment.classification -eq 'negative' -or $roomSentiment.sentiment.classification -eq 'mixed'){'Yellow'}else{'Red'})
Write-Host "  Confidence: $($roomSentiment.sentiment.confidence)%" -ForegroundColor White
Write-Host "  Summary: $($roomSentiment.sentiment.summary.Substring(0, [Math]::Min(150, $roomSentiment.sentiment.summary.Length)))...`n" -ForegroundColor Gray

# Results Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Results Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "The Matrix:   " -NoNewline
Write-Host $matrixSentiment.sentiment.classification.ToUpper() -ForegroundColor $(if($matrixSentiment.sentiment.classification -eq 'positive'){'Green'}else{'Red'}) -NoNewline
Write-Host " (Expected: POSITIVE) - " -NoNewline
Write-Host $(if($matrixSentiment.sentiment.classification -eq 'positive'){'✓ PASS'}else{'✗ FAIL'}) -ForegroundColor $(if($matrixSentiment.sentiment.classification -eq 'positive'){'Green'}else{'Red'})

Write-Host "The Room:     " -NoNewline
Write-Host $roomSentiment.sentiment.classification.ToUpper() -ForegroundColor $(if($roomSentiment.sentiment.classification -ne 'positive'){'Yellow'}else{'Red'}) -NoNewline
Write-Host " (Expected: NEGATIVE/MIXED) - " -NoNewline
Write-Host $(if($roomSentiment.sentiment.classification -ne 'positive'){'✓ PASS'}else{'✗ FAIL'}) -ForegroundColor $(if($roomSentiment.sentiment.classification -ne 'positive'){'Green'}else{'Red'})

Write-Host "`n"
