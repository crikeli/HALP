# HALP
A react application that is like a mini "slack" for when a user needs HALP with something.

To run the application locally, Follow these instructions.
 - Sign up for appbase at [appbase.io](appbase.io]).
 - Follow the instructions and create a new app (It's free).

 - Then, simply run these commands in the terminal in order
`git clone https://github.com/crikeli/HALP`
`cd HALP`
`touch config.json`

 - Retrieve the username and password from appbase.io and populate the config.json file like so:
 
   ```json
  {
  "appbase": {
    "appname": "XXXXX",
    "username": "XXXXXXXXX",
    "password": "XXXXXXXXXXXXXXXXXXXXX",
    "type":  "feed"
    }
  }
  ```
 - Save the file.
 - Finally Run the following command
`python -m SimpleHTTPServer 4000`
