$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    'D:\Bank\Requirements_Document.docx',
    'D:\Bank\Design_Document.docx',
    'D:\Bank\Test_Plan_Document.docx'
)

foreach ($filePath in $files) {
    Write-Output "========== FILE: $filePath =========="
    $doc = $word.Documents.Open($filePath)
    Write-Output $doc.Content.Text
    $doc.Close($false)
    Write-Output ""
}

$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
