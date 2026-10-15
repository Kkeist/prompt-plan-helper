# Plan: Pomodoro timer (example)

Status: In progress　　Updated: 2026-01-01

## 1 Basics

Description: A timer that counts 25 minutes of work and 5 minutes of rest, over and over.
Intended users: People who need to focus, sitting at a computer.
Outcome: They know how many rounds they focused today.

## 2 Usage flow

Start a round: click Start → see the countdown → hear a sound when time is up → rest starts automatically
Change durations: open Settings → change the work and rest minutes → click Save → back to the timer
See today: click Today → see how many rounds were finished today

## 3 Pages

### 3.1 Timer page

Page purpose: Watch the countdown, start or pause it.
Page elements:
- Countdown: shows the minutes and seconds left; drops by one each second
- Start button: starts the countdown; turns into Pause when clicked
- Settings button: goes to the settings page
Entry point: it is the first thing they see

### 3.2 Settings page

Page purpose: Change the work and rest minutes.
Page elements:
- Work minutes: a whole number from 1 to 120
- Save button: saves the settings; goes back to the timer page
Entry point: the Settings button on the timer page

## 4 Features

### 4.1 Countdown

Feature description: Counts down the set number of minutes and alerts at the end.
Acceptance criteria:
- Set 25 minutes and click Start: it drops by one each second and a sound plays at 0
- Click Pause during the countdown: the number stops; click again to continue
- Close during the countdown and reopen: back to the set value, not counting
Constraints: minutes must be a whole number from 1 to 120
Progress: Done

### 4.2 Rounds today

Feature description: Adds one for every finished work round and shows it under Today.
Acceptance criteria:
- A work round finishes: today's count goes up by one
- Open it the next day: the count starts from 0
Constraints: rest does not count as a round
Progress: In progress

## 5 Information to keep

- Settings: work minutes, rest minutes; kept for next time
- Rounds per day: date, number of rounds; kept for next time

## 6 Style

Visual style: white background, very simple, like a notebook
References: like the timer that comes with the system
Exclusions: no ads, no pop-ups that interrupt

## 7 Environment and requirements

Platform: web, phone app
Application type: tool
Interface languages: Chinese and English
Asset sources: a free sound effect; the icon is drawn by hand
Accounts and sign-in: not needed
Other requirements: none

## Original description

I want a pomodoro timer: 25 minutes of work, 5 minutes of rest, works on phone and computer, and it would be nice to see how many rounds I did today.
