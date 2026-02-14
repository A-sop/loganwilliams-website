# Force-move user data to C:\DATA\00_INBOX, then backup to external HDD
# MUST run as Administrator (Right-click PowerShell -> Run as administrator)

param(
    [string]$BackupDrive = "E:",  # Change to D: or other if your HDD is different
    [switch]$MoveOnly,
    [switch]$BackupOnly
)

$ErrorActionPreference = "Continue"
$sources = @(
    'Desktop', 'Documents', 'Downloads',
    'OneDrive',
    'Zoho Docs', 'iCloudPhotos',
    'Pictures', 'Videos', 'Music'
)
# Excluded: OneDrive - DVAG, DVAG, Dropbox, Zoho WorkDrive (left as-is; WorkDrive empty)

# 1. Move/copy everything to 00_INBOX
# OneDrive: COPY only (no delete) - requires OneDrive running to read cloud files; clean up source manually later
if (-not $BackupOnly) {
    foreach ($s in $sources) {
        $src = "C:\Users\inbox\$s"
        $dst = "C:\DATA\00_INBOX\$s"
        if (Test-Path $src) {
            New-Item -ItemType Directory -Force -Path $dst | Out-Null
            if ($s -eq 'OneDrive') {
                Write-Host "Copying (no delete): $s"
                robocopy $src $dst /E /B /R:10 /W:10 /NP
            } else {
                Write-Host "Moving: $s"
                robocopy $src $dst /E /MOVE /B /R:10 /W:10 /NP
            }
            Write-Host "Done: $s"
        }
    }
}

# 2. Backup C:\DATA to external HDD (only if drive exists)
if (-not $MoveOnly) {
    $drive = $BackupDrive.TrimEnd('\')
    if (-not (Test-Path $drive)) {
        Write-Host "SKIP: Backup drive $drive does not exist or is not connected. Run again with -BackupDrive `"X:`" when your HDD is connected."
    } else {
        $backupRoot = "$drive\BACKUPS\DATA_MIRROR"
        New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
        Write-Host "Backing up C:\DATA to $backupRoot"
        robocopy C:\DATA $backupRoot /MIR /COPY:DAT /R:10 /W:10 /NP
        Write-Host "Backup complete"
    }
}
