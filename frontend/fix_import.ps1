$content = Get-Content "src/components/Navbar.jsx" -Raw; $content = $content -replace "../ui/dropdown-menu", "./ui/dropdown-menu"; Set-Content "src/components/Navbar.jsx" -Value $content
