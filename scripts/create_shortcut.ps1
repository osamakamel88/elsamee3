$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "elsamee3.lnk"
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "e:\elsamee3\start_elsamee3.bat"
$Shortcut.WorkingDirectory = "e:\elsamee3"
$Shortcut.IconLocation = "e:\elsamee3\assets\elsamee3.ico,0"
$Shortcut.Description = "Launch elsamee3 Copyright Guardian"
$Shortcut.Save()
Write-Output "SUCCESS: Created $ShortcutPath"
