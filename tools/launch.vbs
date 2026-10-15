' Starts the desktop window without showing a console: node tools\shupian.mjs app hub
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
toolsDir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = fso.GetParentFolderName(toolsDir)
sh.Run "node """ & toolsDir & "\shupian.mjs"" app hub", 0, False
