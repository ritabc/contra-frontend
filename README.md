# Contra Visualizer
## By Rita Bennett-Chew
An in-progress application with the ultimate goal of visualizing a contra dance in motion. Utilizes a [Rails API](https://github.com/ritabc/contra-api) which stores data on dances, moves, positions, etc.
Ultimately, a user will be able to log in, draft and save a dance, and select a dance to visualize. Dances will be composed of: starting formation, first move, ending position of that move, second move, ending position of that move, ... last move, ending position of that move.

## Future Goals
### Deploy
- Secure Rails API and host it somewhere (Heroku?)
- Host Angular Frontend (Firebase?)
-  **https://www.codewithjason.com/deploy-rails-application-angular-cli-webpack-front-end/**

### Current Task: Fix moves (update positioning after each move). Use debugger to investigate where each bird is (visually and within the code) at the beginning and end of each move
### Compose a dance, add it to the db (Up A pickle?)
###  Code for progression (for Heartbeat)
- Would it make sense to have a class to distinguish which h4 a dancer is in? Instead of having <div class='first-hands4'>< /dancer>< /dancer></div>; have <div class='hands-four-one'><dancer class='h4-1'>, etc.
### Have logins (google seems easiest)
- how will this work with API calls?
### Brainstorm and research color/visualization schemes for more accessible color combinations
### Media queries
### Feedback button to submit requests for edits/additions of moves/positions, feature requests, or general feedback

## Notes
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.5.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
