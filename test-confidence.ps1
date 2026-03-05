# Test confidence calculation with different scenarios

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Confidence Level Calculation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Unanimously POSITIVE (The Matrix - all 10s)
Write-Host "1. THE MATRIX - Unanimous positive reviews" -ForegroundColor Green
$matrix = Invoke-RestMethod -Uri "http://localhost:3000/api/reviews?id=tt0133093"
$matrixRatings = $matrix.reviews | Where-Object { $_.rating -ne $null } | Select-Object -ExpandProperty rating
$matrixSentiment = Invoke-RestMethod -Uri "http://localhost:3000/api/sentiment" -Method POST -Body (@{reviews=$matrix.reviews} | ConvertTo-Json -Depth 10) -ContentType "application/json"

Write-Host "   Reviews: $($matrix.reviews.Count)" -ForegroundColor White
Write-Host "   Avg Rating: $([math]::Round(($matrixRatings | Measure-Object -Average).Average, 1))/10" -ForegroundColor White
Write-Host "   Rating Range: $($matrixRatings | Measure-Object -Minimum -Maximum | % { "$($_.Minimum)-$($_.Maximum)" })" -ForegroundColor White
Write-Host "   Sentiment: $($matrixSentiment.sentiment.classification.ToUpper())" -ForegroundColor Green
Write-Host "   Confidence: $($matrixSentiment.sentiment.confidence)% (HIGH - consistent positive reviews)" -ForegroundColor $(if($matrixSentiment.sentiment.confidence -ge 85){'Green'}else{'Yellow'})

# Test 2: Unanimously NEGATIVE (The Room - all low ratings) 
Write-Host "`n2. THE ROOM - Unanimous negative reviews" -ForegroundColor Red
$room = Invoke-RestMethod -Uri "http://localhost:3000/api/reviews?id=tt0368226"
$roomRatings = $room.reviews | Where-Object { $_.rating -ne $null } | Select-Object -ExpandProperty rating
$roomSentiment = Invoke-RestMethod -Uri "http://localhost:3000/api/sentiment" -Method POST -Body (@{reviews=$room.reviews} | ConvertTo-Json -Depth 10) -ContentType "application/json"

Write-Host "   Reviews: $($room.reviews.Count)" -ForegroundColor White
Write-Host "   Avg Rating: $([math]::Round(($roomRatings | Measure-Object -Average).Average, 1))/10" -ForegroundColor White
Write-Host "   Rating Range: $($roomRatings | Measure-Object -Minimum -Maximum | % { "$($_.Minimum)-$($_.Maximum)" })" -ForegroundColor White
Write-Host "   Sentiment: $($roomSentiment.sentiment.classification.ToUpper())" -ForegroundColor Red
Write-Host "   Confidence: $($roomSentiment.sentiment.confidence)% (HIGH - consistent negative reviews)" -ForegroundColor $(if($roomSentiment.sentiment.confidence -ge 85){'Green'}else{'Yellow'})

# Test 3: MIXED reviews (expected lower confidence)
Write-Host "`n3. BATMAN V SUPERMAN - Mixed reviews" -ForegroundColor Yellow
$bvs = Invoke-RestMethod -Uri "http://localhost:3000/api/reviews?id=tt2975590"
$bvsRatings = $bvs.reviews | Where-Object { $_.rating -ne $null } | Select-Object -ExpandProperty rating
$bvsSentiment = Invoke-RestMethod -Uri "http://localhost:3000/api/sentiment" -Method POST -Body (@{reviews=$bvs.reviews} | ConvertTo-Json -Depth 10) -ContentType "application/json"

Write-Host "   Reviews: $($bvs.reviews.Count)" -ForegroundColor White
Write-Host "   Avg Rating: $([math]::Round(($bvsRatings | Measure-Object -Average).Average, 1))/10" -ForegroundColor White
Write-Host "   Rating Range: $($bvsRatings | Measure-Object -Minimum -Maximum | % { "$($_.Minimum)-$($_.Maximum)" })" -ForegroundColor White
Write-Host "   Sentiment: $($bvsSentiment.sentiment.classification.ToUpper())" -ForegroundColor Yellow
Write-Host "   Confidence: $($bvsSentiment.sentiment.confidence)% (LOWER - reviews vary widely)" -ForegroundColor $(if($bvsSentiment.sentiment.confidence -lt 75){'Yellow'}else{'Red'})

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Confidence Calculation Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Confidence now considers:" -ForegroundColor White
Write-Host "  ✓ Number of reviews (more = higher)" -ForegroundColor Gray
Write-Host "  ✓ Rating consistency (lower variance = higher)" -ForegroundColor Gray
Write-Host "  ✓ Alignment with classification (strong match = higher)" -ForegroundColor Gray
Write-Host "  ✓ Sentiment clarity (unanimous = higher)" -ForegroundColor Gray

Write-Host "`nExpected Results:" -ForegroundColor White
Write-Host "  • Unanimous positive → HIGH confidence (85-95%)" -ForegroundColor Green
Write-Host "  • Unanimous negative → HIGH confidence (85-95%)" -ForegroundColor Red
Write-Host "  • Mixed/divisive → LOWER confidence (60-75%)" -ForegroundColor Yellow
Write-Host ""
