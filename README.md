# A Contra Visualizer
## By Rita Bennett-Chew

## Sample gif - Don Flaherty's Heartbeat Contra
![HeartbeatContraByDonFlahertys](https://user-images.githubusercontent.com/11031915/81364816-936b0980-90b4-11ea-80ed-c2804a0c26ea.gif)

An in-progress application with the ultimate goal of visualizing contra dances in motion. Utilizes a [Rails API](https://github.com/ritabc/contra-api) which stores data on dances, moves, positions, etc.
Currently, a user can view the complete animation, or a set of coded moves, for one dance (Heartbeat Contra)
Ultimately, I'd like for users to be able to log in, draft and save dances, and select dances to visualize. Dances will be composed of: starting formation, first move, ending position of that move, second move, ending position of that move, ... last move, ending position of that move.

## Future Goals
1. Deploy
- Secure Rails API and host
- Deploy Angular Frontend
1. Compose a dance from web, add it to the db
1. Google OAuth
1. Brainstorm and research color/visualization schemes for more accessible color combinations
1. Media queries
1. Addition of button/form to submit requests for edits/additions of moves/positions, feature requests, or general feedback

## Technologies Used
1. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.5.
2. This project uses the [GreenSock Animation Platform](https://greensock.com/) to compose choreographed dance animations

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## License Information
This software is licensed under the MIT license.
