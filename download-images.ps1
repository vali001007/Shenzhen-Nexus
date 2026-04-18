$outDir = "d:\AI coding\Shenzhen Nexus\traveler-web\public\images\top-spots"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$images = @{
    "pingan.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Ping_An_Finance_Center_-_2018-11-30.jpg/800px-Ping_An_Finance_Center_-_2018-11-30.jpg"
    "talentpark.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Shenzhen_Skyline_from_Futian_District2.jpg/800px-Shenzhen_Skyline_from_Futian_District2.jpg"
    "bayglory.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bay_Glory_Shenzhen.jpg/800px-Bay_Glory_Shenzhen.jpg"
    "dji.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/DJI_Sky_City_202209.jpg/800px-DJI_Sky_City_202209.jpg"
    "byd.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/BYD_04.JPG/800px-BYD_04.JPG"
    "hqb.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Huaqiangbei_Commercial_Street.jpg/800px-Huaqiangbei_Commercial_Street.jpg"
    "seaworld.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sea_World_in_Shekou_Shenzhen2021.jpg/800px-Sea_World_in_Shekou_Shenzhen2021.jpg"
    "dafen.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Artists_at_work_in_Dafen_Oil_Painting_Village.jpg/800px-Artists_at_work_in_Dafen_Oil_Painting_Village.jpg"
}

foreach ($entry in $images.GetEnumerator()) {
    $dest = Join-Path $outDir $entry.Key
    Write-Host "Downloading $($entry.Key)..."
    try {
        Invoke-WebRequest -Uri $entry.Value -OutFile $dest -TimeoutSec 20
        $size = (Get-Item $dest).Length
        Write-Host "  OK ($size bytes)"
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)"
    }
}
Write-Host "Done."
