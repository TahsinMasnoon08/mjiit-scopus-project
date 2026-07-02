@echo off
cd /d "C:\Users\USER\Desktop\MJIIT Spocus Project"

echo Starting Scopus backend...
start "Scopus Backend" cmd /k "node server.js"

echo Waiting 10 seconds for backend to start...
timeout /t 10

echo Running Scopus API publication import...
start "" "http://localhost:5000/api/import-all-publications"

echo Waiting 60 seconds before Power Automate starts...
timeout /t 60

echo Running Power Automate Desktop flow...
start "" "ms-powerautomate:/console/flow/run?environmentid=one-drive-environment-Id&workflowid=5ebc0d09-afe4-40c8-9bbb-4c40c4086ad0&source=Shortcut"

echo Update process started.
exit