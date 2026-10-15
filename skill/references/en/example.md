# Plan: Prompt plan helper

Status: In progress　　Updated: 2026-10-15

## 1 Basics

Description: A writing template for the plan of a new project. The plan is filled in on a page, an AI builds from it, and progress and issues can be checked at any time while it is built.
Intended users: People who build things with an AI and do not need to know code; the thing may be a website, an app, a game or something else.
Outcome: A plan an AI can follow directly, and a separate feature list that is kept up to date once building starts.

## 2 Usage flow

Write the plan: give the idea to the AI → the AI writes the plan → read and edit it on the page → once nothing is TBD and it is confirmed, building starts
Fill it in yourself: start a blank plan or view the example → click each block and follow the hints in the box → fill in what is TBD → confirm
Check progress: once building has started, open the feature list → see the progress of each feature and its open issues → progress updates by itself when the AI finishes a feature
Report an issue: in the feature list click the "+" next to a feature, or open the floating window on a web page → write the issue, type @ to switch feature → the AI reads it and fixes it
Find a folder: press the desktop shortcut → a small window opens at the bottom right of the screen listing recent folders → copy the path to open it in a command line, or open its plan
Mark what to change: open the small window on the page being built → pick an element, select a region or record the current page → write one line → copy it to the AI

## 3 Pages

### 3.1 Plan page

Page purpose: Before building starts it is the plan; once building starts there is a separate feature list and the initial plan no longer changes. View and edit the content, and see the progress and issues of each feature.
Page elements:
- Tabs: one per open project, which can be closed and added; the desktop version has an extra "Recent" tab
- Project status or feature list: what each feature does, its progress and open issues; in the feature list each feature has a "+" for writing an issue
- Each block of content: click it to turn it into a large box, click outside to save; the box shows what the block should say, with an example
- Count of items still to fill in: click to jump to the next one
- Confirm and start: confirms once nothing is TBD
- Language: a drop-down to choose 中文 or English
- More: contents, copy everything, export, view the example, new, import, connect a folder, download the desktop version
Entry point: opening the web page, or "Open plan" for a folder under "Recent"

### 3.2 Recent

Page purpose: Lists the recently used folders, with one click to open the plan or copy the path.
Page elements:
- Folders in use: those with recent activity, marked "In use"
- Recent and connected folders: each with its full path and progress
- Open plan: opens it in a new tab
- Copy path: copies the full path, with "Handy for opening a CLI" beside it
- Choose another folder: opens the system folder picker
Entry point: the desktop shortcut, or the "Recent" tab on the plan page

### 3.3 Mark what to change (small floating window)

Page purpose: Marks what to change on the page being built and produces text that can be sent straight to an AI.
Page elements:
- Pick an element: click an element on the page to record its position, text and styles
- Region screenshot: select a region on the page and save it as an image
- Current page: records the address, title, window size, visible headings and buttons in one click and saves a screenshot of the whole view
- Change description: what needs to change
- Copy text, Copy screenshot: copy them out and send them to the AI
Entry point: the chip button on the page being built, or Alt+Shift+S

## 4 Features

### 4.1 View and edit

Feature description: Shows the plan as a readable page; clicking any block edits it in place, and it can be changed at any time.
Acceptance criteria:
- Click a block, edit it, click outside: it is saved and shown
- Add a page or feature: enter a name; an empty or duplicate name is rejected; on success a set of empty fields appears
- Delete a page or feature: it can be undone
- Edit a confirmed plan before building starts: the status stays Confirmed
Constraints: page and feature names are unique; numbers only grow and are never renumbered
Progress: Done

### 4.2 Project status and feature list

Feature description: Shows what each feature does and how far it is; once building starts a separate feature list is created where issues can be recorded under a feature.
Acceptance criteria:
- A feature block has a progress line: shown as Not started, In progress or Done, with a count of each
- The AI or another editor changes the plan file: the page updates within a few seconds without a refresh
- Click a progress label: it cycles through the three and is written back to the plan
- After building starts: two tabs, "Feature list" and "Initial plan", and the feature list opens first
Constraints: a feature without a progress line counts as Not started
Progress: Done

### 4.3 Report an issue

Feature description: Records an issue under a feature in the feature list; the AI reads it and fixes it, and it is then marked "Fixed".
Acceptance criteria:
- Click the "+" next to a feature: a small window opens with that feature selected; typing @ switches to another feature
- Add: the issue is written under "Issues" in that feature block, with the date
- Fixed: clicking it prefixes the issue with "Fixed:" and removes it from the open list
- Delete: it can be undone
Constraints: an issue is text only, without pictures
Progress: Done

### 4.4 Tabs

