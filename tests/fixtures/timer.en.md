# Plan: Pomodoro timer (example)

Status: In progress　　Updated: 2026-01-01

## 1 What it is

What it is: A timer that counts 25 minutes of work and 5 minutes of rest, over and over.
Who it is for: People who need to focus, sitting at a computer.
What they get from it: They know how many rounds they focused today.

## 2 How it is used

Start a round: click Start → see the countdown → hear a sound when time is up → rest starts automatically
Change durations: open Settings → change the work and rest minutes → click Save → back to the timer
See today: click Today → see how many rounds were finished today

## 3 Pages

### 3.1 Timer page

What this page is for: Watch the countdown, start or pause it.
What is on the page:
- Countdown: shows the minutes and seconds left; drops by one each second
- Start button: starts the countdown; turns into Pause when clicked
- Settings button: goes to the settings page
How the user gets here: it is the first thing they see

### 3.2 Settings page

What this page is for: Change the work and rest minutes.
What is on the page:
- Work minutes: a whole number from 1 to 120
- Save button: saves the settings; goes back to the timer page
How the user gets here: the Settings button on the timer page

## 4 Features

### 4.1 Countdown

What it does: Counts down the set number of minutes and alerts at the end.
Done when:
- Set 25 minutes and click Start: it drops by one each second and a sound plays at 0
- Click Pause during the countdown: the number stops; click again to continue
- Close during the countdown and reopen: back to the set value, not counting
Limits: minutes must be a whole number from 1 to 120
Progress: Done

### 4.2 Rounds today

What it does: Adds one for every finished work round and shows it under Today.
Done when:
- A work round finishes: today's count goes up by one
- Open it the next day: the count starts from 0
Limits: rest does not count as a round
Progress: In progress

## 5 Information to remember

- Settings: work minutes, rest minutes; kept for next time
- Rounds per day: date, number of rounds; kept for next time

## 6 Style

Style you want: white background, very simple, like a notebook
Anything to refer to: like the timer that comes with the system
Must not have: no ads, no pop-ups that interrupt

## 7 Use and requirements

Where it is used: phone and computer
Which languages: Chinese and English
Where images, texts and sounds come from: a free sound effect; the icon is drawn by hand
Accounts or sign-in: not needed
Anything else: none

## Original description

I want a pomodoro timer: 25 minutes of work, 5 minutes of rest, works on phone and computer, and it would be nice to see how many rounds I did today.
