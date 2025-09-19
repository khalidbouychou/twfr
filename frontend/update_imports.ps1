
$content = Get-Content "src/components/Dashboard/UserDashboard.jsx" -Raw
$newImports = "import { LogOut, UserRoundCog } from `"lucide-react`";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from `"../ui/dropdown-menu`";"
$content = $content -replace "import { LogOut, UserRoundCog } from `"lucide-react`";", $newImports
Set-Content "src/components/Dashboard/UserDashboard.jsx" -Value $content
Write-Host "Imports updated successfully"