Feature description: Several projects are open in one window and switched with tabs; the desktop version has an extra "Recent" tab.
Acceptance criteria:
- "Open plan" under "Recent": opens a new tab without replacing another
- Close a tab: nothing is lost, and it can be reopened later from "More"
- Refresh the page: the open tabs and the current tab are kept
Constraints: when the tabs do not fit they scroll sideways and do not wrap
Progress: Done

### 4.5 Recent folders

Feature description: Lists the recently used folders so they need not be looked up by hand; copying the path makes it easy to open in a command line.
Acceptance criteria:
- Opened with the desktop shortcut: recently used folders come first and one click opens their plan
- Each folder has "Copy path", with "Handy for opening a CLI" beside it
- The plan is changed on the page: it is saved into the folder; it is changed in the folder: it is read into the page; changed in both: a dialog asks which to keep
Constraints: "In use" is inferred from recent activity and is not necessarily the current window; without the desktop version the browser's own folder picker is used, which only works in Chrome and Edge on a computer
Progress: Done

### 4.6 Mark what to change (small floating window)

Feature description: Marks what to change on a page, selects a region and records the current page, and produces text that can be sent straight to an AI.
Acceptance criteria:
- Pick an element: its path, text, size and styles are recorded
- Region screenshot: the window hides first, a region is dragged out and saved as an image; with the browser extension a real screenshot is used, otherwise it is labelled as a pseudo screenshot
- Current page: the address, title, window size, visible headings and button text and recent errors are recorded in one click, together with a screenshot of the whole view
- Copy text: the text carries the page address, window size, element, styles, change description and errors
Constraints: cross-origin images and fonts appear blank in a pseudo screenshot
Progress: Done

### 4.7 Import, export, copy and example

Feature description: Brings the plan into and out of the page, and provides an example.
Acceptance criteria:
- Copy everything, copy prompt: when the browser does not allow writing to the clipboard, a box with the full text opens for copying by hand
- Export: gives a md file whose name carries the date and time
- Import: replaces the whole plan and can be undone; when the format is not recognised the original text goes under "Not recognised"
- View example: loads the example in the current language, which is this plan itself
Constraints: export followed by import gives the same content; fields left empty are written as "TBD: missing ..." on export
Progress: Done

### 4.8 Confirmation check

Feature description: Counts what is still TBD and, once confirmed, changes the status to approved.
Acceptance criteria:
- Confirm while items remain to fill in: the count is shown and the status stays
- Confirm with nothing left to fill in: the status becomes Confirmed, and until building starts the plan is simply updated
Constraints: building does not start before confirmation
Progress: Done

### 4.9 Desktop version and shortcut

Feature description: A shortcut opens a small window at the bottom right of the screen without opening a website first; the desktop version can be downloaded from the page.
Acceptance criteria:
- The desktop version is one exe: after a double click it waits in the tray, and Ctrl+Alt+S opens the small window
- The small window sits at the bottom right of the screen
- "More" on the page has "Download the desktop version", served from the site itself
- Without the desktop version, start.bat starts it and start-debug.bat debugs it
Constraints: Windows only; the exe is not digitally signed, so the system warns the first time it runs
Progress: In progress

### 4.10 Chinese and English

Feature description: The interface, templates, field guide, examples and prompts all exist in Chinese and English.
Acceptance criteria:
- The interface language is a drop-down and defaults to the browser language
- A new plan uses the template of the current interface language
- Chinese and English plans can both be read, with TBD and progress counted
Constraints: the build fails when an interface string has no English entry
Progress: Done

### 4.11 AI instructions and command line

Feature description: Lets an AI check the plan, update progress and handle issues without opening the page.
Acceptance criteria:
- Check: prints the status, where things are TBD and duplicate names; the exit code is 0 when nothing is TBD
- Update progress: writes it back to the plan by feature name
- AI instructions: cover organising the plan, updating progress, handling issues and a decoupled architecture by default
Progress: Done

### 4.12 Real screenshots in the extension

Feature description: With the browser extension installed, screenshots use the browser's own real capture.
Acceptance criteria:
- Region screenshot in Chrome: the picture is labelled "Screenshot"
Constraints: needs to be confirmed once in a real Chrome
Progress: In progress

## 5 Information to keep

- Plan: one md including its status; kept after a refresh; there can be several projects
- Open tabs: which projects are open and which is current; kept after a refresh
- Folder permission and connection history: folders that were connected; kept after a refresh
- Floating window position: the position of the window and the button; kept after a refresh

## 6 Style

Visual style: black and white, simple, white background, content in one centred column, uncrowded when the window is small
References: none
Exclusions: no pop-ups that interrupt, nothing that needs code knowledge to understand, no dashed lines

## 7 Environment and requirements

Platform: web, desktop software (Windows only)
Application type: tool
Interface languages: Chinese and English
Asset sources: the icon is drawn in code
Accounts and sign-in: not needed
Other requirements: the architecture is decoupled by default, with modules communicating only through interfaces
