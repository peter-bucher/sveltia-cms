@echo off

set NodePath=C:\PortablePrograms\PortableApps\node22.5.1

set Path=%NodePath%;%Path%
start cmd /k "title Pfad "%NodePath%" aktiviert && node server.cjs"